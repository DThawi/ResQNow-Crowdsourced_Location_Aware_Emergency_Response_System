const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Authentication routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route (token required)
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});



// RBAC Test Routes

// Admin only
router.get("/admin-dashboard", verifyToken, allowRoles("Admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

// Citizen only
router.get("/citizen-dashboard", verifyToken, allowRoles("Citizen"), (req, res) => {
  res.json({ message: "Welcome Citizen" });
});


module.exports = router;

router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);


