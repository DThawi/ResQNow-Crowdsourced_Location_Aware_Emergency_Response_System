const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../utils/notificationService");

// Verify Responder
exports.verifyResponder = async (req, res) => {
  try {
    const { userId } = req.params;

    const responder = await User.findById(userId);

    if (!responder || responder.role !== "Authority") {
      return res.status(400).json({ message: "Responder not found" });
    }

    responder.isVerified = true;
    await responder.save();

    // Notify responder
    await sendEmail(
      responder.email,
      "Account Verified",
      "Your responder account has been approved by admin. You can now login."
    );

    res.json({ message: "Responder verified successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all responders (verified and unverified)
exports.getResponders = async (req, res) => {
  try {
    const responders = await User.find({ role: "Authority" }).select("-password");
    res.json(responders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all system users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new system user (by Admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, contact_number, district, organization } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      contact_number,
      district: role === "Authority" ? district : undefined,
      organization: role === "Authority" ? organization : undefined,
      location: {
        type: "Point",
        coordinates: [0, 0] // Default dummy coordinates
      },
      isVerified: true // Admin-created accounts are verified by default
    });

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update system user details
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, contact_number, district, organization } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check email uniqueness if email is changed
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (status) user.status = status;
    if (contact_number) user.contact_number = contact_number;

    if (role === "Authority" || user.role === "Authority") {
      user.district = district || user.district;
      user.organization = organization || user.organization;
    } else {
      user.district = undefined;
      user.organization = undefined;
    }

    if (role === "Authority" && user.role !== "Authority") {
      user.isVerified = true;
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

