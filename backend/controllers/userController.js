const Incident = require('../models/Incident');
const User = require('../models/User');

// ── 1. PROFILE METRICS COUNTER ──────────────────────────────────────────────
exports.getProfileStats = async (req, res) => {
    try {
        const userId = req.user.id; 
        const myReports = await Incident.find({ user_id: userId });

        const stats = {
            all: myReports.length,
            verifications: myReports.reduce((total, incident) => 
                total + (incident.verified_by ? incident.verified_by.length : 0), 0),
            flagged: myReports.filter(r => 
                r.reported_inaccurate_by && r.reported_inaccurate_by.length > 0).length,
            heroBadge: myReports.filter(r => r.status === 'Resolved').length >= 5 ? 1 : 0
        };

        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile stats", error: err.message });
    }
};

// ── 2. GET SINGLE ACTIVE USER PROFILE ────────────────────────────────────────
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ── 3. UPDATE INSTANCE ATTRIBUTES ────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
    try {
        const { 
            name, 
            contact_number, 
            phone, 
            address, 
            profileImage,
            twoFactorEnabled,
            shareLocation,
            shareReports,
            profileVisibility
        } = req.body;
        
        const contactNumber = contact_number || phone;
        const updateObj = {
            name,
            contact_number: contactNumber,
            address,
            ...(profileImage !== undefined ? { profileImage } : {}),
        };

        // Update privacy settings if provided
        if (
            twoFactorEnabled !== undefined ||
            shareLocation !== undefined ||
            shareReports !== undefined ||
            profileVisibility !== undefined
        ) {
            updateObj['privacySettings'] = {
                twoFactorEnabled: twoFactorEnabled !== undefined ? twoFactorEnabled : undefined,
                shareLocation: shareLocation !== undefined ? shareLocation : undefined,
                shareReports: shareReports !== undefined ? shareReports : undefined,
                profileVisibility: profileVisibility !== undefined ? profileVisibility : undefined,
            };
            // Remove undefined values
            Object.keys(updateObj['privacySettings']).forEach(key => 
                updateObj['privacySettings'][key] === undefined && delete updateObj['privacySettings'][key]
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updateObj,
            { new: true }
        ).select('-password');

        res.status(200).json({ message: "Profile updated ✅", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err.message });
    }
};

// ── 4. GET NOTIFICATION SETTINGS ───────────────────────────────────────────
exports.getNotificationSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('notificationSettings');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user.notificationSettings || {});
    } catch (err) {
        res.status(500).json({ message: "Error fetching notification settings", error: err.message });
    }
};

// ── 5. UPDATE NOTIFICATION SETTINGS ────────────────────────────────────────
exports.updateNotificationSettings = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { notificationSettings: req.body },
            { new: true }
        ).select('notificationSettings');

        res.status(200).json({ message: "Notification settings updated ✅", settings: user.notificationSettings });
    } catch (err) {
        res.status(500).json({ message: "Error updating notification settings", error: err.message });
    }
};

// ──  6. CRITICAL MISSING LINK: GET RESPONDERS LIST (FOR FLEET DIRECTORY) ──
exports.getResponders = async (req, res) => {
    try {
        // Query looks for both your new uppercase "Responder" enum and legacy "Authority" strings
        const responders = await User.find({
            $or: [
                { role: 'Responder' },
                { role: 'Authority' }
            ]
        }).sort({ createdAt: -1 }); // Pushes new registrations directly to the top

        res.status(200).json(responders);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch responders layout data", error: err.message });
    }
};

// ──  7. CRITICAL MISSING LINK: GET ALL USERS (FOR USER MANAGEMENT) ─────────
exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).json({ message: "Failed to load system users", error: err.message });
    }
};

// ──  8. DOWNLOAD USER DATA (GDPR COMPLIANCE) ──────────────────────────────
exports.downloadUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });

        const userIncidents = await Incident.find({ user_id: req.user.id });

        const exportData = {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                contact_number: user.contact_number,
                location: user.location,
                profileImage: user.profileImage,
                notificationSettings: user.notificationSettings,
                privacySettings: user.privacySettings,
                registered_date: user.registered_date,
                isVerified: user.isVerified,
                status: user.status,
            },
            incidents: userIncidents.map(inc => ({
                id: inc._id,
                type: inc.type,
                description: inc.description,
                location: inc.location,
                status: inc.status,
                timestamp: inc.timestamp,
                verified_by: inc.verified_by,
                reported_inaccurate_by: inc.reported_inaccurate_by,
            })),
            exportDate: new Date().toISOString(),
        };

        res.status(200).json(exportData);
    } catch (err) {
        res.status(500).json({ message: "Error downloading user data", error: err.message });
    }
};

// ──  9. DELETE USER ACCOUNT ───────────────────────────────────────────────
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete all user's incidents
        await Incident.deleteMany({ user_id: userId });

        // Delete user account
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Account deleted successfully ✅" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting account", error: err.message });
    }
};
