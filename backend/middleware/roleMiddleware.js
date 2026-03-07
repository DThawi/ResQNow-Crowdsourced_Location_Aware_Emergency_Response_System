const allowRoles = (...roles) => {
  return (req, res, next) => {

    // Check if user exists (verifyToken should run first)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }

    next();
  };
};

module.exports = allowRoles;