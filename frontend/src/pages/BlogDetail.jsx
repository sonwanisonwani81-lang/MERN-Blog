// ============================================
// FILE: BlogDetail.jsx
// PURPOSE: Displays full blog content with comments.
//          Shows title, author, date, full content.
//          Comments section at the bottom.
//          Logged-in users can add comments.
//          Blog ID comes from URL params (/blog/:id).
// DESIGN: Refined article typography, comment avatars,
//         animated back link, page entrance animation,
//         polished comment form.
// MOBILE VIEW:  Full width content, comments below
// DESKTOP VIEW: Content centered, max-w-3xl
// TESTED SIZES: 375px (iPhone), 768px (iPad), 1280px (Desktop)
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

// --------------------
// 2. BLOG DETAIL COMPONENT
// --------------------
const BlogDetail = () => {
  // Get blog ID from URL
  const { id } = useParams();

  // Blog data
  const [blog, setBlog] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error message
  const [error, setError] = useState('');

  // Comment form
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  const { user, isLoggedIn } = useAuth();

  // --------------------
  // FETCH BLOG DATA
  // --------------------
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/blog/${id}`);
        setBlog(response.data);
      } catch (err) {
        console.error('Fetch blog error:', err);
        setError('Could not load the blog. It may have been deleted.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // --------------------
  // HANDLE COMMENT SUBMIT
  // --------------------
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');

    if (!commentText.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }

    try {
      setCommentLoading(true);

      // Send comment to API
      const response = await api.post(`/api/blog/${id}/comment`, {
        text: commentText
      });

      // Refresh blog to get updated comments
      const blogResponse = await api.get(`/api/blog/${id}`);
      setBlog(blogResponse.data);

      // Clear comment input
      setCommentText('');

    } catch (err) {
      console.error('Comment submit error:', err);
      setCommentError(err.response?.data?.message || 'Failed to add comment.');
    } finally {
      setCommentLoading(false);
    }
  };

  // --------------------
  // HELPER: Format date
  // --------------------
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // --------------------
  // LOADING STATE
  // --------------------
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
        {/* Back link skeleton */}
        <div className="h-4 skeleton-shimmer rounded w-24 mb-8"></div>

        {/* Article skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-10">
          {/* Title skeleton */}
          <div className="h-8 skeleton-shimmer rounded w-3/4 mb-2"></div>
          <div className="h-8 skeleton-shimmer rounded w-1/2 mb-6"></div>

          {/* Meta skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-4 skeleton-shimmer rounded w-24"></div>
            <div className="h-4 skeleton-shimmer rounded w-3"></div>
            <div className="h-4 skeleton-shimmer rounded w-32"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-3">
            <div className="h-4 skeleton-shimmer rounded w-full"></div>
            <div className="h-4 skeleton-shimmer rounded w-full"></div>
            <div className="h-4 skeleton-shimmer rounded w-5/6"></div>
            <div className="h-4 skeleton-shimmer rounded w-full"></div>
            <div className="h-4 skeleton-shimmer rounded w-4/5"></div>
            <div className="h-4 skeleton-shimmer rounded w-full"></div>
            <div className="h-4 skeleton-shimmer rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------
  // ERROR STATE
  // --------------------
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-rose-50 rounded-full
                          flex items-center justify-center">
            <span className="text-3xl">😕</span>
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-2">
            Blog not found
          </h3>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <Link
            to="/"
            className="text-indigo-600 font-medium text-sm hover:text-indigo-700
                       transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // --------------------
  // MAIN RENDER
  // --------------------
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 animate-fade-in">

      {/* ---- BACK LINK ---- */}
      {/* Arrow animates left on hover */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500
                   hover:text-slate-900 transition-colors duration-200 mb-8 group"
      >
        <span className="transition-transform duration-200 group-hover:-translate-x-1">
          ←
        </span>
        Back to blogs
      </Link>

      {/* ---- ARTICLE CARD ---- */}
      <article className="bg-white rounded-xl border border-slate-200
                          p-6 md:p-10 mb-8">

        {/* ---- TITLE ---- */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900
                       tracking-tight mb-4 leading-tight">
          {blog.title}
        </h1>

        {/* ---- META: Author + Date ---- */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8
                        pb-8 border-b border-slate-100">
          {/* Author avatar placeholder */}
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center
                          justify-center text-indigo-600 font-medium text-xs">
            {blog.author?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="font-medium text-slate-700">
            {blog.author?.name || 'Unknown Author'}
          </span>
          <span className="text-slate-300">·</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        {/* ---- CONTENT ---- */}
        {/* Preserves whitespace and line breaks from the original content */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed
                        text-base md:text-lg whitespace-pre-wrap">
          {blog.content}
        </div>
      </article>

      {/* ---- COMMENTS SECTION ---- */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight mb-6">
          Comments ({blog.comments?.length || 0})
        </h2>

        {/* ---- ADD COMMENT FORM ---- */}
        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex gap-3">
              {/* User avatar placeholder */}
              <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center
                              justify-center text-indigo-600 font-medium text-xs
                              flex-shrink-0 mt-1">
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </div>

              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => {
                    setCommentText(e.target.value);
                    if (commentError) setCommentError('');
                  }}
                  placeholder="Write a comment..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300
                             text-slate-900 placeholder-slate-400 text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                             focus:border-indigo-500 transition-all duration-200
                             resize-none"
                />

                {/* Comment error */}
                {commentError && (
                  <p className="mt-2 text-sm text-rose-600 animate-slide-down">
                    {commentError}
                  </p>
                )}

                {/* Submit button */}
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={commentLoading || !commentText.trim()}
                    className="px-5 py-2 bg-indigo-600 text-white font-medium text-sm
                               rounded-lg hover:bg-indigo-700 active:scale-[0.98]
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200 min-h-[36px]"
                  >
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* Not logged in — show login prompt */
          <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200
                          text-center">
            <p className="text-sm text-slate-500">
              <Link
                to="/login"
                className="text-indigo-600 font-medium hover:text-indigo-700
                           transition-colors duration-200"
              >
                Sign in
              </Link>
              {' '}to leave a comment
            </p>
          </div>
        )}

        {/* ---- COMMENTS LIST ---- */}
        {blog.comments && blog.comments.length > 0 ? (
          <div className="space-y-4">
            {blog.comments.map((comment, index) => (
              <div
                key={index}
                className={`flex gap-3 animate-slide-up opacity-0
                           stagger-${(index % 6) + 1}`}
              >
                {/* Commenter avatar placeholder */}
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center
                                justify-center text-slate-500 font-medium text-xs
                                flex-shrink-0">
                  {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                </div>

                {/* Comment content */}
                <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    {comment.user?.name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No comments yet */
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --------------------
// 3. EXPORT
// --------------------
export default BlogDetail;
