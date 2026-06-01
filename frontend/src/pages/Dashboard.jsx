// ============================================
// FILE: Dashboard.jsx
// PURPOSE: User's personal blog dashboard.
//          Logged-in user can see all their blogs
//          (pending, approved, rejected).
//          Each blog shows a refined status badge.
//          View and Delete buttons with hover effects.
//          "Create New Blog" button at the top.
// DESIGN: Staggered list entrance, refined status badges,
//         custom delete confirmation modal (no window.confirm),
//         empty state with icon, page fade-in animation.
// MOBILE VIEW:  Stacked layout — heading, then list
// DESKTOP VIEW: Centered content, max-w-4xl
// TESTED SIZES: 375px (iPhone), 768px (iPad), 1280px (Desktop)
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import SkeletonCard from '../components/SkeletonCard';

// --------------------
// 2. DELETE CONFIRMATION MODAL COMPONENT
// --------------------
// A custom modal that replaces window.confirm() for a polished UX.
// PROPS:
//   - isOpen: whether the modal is visible
//   - blogTitle: title of the blog being deleted (shown in message)
//   - onConfirm: function to call when user confirms delete
//   - onCancel: function to call when user cancels
//   - loading: whether the delete API call is in progress
const DeleteModal = ({ isOpen, blogTitle, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    // Backdrop — semi-transparent dark overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-black/40 backdrop-blur-sm animate-fade-in">

      {/* Modal card — scales in with animation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm
                      animate-scale-in shadow-xl">

        {/* Warning icon */}
        <div className="w-12 h-12 mx-auto mb-4 bg-rose-50 rounded-full
                        flex items-center justify-center">
          <span className="text-2xl">⚠</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 text-center mb-2">
          Delete Blog?
        </h3>

        {/* Message */}
        <p className="text-sm text-slate-500 text-center mb-6">
          Are you sure you want to delete "<span className="font-medium text-slate-700">{blogTitle}</span>"?
          This action cannot be undone.
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          {/* Cancel button */}
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300
                       text-slate-700 font-medium text-sm
                       hover:bg-slate-50 active:scale-[0.98]
                       disabled:opacity-50 transition-all duration-200"
          >
            Cancel
          </button>

          {/* Delete button */}
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-lg bg-rose-600 text-white
                       font-medium text-sm hover:bg-rose-700 active:scale-[0.98]
                       disabled:opacity-50 transition-all duration-200
                       min-h-[44px]"
          >
            {loading ? (
              <span className="inline-flex items-center gap-1.5">
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deleting...
              </span>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --------------------
// 3. STATUS BADGE COMPONENT
// --------------------
// Shows blog status with refined pill design and subtle colors.
const StatusBadge = ({ status }) => {
  const styles = {
    pending:  'bg-amber-50 text-amber-700 border border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
  };

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium
                      capitalize ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};

// --------------------
// 4. DASHBOARD COMPONENT
// --------------------
const Dashboard = () => {
  // User's blogs
  const [blogs, setBlogs] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error message
  const [error, setError] = useState('');

  // Which blog is being deleted (for loading indicator)
  const [deletingId, setDeletingId] = useState(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, blog: null });

  const { token } = useAuth();

  // --------------------
  // FETCH USER'S BLOGS
  // --------------------
  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/blog/myblogs');
        setBlogs(response.data);
      } catch (err) {
        console.error('Fetch my blogs error:', err);
        setError('Could not load your blogs.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [token]);

  // --------------------
  // OPEN DELETE MODAL
  // --------------------
  const openDeleteModal = (blog) => {
    setDeleteModal({ isOpen: true, blog });
  };

  // --------------------
  // CLOSE DELETE MODAL
  // --------------------
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, blog: null });
  };

  // --------------------
  // DELETE BLOG HANDLER
  // --------------------
  // Called when user confirms delete in the modal
  const handleDelete = async () => {
    const blogId = deleteModal.blog?._id;
    if (!blogId) return;

    try {
      setDeletingId(blogId);

      // Call delete API
      await api.delete(`/api/blog/delete/${blogId}`);

      // Remove deleted blog from list (without re-fetching)
      setBlogs(blogs.filter(blog => blog._id !== blogId));

      // Close modal
      closeDeleteModal();

    } catch (err) {
      console.error('Delete blog error:', err);
      alert('Failed to delete blog. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // --------------------
  // JSX RETURN
  // --------------------
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-fade-in">

      {/* ---- PAGE HEADER ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between
                      gap-4 mb-8">
        {/* Title + description */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900
                         tracking-tight">
            My Blogs
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your blog posts and track their status
          </p>
        </div>

        {/* Create Blog button */}
        <Link
          to="/create"
          className="inline-flex items-center justify-center gap-2
                     px-5 py-2.5 bg-indigo-600 text-white font-medium text-sm
                     rounded-lg hover:bg-indigo-700 active:scale-[0.98]
                     transition-all duration-200 min-h-[44px]"
        >
          <span>+</span> Create New Blog
        </Link>
      </div>

      {/* ---- LOADING STATE (Skeleton cards) ---- */}
      {loading && (
        <div className="space-y-4">
          <SkeletonCard type="dashboard-item" />
          <SkeletonCard type="dashboard-item" />
          <SkeletonCard type="dashboard-item" />
        </div>
      )}

      {/* ---- ERROR STATE ---- */}
      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-lg border border-rose-200
                        animate-slide-down">
          {error}
        </div>
      )}

      {/* ---- EMPTY STATE ---- */}
      {/* Shows when user has no blogs yet */}
      {!loading && !error && blogs.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full
                          flex items-center justify-center">
            <span className="text-3xl">📝</span>
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-2">
            No blogs yet
          </h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            Start writing your first blog post and share your thoughts with the world.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5
                       bg-indigo-600 text-white font-medium text-sm rounded-lg
                       hover:bg-indigo-700 transition-all duration-200"
          >
            <span>+</span> Write Your First Blog
          </Link>
        </div>
      )}

      {/* ---- BLOG LIST ---- */}
      {!loading && !error && blogs.length > 0 && (
        <div className="space-y-4">
          {blogs.map((blog, index) => (
            // Each blog item with staggered entrance animation
            <div
              key={blog._id}
              className={`bg-white rounded-lg border border-slate-200 p-5
                         hover:border-slate-300 transition-all duration-200
                         animate-slide-up opacity-0 stagger-${(index % 6) + 1}`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between
                              gap-4">

                {/* Left side — title, date, snippet */}
                <div className="flex-1 min-w-0">
                  {/* Title + Status badge */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h2 className="text-lg font-semibold text-slate-900 tracking-tight
                                   truncate">
                      {blog.title}
                    </h2>
                    <StatusBadge status={blog.status} />
                  </div>

                  {/* Date */}
                  <p className="text-xs text-slate-400 mb-2">
                    {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>

                  {/* Content snippet */}
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {blog.content.substring(0, 120)}
                    {blog.content.length > 120 ? '...' : ''}
                  </p>
                </div>

                {/* Right side — action buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  {/* View button */}
                  <Link
                    to={`/blog/${blog._id}`}
                    className="px-4 py-2 text-sm font-medium text-slate-700
                               rounded-lg border border-slate-300
                               hover:bg-slate-50 active:scale-[0.98]
                               transition-all duration-200 min-h-[36px]
                               flex items-center"
                  >
                    View
                  </Link>

                  {/* Edit button */}
                  <Link
                    to={`/edit/${blog._id}`}
                    className="px-4 py-2 text-sm font-medium text-indigo-600
                               rounded-lg border border-indigo-200 bg-indigo-50
                               hover:bg-indigo-100 active:scale-[0.98]
                               transition-all duration-200 min-h-[36px]
                               flex items-center"
                  >
                    Edit
                  </Link>

                  {/* Delete button */}
                  <button
                    onClick={() => openDeleteModal(blog)}
                    disabled={deletingId === blog._id}
                    className="px-4 py-2 text-sm font-medium text-rose-600
                               rounded-lg border border-rose-200 bg-rose-50
                               hover:bg-rose-100 active:scale-[0.98]
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200 min-h-[36px]
                               flex items-center"
                  >
                    {deletingId === blog._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- DELETE CONFIRMATION MODAL ---- */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        blogTitle={deleteModal.blog?.title || ''}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        loading={deletingId !== null}
      />
    </div>
  );
};

// --------------------
// 5. EXPORT
// --------------------
export default Dashboard;
