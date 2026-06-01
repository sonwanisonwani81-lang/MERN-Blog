// ============================================
// FILE: authController.js
// PURPOSE: Handles user registration and login logic.
//          Register creates a new user with hashed password.
//          Login verifies credentials and returns a JWT token.
// CALLED FROM: authRoutes.js
// CONNECTED TO: User.js model (database operations)
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
const User = require('../models/User');

// bcryptjs — password hashing (encryption)
// We never store passwords in plain text.
// If the database is leaked, hashed passwords are safe.
const bcrypt = require('bcryptjs');

// jsonwebtoken — creates JWT tokens for authentication
// Tokens prove the user is logged in on each request.
const jwt = require('jsonwebtoken');

// --------------------
// 2. HELPER: Validate email format
// --------------------
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// --------------------
// 3. REGISTER FUNCTION
// --------------------
// Creates a new user account in the database.
// Password hashing is handled automatically by the User model's pre-save hook.
// Called by: Register.jsx → POST /api/auth/register
const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    email = email?.trim().toLowerCase();

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required.'
      });
    }

    // Email format validation
    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address.'
      });
    }

    // Password minimum length check
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters.'
      });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'This email is already registered. Please login instead.'
      });
    }

    // Create user — password is automatically hashed by the pre-save hook in User.js
    const newUser = await User.create({
      name,
      email,
      password  // plain text here, hashed automatically before saving
    });

    // 201 = "Created" — new resource was created successfully
    res.status(201).json({
      message: 'Registration successful! Please login now.'
    });

  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({
      message: 'Server error. Please try again later.'
    });
  }
};

// --------------------
// 4. LOGIN FUNCTION
// --------------------
// Verifies email/password and returns a JWT token.
// Called by: Login.jsx → POST /api/auth/login
const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // We don't reveal whether email or password is wrong
      // for security reasons (prevents email enumeration attacks)
      return res.status(400).json({
        message: 'Invalid email or password.'
      });
    }

    // Compare password with stored hash using bcrypt
    // The password is always hashed by the pre-save hook in User.js
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: 'Invalid email or password.'
      });
    }

    // Generate JWT token with user ID and role
    // The token is signed with our secret key
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }  // Token expires in 1 day
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      message: 'Server error. Please try again later.'
    });
  }
};

// --------------------
// 4. EXPORT FUNCTIONS
// --------------------
module.exports = { register, login };
