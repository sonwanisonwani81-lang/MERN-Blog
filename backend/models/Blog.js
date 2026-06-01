// ============================================
// FILE: Blog.js
// PURPOSE: Defines the Blog schema for MongoDB.
//          Each blog has a title, content, author reference,
//          status (pending/approved/rejected), comments array, and timestamps.
// CALLED FROM: blogController.js during blog CRUD operations
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
const mongoose = require('mongoose');

// --------------------
// 2. BLOG SCHEMA
// --------------------
const blogSchema = new mongoose.Schema({

  // Blog title — required
  title: {
    type: String,
    required: [true, 'Title is required.']
  },

  // Blog content (full article) — required
  content: {
    type: String,
    required: [true, 'Content is required.']
  },

  // Author reference — stores the User's MongoDB ID
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Blog status — admin approves or rejects
  // "pending" = newly created, awaiting admin review
  // "approved" = accepted by admin, visible publicly
  // "rejected" = rejected by admin
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected']
  },

  // Comments array — each comment has a user reference, text, and date
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      text: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]

}, {
  // Automatically adds createdAt and updatedAt fields
  timestamps: true
});

// --------------------
// 3. INDEXES
// --------------------
// Index for fetching approved blogs with pagination (most common query)
blogSchema.index({ status: 1, createdAt: -1 });

// Index for fetching user's own blogs
blogSchema.index({ author: 1, createdAt: -1 });

// Index for search by title (text search)
blogSchema.index({ title: 'text' });

// --------------------
// 4. EXPORT MODEL
// --------------------
module.exports = mongoose.model('Blog', blogSchema);
