// ============================================
// FILE: authRoutes.js
// PURPOSE: Defines authentication API routes.
//          POST /api/auth/register — Create new account
//          POST /api/auth/login    — Login and get JWT token
// CALLED FROM: server.js (mounted at /api/auth)
// CONNECTED TO: authController.js (register and login logic)
// PROTECTED: No — both routes are public
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');

// --------------------
// 2. ROUTES
// --------------------

// ROUTE: POST /api/auth/register
// Called by: Register.jsx (frontend)
// Creates a new user in the database
// Request body: { name, email, password }
router.post('/register', register);

// ROUTE: POST /api/auth/login
// Called by: Login.jsx (frontend)
// Verifies credentials and returns JWT token
// Request body: { email, password }
router.post('/login', login);

// --------------------
// 3. EXPORT ROUTER
// --------------------
module.exports = router;
