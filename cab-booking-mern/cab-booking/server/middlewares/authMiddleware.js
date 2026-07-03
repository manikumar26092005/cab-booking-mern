const jwt = require("jsonwebtoken");

// Verifies JWT token for any logged-in user/admin
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Restricts route access to admin role only
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// Restricts route access to driver role only
const driverMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "driver") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Drivers only." });
  }
};

// Restricts route access to admin OR driver (e.g. shared ride-management endpoints)
const adminOrDriverMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "driver")) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied." });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  driverMiddleware,
  adminOrDriverMiddleware,
};
