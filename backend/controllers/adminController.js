const User = require("../models/User");
const bcrypt = require("bcryptjs");

const normalizePath = (p) => {
  if (!p) return "";
  if (p.startsWith("http")) return p;
  const parts = p.split(/[\\/]/);
  const filename = parts[parts.length - 1];
  return `uploads/${filename}`;
};

// ── A. GET ALL RESPONDERS (FOR RESPONDER MANAGEMENT PANEL) ──────────────────
exports.getResponders = async (req, res) => {
  try {
    // 🎯 FIX: Query pulls both legacy "Authority" and new uppercase "Responder" formats
    const responders = await User.find({
      $or: [
        { role: "Responder" },
        { role: "Authority" }
      ]
    }).sort({ createdAt: -1 }); // Newest sign-ups appear at the very top of the table!

    const normalizedResponders = responders.map(responder => {
      const r = responder.toObject();
      if (r.documents) {
        r.documents.officialIdPath = normalizePath(r.documents.officialIdPath);
        r.documents.authLetterPath = normalizePath(r.documents.authLetterPath);
        r.documents.certCardsPath = normalizePath(r.documents.certCardsPath);
      }
      return r;
    });

    res.status(200).json(normalizedResponders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch responders list", error: error.message });
  }
};

// ── B. GET ALL SYSTEM USERS (FOR GENERAL LOOKUP SCREEN) ─────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}).sort({ createdAt: -1 });
    
    const normalizedUsers = allUsers.map(user => {
      const u = user.toObject();
      if (u.documents) {
        u.documents.officialIdPath = normalizePath(u.documents.officialIdPath);
        u.documents.authLetterPath = normalizePath(u.documents.authLetterPath);
        u.documents.certCardsPath = normalizePath(u.documents.certCardsPath);
      }
      return u;
    });

    res.status(200).json(normalizedUsers);
  } catch (error) {
    res.status(500).json({ message: "Failed to load comprehensive users directory", error: error.message });
  }
};

// ── C. ADMIN MANUALLY CREATES USER PROFILE ──────────────────────────────────
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, contact_number, district, organization } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User profile already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      contact_number,
      district,
      organization,
      status: "Active", // Manually added users default to Active instantly
      isVerified: true
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Manual generation failed", error: error.message });
  }
};

// ── D. ADMIN METRICS UPDATE CONTEXT ─────────────────────────────────────────
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, status, contact_number, district, organization } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, role, status, contact_number, district, organization },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Update configuration failed", error: error.message });
  }
};

// ── E. REMOVE USER PERMANENTLY ──────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return res.status(404).json({ message: "User profile target not located" });
    res.status(200).json({ message: "User deleted from system data grids successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion thread failed", error: error.message });
  }
};

// ── F. ADMIN APPROVAL METHOD (FALLBACK HOOK) ────────────────────────────────
exports.verifyResponder = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User profile target not located" });

    user.status = "Approved";
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Responder verification completed cleanly" });
  } catch (error) {
    res.status(500).json({ message: "Verification processing failed", error: error.message });
  }
};
