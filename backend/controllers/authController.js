const { sendEmail, sendSMS } = require("../utils/notificationService");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ── A. REGISTER FUNCTION ─────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      district,
      longitude,
      latitude,
      organization,
      contact_number,
      role
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { officialId, authLetter, certCards } = req.documentUrls || {};

    const lat = parseFloat(latitude || 0);
    const lng = parseFloat(longitude || 0);

    const userRole = role || "Responder";
    const status = userRole === "Citizen" ? "Active" : "Pending";
    const isVerified = userRole === "Citizen" ? true : false;

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole, 
      district,
      organization,
      contact_number,
      location: {
        type: "Point",
        coordinates: [lng, lat]
      },
      status, 
      isVerified,
      documents: {
        officialIdPath: officialId || "",
        authLetterPath: authLetter || "",
        certCardsPath: certCards || ""
      }
    });

    await user.save();

    if (userRole !== "Citizen") {
      await sendEmail(
        "admin@resqnow.com",
        "New Responder Registration",
        `
New responder registration received.

Name: ${name}
Email: ${email}
Organization: ${organization}
District: ${district}

Please review and approve.
`
      );
    }

    res.status(201).json({
      message: userRole === "Citizen"
        ? "Registration successful. You can now login."
        : "Registration submitted successfully. Waiting for verification."
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ── B. LOGIN FUNCTION WITH REVISED CHECKS ────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.role === "Responder") {
      if (user.status === "Pending") {
        return res.status(403).json({
          message: "Your responder account is still under review."
        });
      }

      if (user.status === "Rejected") {
        return res.status(403).json({
          message: "Your responder registration has been rejected."
        });
      }

      if (user.status === "Suspended") {
        return res.status(403).json({
          message: "Your account has been suspended."
        });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── 🎯 CRITICAL FIX: ADDED MISSING SETUP APPROVED PASSWORD FUNCTION ──
exports.setupApprovedPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    const user = await User.findOne({
      email,
      resetOTP: token,
      otpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "This activation link is invalid or has expired." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetOTP = null;
    user.otpExpire = null;
    user.status = "Approved";
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Password created successfully! You can now login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── C. ADMIN APPROVAL CONTROLLER ENDPOINT ────────────────────────────────────
exports.approveResponder = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.status = "Approved";
    user.isVerified = true;
    await user.save();

    await sendEmail(
      user.email,
      "Responder Application Approved",
      `
Congratulations!

Your ResQNow responder account has been approved.

You can now login to the mobile application.
`
    );

    res.json({
      message: "Responder approved successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ── D. AUXILIARY PROFILE METHODS ────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const user = await User.findOne({ $or: [{ email }, { contact_number: phone }] });

    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    if (email) await sendEmail(user.email, "Password Reset OTP", `Your OTP is: ${otp}`);
    if (phone) await sendSMS(user.contact_number, `Your OTP is: ${otp}`);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VERIFY OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.resetOTP !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpire < Date.now()) return res.status(400).json({ message: "OTP expired" });

    res.json({ message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = null;
    user.otpExpire = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
