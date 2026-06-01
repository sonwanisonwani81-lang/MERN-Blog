// ============================================
// FILE: blogRoutesV2.js
// PURPOSE: Blog API routes matching the evaluation criteria paths.
//          POST   /api/blog/create          — Create blog
//          GET    /api/blog/myblogs          — Get current user's blogs
//          PUT    /api/blog/update/:id       — Update own blog
//          DELETE /api/blog/delete/:id       — Delete own blog
//          GET    /api/blog/public           — All approved blogs (with search & pagination)
//          POST   /api/blog/:id/comment      — Add comment to blog
//          GET    /api/blog/:id              — Single blog details
// CALLED FROM: server.js (mounted at /api/blog)
// ============================================

const express = require('express');
const router = express.Router();

const {
  getAllApprovedBlogs,
  createBlog,
  getMyBlogs,
  editBlog,
  deleteBlog,
  addComment,
  getBlogById
} = require('../controllers/blogController');

const { protect } = require('../middleware/authMiddleware');

// POST /api/blog/create — Create new blog
router.post('/create', protect, createBlog);

// GET /api/blog/myblogs — Current user's blogs
router.get('/myblogs', protect, getMyBlogs);

// PUT /api/blog/update/:id — Edit own blog
router.put('/update/:id', protect, editBlog);

// DELETE /api/blog/delete/:id — Delete own blog
router.delete('/delete/:id', protect, deleteBlog);

// GET /api/blog/public — All approved blogs (public)
router.get('/public', getAllApprovedBlogs);

// POST /api/blog/:id/comment — Add comment (auth required)
router.post('/:id/comment', protect, addComment);

// GET /api/blog/:id — Single blog detail
router.get('/:id', getBlogById);

module.exports = router;
