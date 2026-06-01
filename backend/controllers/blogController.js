// ============================================
// FILE: blogController.js
// PURPOSE: All blog-related logic lives here.
//          - Get all approved blogs (public)
//          - Create new blog (logged-in user)
//          - Get user's own blogs
//          - Edit own blog
//          - Delete own blog
//          - Get pending blogs (admin only)
//          - Approve/Reject blog (admin only)
//          - Add comment to blog
//          - Get single blog by ID
// CALLED FROM: blogRoutes.js
// CONNECTED TO: Blog.js model (database operations)
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
const Blog = require('../models/Blog');

// ============================================================
// 2. PUBLIC CONTROLLERS
// ============================================================

// Get all approved blogs — visible to everyone
// Supports search by title (query param: ?search=react)
// Supports pagination (query params: ?page=1&limit=6)
// Called by: Home.jsx → GET /api/blog/public
const getAllApprovedBlogs = async (req, res) => {
  try {
    const { search, page = 1, limit = 6 } = req.query;

    // Build filter object
    const filter = { status: 'approved' };

    // If search query is provided, filter by title (case-insensitive)
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination metadata
    const total = await Blog.countDocuments(filter);

    // Fetch approved blogs with search filter, pagination, populate author
    const blogs = await Blog.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      blogs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasMore: pageNum * limitNum < total
      }
    });

  } catch (error) {
    console.error('Get blogs error:', error.message);
    res.status(500).json({
      message: 'Server error. Could not load blogs.'
    });
  }
};

// ============================================================
// 3. USER CONTROLLERS (logged-in users only)
// ============================================================

// Create a new blog — requires authentication
// Called by: CreateBlog.jsx → POST /api/blog/create
const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation — both title and content are required
    if (!title || !content) {
      return res.status(400).json({
        message: 'Both title and content are required.'
      });
    }

    if (title.length < 5) {
      return res.status(400).json({
        message: 'Title must be at least 5 characters.'
      });
    }

    // Create blog with status "pending" — admin must approve before it's public
    const newBlog = await Blog.create({
      title,
      content,
      author: req.user.id,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Blog created! Waiting for admin approval.',
      blog: newBlog
    });

  } catch (error) {
    console.error('Create blog error:', error.message);
    res.status(500).json({
      message: 'Server error. Blog could not be created.'
    });
  }
};

// Get blogs belonging to the logged-in user
// Called by: Dashboard.jsx → GET /api/blog/myblogs
const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);

  } catch (error) {
    console.error('Get my blogs error:', error.message);
    res.status(500).json({
      message: 'Server error. Could not load your blogs.'
    });
  }
};

// Edit own blog — only the author can edit
// Called by: EditBlog.jsx → Edit button → PUT /api/blog/update/:id
const editBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    // Only the author can edit their own blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You can only edit your own blog.'
      });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    const updatedBlog = await blog.save();

    res.status(200).json({
      message: 'Blog updated successfully!',
      blog: updatedBlog
    });

  } catch (error) {
    console.error('Edit blog error:', error.message);
    res.status(500).json({
      message: 'Server error. Blog could not be updated.'
    });
  }
};

// Delete own blog — only the author can delete
// Called by: Dashboard.jsx → Delete button → DELETE /api/blog/delete/:id
const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    // Only the author can delete their own blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You can only delete your own blog.'
      });
    }

    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({ message: 'Blog deleted successfully!' });

  } catch (error) {
    console.error('Delete blog error:', error.message);
    res.status(500).json({
      message: 'Server error. Blog could not be deleted.'
    });
  }
};

// ============================================================
// 4. ADMIN CONTROLLERS (admin only)
// ============================================================

// Get all pending blogs — admin only
// Called by: AdminPanel.jsx → GET /api/blogs/pending
const getPendingBlogs = async (req, res) => {
  try {
    const pendingBlogs = await Blog.find({ status: 'pending' })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(pendingBlogs);

  } catch (error) {
    console.error('Get pending blogs error:', error.message);
    res.status(500).json({
      message: 'Server error. Could not load pending blogs.'
    });
  }
};

// Approve or reject a blog — admin only
// Called by: AdminPanel.jsx → Approve/Reject button → PUT /api/blogs/:id/status
const updateBlogStatus = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { status } = req.body;

    // Validation — status must be either "approved" or "rejected"
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Status must be either "approved" or "rejected".'
      });
    }

    // Find blog and update its status
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { status },
      { new: true }  // Return the updated document
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    const statusMessage = status === 'approved'
      ? 'Blog approved! It is now visible on the home page.'
      : 'Blog rejected.';

    res.status(200).json({ message: statusMessage, blog });

  } catch (error) {
    console.error('Update blog status error:', error.message);
    res.status(500).json({
      message: 'Server error. Blog status could not be updated.'
    });
  }
};

// ============================================================
// 5. COMMENT CONTROLLER
// ============================================================

// Add a comment to an approved blog
// Called by: BlogDetail.jsx → POST /api/blogs/:id/comment
const addComment = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: 'Comment text is required.'
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    // Only approved blogs can receive comments
    if (blog.status !== 'approved') {
      return res.status(400).json({
        message: 'You can only comment on approved blogs.'
      });
    }

    // Add comment to the blog's comments array
    blog.comments.push({
      user: req.user.id,
      text,
      createdAt: new Date()
    });

    await blog.save();

    res.status(201).json({
      message: 'Comment added successfully!',
      comments: blog.comments
    });

  } catch (error) {
    console.error('Add comment error:', error.message);
    res.status(500).json({
      message: 'Server error. Comment could not be added.'
    });
  }
};

// --------------------
// 6. GET SINGLE BLOG BY ID
// --------------------
// Called by: BlogDetail.jsx → GET /api/blogs/:id
const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;

    // Populate author name and comment authors' names
    const blog = await Blog.findById(blogId)
      .populate('author', 'name')
      .populate('comments.user', 'name');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    // Increment view count (optional analytics)
    // blog.views = (blog.views || 0) + 1;
    // await blog.save();

    res.status(200).json(blog);

  } catch (error) {
    console.error('Get blog by ID error:', error.message);
    res.status(500).json({
      message: 'Server error. Blog could not be loaded.'
    });
  }
};

// --------------------
// 7. EXPORT ALL FUNCTIONS
// --------------------
module.exports = {
  getAllApprovedBlogs,
  createBlog,
  getMyBlogs,
  editBlog,
  deleteBlog,
  getPendingBlogs,
  updateBlogStatus,
  addComment,
  getBlogById
};
