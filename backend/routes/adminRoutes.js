const express = require("express")
const router = express.Router();
const adminController = require("../controllers/adminController");

const { verifyToken } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Admin verifies responder
router.put(
  "/verify-responder/:userId",
  verifyToken,
  allowRoles("Admin"),
  adminController.verifyResponder
);

// Admin gets all responders
router.get(
  "/responders",
  verifyToken,
  allowRoles("Admin"),
  adminController.getResponders
);

// Admin gets all users
router.get(
  "/users",
  verifyToken,
  allowRoles("Admin"),
  adminController.getAllUsers
);

// Admin creates user
router.post(
  "/users",
  verifyToken,
  allowRoles("Admin"),
  adminController.createUser
);

// Admin updates user
router.put(
  "/users/:id",
  verifyToken,
  allowRoles("Admin"),
  adminController.updateUser
);

// Admin deletes user
router.delete(
  "/users/:id",
  verifyToken,
  allowRoles("Admin"),
  adminController.deleteUser
);

module.exports = router;
