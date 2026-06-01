// ============================================
// FILE: adminRoutes.js
// PURPOSE: Admin-only API routes for blog moderation.
//          GET  /api/admin/pending    — List all pending blogs
//          PUT  /api/admin/approve/:id — Approve a blog
//          PUT  /api/admin/reject/:id  — Reject a blog
// CALLED FROM: server.js (mounted at /api/admin)
// PROTECTED: Yes — requires JWT + admin role
// ============================================

const express = require('express');
const router = express.Router();

const {
  getPendingBlogs,
  updateBlogStatus
} = require('../controllers/blogController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/admin/pending — All pending blogs
// Called by: AdminPanel.jsx
router.get('/pending', protect, adminOnly, getPendingBlogs);

// PUT /api/admin/approve/:id — Approve a blog
// Called by: AdminPanel.jsx → Approve button
router.put('/approve/:id', protect, adminOnly, (req, res, next) => {
  req.body = req.body || {};
  req.body.status = 'approved';
  next();
}, updateBlogStatus);

// PUT /api/admin/reject/:id — Reject a blog
// Called by: AdminPanel.jsx → Reject button
router.put('/reject/:id', protect, adminOnly, (req, res, next) => {
  req.body = req.body || {};
  req.body.status = 'rejected';
  next();
}, updateBlogStatus);

module.exports = router;
