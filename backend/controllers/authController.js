const { sendEmail, sendSMS } = require("../utils/notificationService");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER USER
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      district,
      longitude,
      latitude,
      organization,
      contact_number
    } = req.body;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: "Latitude and Longitude required" });
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ message: "Invalid GPS coordinates" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      district,
      location: {
        type: "Point",
        coordinates: [lng, lat]
      },
      organization,
      contact_number,
      isVerified: role === "Authority" ? false : true // Authorities need approval
    });

    await newUser.save();

    // Notify Admin when responder registers
    if (role === "Authority") {
      await sendEmail(
        "admin@resqnow.com",
        "New Responder Registration",
        `A new responder has registered.\n\nEmail: ${email}\nOrganization: ${organization}`
      );
    }

    res.status(201).json({
      message: role === "Authority"
        ? "Responder registered. Waiting for admin approval."
        : "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Block unverified responders
    if (user.role === "Authority" && !user.isVerified) {
      return res.status(403).json({
        message: "Your account is not verified by admin yet"
      });
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


// FORGOT PASSWORD (OTP)
exports.forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { contact_number: phone }]
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    if (email) {
      await sendEmail(user.email, "Password Reset OTP", `Your OTP is: ${otp}`);
    }

    if (phone) {
      await sendSMS(user.contact_number, `Your OTP is: ${otp}`);
    }

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

    if (!user || user.resetOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

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
