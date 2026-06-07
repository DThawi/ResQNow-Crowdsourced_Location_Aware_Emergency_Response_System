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
        const { name, phone, address, profileImage } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { 
                name, 
                contact_number: phone, 
                address,
                image: profileImage 
            },
            { new: true }
        ).select('-password');

        res.status(200).json({ message: "Profile updated ✅", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err.message });
    }
};

// ──  4. CRITICAL MISSING LINK: GET RESPONDERS LIST (FOR FLEET DIRECTORY) ──
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

// ──  5. CRITICAL MISSING LINK: GET ALL USERS (FOR USER MANAGEMENT) ─────────
exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).json({ message: "Failed to load system users", error: err.message });
    }
};
