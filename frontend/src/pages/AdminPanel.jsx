// ============================================
// FILE: AdminPanel.jsx
// PURPOSE: Admin panel for reviewing pending blogs.
//          Admin can approve or reject blogs.
//          Approve → blog becomes public on Home page.
//          Reject → blog stays private.
// DESIGN: Refined cards with staggered entrance, color-coded
//         approve/reject buttons, animated success toast,
//         empty state with icon, page fade-in.
// MOBILE VIEW:  Card per blog (stacked)
// DESKTOP VIEW: Centered list, max-w-4xl
// TESTED SIZES: 375px (iPhone), 768px (iPad), 1280px (Desktop)
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import SkeletonCard from '../components/SkeletonCard';

// --------------------
// 2. ADMIN PANEL COMPONENT
// --------------------
const AdminPanel = () => {
  // Pending blogs list
  const [pendingBlogs, setPendingBlogs] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error message
  const [error, setError] = useState('');

  // Which blog is being processed (for loading indicator)
  const [processingId, setProcessingId] = useState(null);

  // Success toast state
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const { token } = useAuth();

  // --------------------
  // FETCH PENDING BLOGS
  // --------------------
  useEffect(() => {
    const fetchPendingBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/pending');
        setPendingBlogs(response.data);
      } catch (err) {
        console.error('Fetch pending blogs error:', err);
        setError('Could not load pending blogs.');
      } finally {
        setLoading(false);
      }
    };
    fetchPendingBlogs();
  }, [token]);

  // --------------------
  // SHOW TOAST NOTIFICATION
  // --------------------
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // --------------------
  // APPROVE/REJECT HANDLER
  // --------------------
  const handleStatusUpdate = async (blogId, newStatus) => {
    try {
      setProcessingId(blogId);

      // Call status update API
      const endpoint = newStatus === 'approved'
        ? `/api/admin/approve/${blogId}`
        : `/api/admin/reject/${blogId}`;
      await api.put(endpoint);

      // Remove blog from pending list (it's no longer pending)
      setPendingBlogs(pendingBlogs.filter(blog => blog._id !== blogId));

      // Show success toast
      const message = newStatus === 'approved'
        ? 'Blog approved and published!'
        : 'Blog rejected.';
      showToast(message, newStatus === 'approved' ? 'success' : 'info');

    } catch (err) {
      console.error('Update blog status error:', err);
      showToast('Failed to update blog status.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  // --------------------
  // JSX RETURN
  // --------------------
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-fade-in">

      {/* ---- PAGE HEADER ---- */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900
                       tracking-tight mb-2">
          Admin Panel
        </h1>
        <p className="text-slate-500 text-sm">
          Review and manage pending blog submissions
        </p>
      </div>

      {/* ---- TOAST NOTIFICATION ---- */}
      {/* Animated toast that slides in from the top-right */}
      {toast.show && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-lg shadow-lg
                        border animate-slide-down
                        ${toast.type === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : toast.type === 'error'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* ---- LOADING STATE (Skeleton cards) ---- */}
      {loading && (
        <div className="space-y-4">
          <SkeletonCard type="admin-item" />
          <SkeletonCard type="admin-item" />
          <SkeletonCard type="admin-item" />
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
      {/* Shows when no pending blogs exist */}
      {!loading && !error && pendingBlogs.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full
                          flex items-center justify-center">
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-2">
            All caught up!
          </h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            There are no pending blogs to review. Check back later.
          </p>
        </div>
      )}

      {/* ---- PENDING BLOGS LIST ---- */}
      {!loading && !error && pendingBlogs.length > 0 && (
        <div className="space-y-4">
          {pendingBlogs.map((blog, index) => (
            <div
              key={blog._id}
              className={`bg-white rounded-lg border border-slate-200 p-5
                         hover:border-slate-300 transition-all duration-200
                         animate-slide-up opacity-0 stagger-${(index % 6) + 1}`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between
                              gap-4">

                {/* Left side — blog details */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h2 className="text-lg font-semibold text-slate-900 tracking-tight
                                 mb-1.5">
                    {blog.title}
                  </h2>

                  {/* Author + Date */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <span className="font-medium text-slate-600">
                      {blog.author?.name || 'Unknown'}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Content preview */}
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {blog.content.substring(0, 200)}
                    {blog.content.length > 200 ? '...' : ''}
                  </p>
                </div>

                {/* Right side — approve/reject buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  {/* Approve button — green */}
                  <button
                    onClick={() => handleStatusUpdate(blog._id, 'approved')}
                    disabled={processingId === blog._id}
                    className="px-4 py-2 text-sm font-medium text-emerald-700
                               rounded-lg border border-emerald-200 bg-emerald-50
                               hover:bg-emerald-100 active:scale-[0.98]
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200 min-h-[36px]
                               flex items-center gap-1.5"
                  >
                    {processingId === blog._id ? (
                      <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                                stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <span>✓</span>
                    )}
                    Approve
                  </button>

                  {/* Reject button — red */}
                  <button
                    onClick={() => handleStatusUpdate(blog._id, 'rejected')}
                    disabled={processingId === blog._id}
                    className="px-4 py-2 text-sm font-medium text-rose-600
                               rounded-lg border border-rose-200 bg-rose-50
                               hover:bg-rose-100 active:scale-[0.98]
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200 min-h-[36px]
                               flex items-center gap-1.5"
                  >
                    {processingId === blog._id ? (
                      <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                                stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <span>✕</span>
                    )}
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --------------------
// 3. EXPORT
// --------------------
export default AdminPanel;
