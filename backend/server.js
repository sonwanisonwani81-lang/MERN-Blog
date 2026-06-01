// ============================================
// FILE: server.js
// PURPOSE: Main entry point for the backend server.
//          Express app is created here, connected to MongoDB,
//          and all routes are registered. Run with "npm run dev".
// CALLED FROM: Terminal — node server.js or npm run dev
// CONNECTED TO: .env (config), authRoutes.js, blogRoutesV2.js
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
// Load environment variables from .env file
require('dotenv').config();

// Express — web framework for creating API routes
const express = require('express');

// cors — allows cross-origin requests
const cors = require('cors');

// Mongoose — MongoDB object modeling for Node.js
const mongoose = require('mongoose');

// Import route files
const authRoutes = require('./routes/authRoutes');
const blogRoutesV2 = require('./routes/blogRoutesV2');
const adminRoutes = require('./routes/adminRoutes');

// --------------------
// 2. CREATE EXPRESS APP
// --------------------
const app = express();

// --------------------
// 3. MIDDLEWARE SETUP
// --------------------
// Enable CORS so frontend (localhost:5173) can call backend (localhost:5000)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// --------------------
// 4. MOUNT ROUTES
// --------------------
// Auth routes — prefix: /api/auth
app.use('/api/auth', authRoutes);

// Blog routes — prefix: /api/blog
app.use('/api/blog', blogRoutesV2);

// Admin routes — prefix: /api/admin
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'MERN Blog Backend is running!' });
});

// --------------------
// 5. GLOBAL ERROR HANDLER
// --------------------
// Catches all unhandled errors from route handlers
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate value. This record already exists.' });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired. Please login again.' });
  }

  // Default server error
  res.status(err.status || 500).json({
    message: err.message || 'Server error. Please try again later.'
  });
});

// --------------------
// 6. CONNECT TO MONGODB AND START SERVER
// --------------------
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });
