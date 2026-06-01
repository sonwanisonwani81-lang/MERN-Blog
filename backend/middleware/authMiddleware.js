// ============================================
// FILE: authMiddleware.js
// PURPOSE: JWT token verification middleware for protected routes.
//          Extracts token from Authorization header, verifies it,
//          and attaches user data to req.user.
// CALLED FROM: blogRoutes.js — runs before every protected route
// HOW IT WORKS:
//   1. Extracts token from request header
//   2. Verifies token using JWT secret
//   3. If valid → attaches user info to request
//   4. If invalid/expired → returns error
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
const jwt = require('jsonwebtoken');

// --------------------
// 2. PROTECT MIDDLEWARE
// --------------------
// Ensures the request has a valid JWT token.
// Attaches decoded user info (id, role) to req.user.
const protect = (req, res, next) => {

  // Extract token from Authorization header
  // Header format: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token found — user is not logged in
    return res.status(401).json({
      message: 'Access denied. No token provided. Please login first.'
    });
  }

  // Remove "Bearer " prefix to get just the token
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token:
    //   - Checks if it was signed with the correct secret
    //   - Checks if it has expired
    //   - Checks if it has been tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    // decoded contains { id: user._id, role: user.role }
    req.user = decoded;

    // Token is valid — proceed to the next middleware/route handler
    next();

  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({
      message: 'Token is invalid or expired. Please login again.'
    });
  }
};

// --------------------
// 3. ADMIN MIDDLEWARE
// --------------------
// Ensures the authenticated user has the "admin" role.
// Must be used AFTER the protect middleware.
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// --------------------
// 4. EXPORT MIDDLEWARE
// --------------------
module.exports = { protect, adminOnly };
