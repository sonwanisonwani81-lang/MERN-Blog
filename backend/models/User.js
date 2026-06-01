// ============================================
// FILE: User.js
// PURPOSE: Defines the User schema for MongoDB.
//          Each user has a name, email, hashed password, and role.
//          Password is automatically hashed before save using bcrypt.
// CALLED FROM: authController.js during register and login
// IMPORTANT: Password is always stored in hashed (encrypted) form,
//            never as plain text. The pre-save hook handles hashing
//            automatically so the controller doesn't need to.
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// --------------------
// 2. USER SCHEMA
// --------------------
const userSchema = new mongoose.Schema({

  // User's name — required field
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true
  },

  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required.'],
    trim: true,
    lowercase: true
  },

  // User's password — always stored as bcrypt hash
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [6, 'Password must be at least 6 characters.']
  },

  // User's role — either "user" or "admin"
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }

}, {
  timestamps: true
});

// --------------------
// 3. INDEXES
// --------------------
// Email index is auto-created due to unique: true
// Index for role-based queries
userSchema.index({ role: 1 });

// --------------------
// 4. PRE-SAVE HOOK — Hash password before saving
// --------------------
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --------------------
// 5. INSTANCE METHOD — Compare password
// --------------------
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// --------------------
// 6. EXPORT MODEL
// --------------------
module.exports = mongoose.model('User', userSchema);
