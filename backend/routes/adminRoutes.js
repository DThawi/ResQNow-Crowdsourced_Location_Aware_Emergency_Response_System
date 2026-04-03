const adminController = require("../controllers/adminController");

// Admin verifies responder
router.put(
  "/verify-responder/:userId",
  verifyToken,
  allowRoles("Admin"),
  adminController.verifyResponder
);
