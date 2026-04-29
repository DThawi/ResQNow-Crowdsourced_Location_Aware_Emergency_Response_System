const Incident = require('../models/Incident');

exports.getProfileStats = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from verifyToken middleware 

        // Fetch all incidents reported by this specific user 
        const myReports = await Incident.find({ user_id: userId });

        // Calculate stats based on incident status and feedback arrays 
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

    const User = require('../models/User');

// Get current logged in user details
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update profile details
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, address, profileImage } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { 
                name, 
                contact_number: phone, // Mapping frontend 'phone' to backend 'contact_number'
                address,
                image: profileImage 
            },
            { new: true }
        ).select('-password');

        res.status(200).json({ message: "Profile updated ✅", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
};
};
