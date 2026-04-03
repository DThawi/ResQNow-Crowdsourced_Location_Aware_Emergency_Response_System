const User = require("../models/User");
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
