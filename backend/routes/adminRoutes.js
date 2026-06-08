const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

const { verifyToken } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Admin handles individual responder verification actions
router.put(
  "/responders/:id/approve",
  verifyToken,
  allowRoles("Admin"),
  adminController.verifyResponder
);

// Admin pulls responder elements directory
router.get(
  "/responders",
  verifyToken,
  allowRoles("Admin"),
  adminController.getResponders
);

// Admin pulls comprehensive user profiles directory
router.get(
  "/users",
  verifyToken,
  allowRoles("Admin"),
  adminController.getAllUsers
);

// Admin creates a profile manually
router.post(
  "/users",
  verifyToken,
  allowRoles("Admin"),
  adminController.createUser
);

// Admin modifies an existing profile entry context
router.put(
  "/users/:id",
  verifyToken,
  allowRoles("Admin"),
  adminController.updateUser
);

// Admin removes an active profile out of database records completely
router.delete(
  "/users/:id",
  verifyToken,
  allowRoles("Admin"),
  adminController.deleteUser
);

module.exports = router;
