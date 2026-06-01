// ============================================
// FILE: CreateBlog.jsx
// PURPOSE: Blog creation form page.
//          User enters title and content.
//          On success: animated success message, redirect to dashboard.
//          Blog is created with "pending" status —
//          admin must approve before it goes public.
// DESIGN: Refined form card, character counter, animated success
//         message with checkmark, submit button with loading spinner.
// MOBILE VIEW:  Full width form
// TABLET VIEW:  Centered card
// DESKTOP VIEW: max-w-2xl centered
// TESTED SIZES: 375px (iPhone), 768px (iPad), 1280px (Desktop)
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

// --------------------
// 2. CREATE BLOG COMPONENT
// --------------------
const CreateBlog = () => {
  // Form field values
  const [formData, setFormData] = useState({ title: '', content: '' });

  // Error message
  const [error, setError] = useState('');

  // Success state — controls the success message animation
  const [success, setSuccess] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // --------------------
  // HANDLE INPUT CHANGE
  // --------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  // --------------------
  // HANDLE FORM SUBMIT
  // --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.content) {
      setError('Both title and content are required.');
      return;
    }
    if (formData.title.length < 5) {
      setError('Title must be at least 5 characters.');
      return;
    }

    try {
      setLoading(true);

      // Call create blog API
      await api.post('/api/blog/create', formData);

      // Show success message with animation
      setSuccess(true);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Create blog error:', err);
      setError(err.response?.data?.message || 'Failed to create blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // JSX RETURN
  // --------------------
  return (
    <div className="min-h-screen px-4 py-8 md:py-12 animate-fade-in">
      <div className="max-w-2xl mx-auto">

        {/* ---- PAGE HEADER ---- */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900
                         tracking-tight mb-2">
            Create New Blog
          </h1>
          <p className="text-slate-500 text-sm">
            Write your thoughts and submit for admin approval
          </p>
        </div>

        {/* ---- SUCCESS MESSAGE ---- */}
        {/* Animated success state with checkmark */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6
                          text-center animate-scale-in mb-6">
            {/* Checkmark icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full
                            flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-emerald-800 mb-1">
              Blog Created Successfully!
            </h3>
            <p className="text-sm text-emerald-600">
              Your blog is pending approval. Redirecting to dashboard...
            </p>
          </div>
        )}

        {/* ---- FORM CARD ---- */}
        {!success && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">

            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 bg-rose-50 text-rose-600 text-sm rounded-lg
                             border border-rose-200 animate-slide-down">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ---- TITLE FIELD ---- */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Blog Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a compelling title..."
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300
                             text-slate-900 placeholder-slate-400 text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                             focus:border-indigo-500 transition-all duration-200"
                />
                {/* Character counter */}
                <p className="mt-1.5 text-xs text-slate-400 text-right">
                  {formData.title.length}/200
                </p>
              </div>

              {/* ---- CONTENT FIELD ---- */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Blog Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your blog content here..."
                  rows={12}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300
                             text-slate-900 placeholder-slate-400 text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                             focus:border-indigo-500 transition-all duration-200
                             resize-y min-h-[200px]"
                />
                {/* Character counter */}
                <p className="mt-1.5 text-xs text-slate-400 text-right">
                  {formData.content.length} characters
                </p>
              </div>

              {/* ---- SUBMIT BUTTON ---- */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 text-white font-medium
                           rounded-lg hover:bg-indigo-700 active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           disabled:active:scale-100
                           transition-all duration-200 min-h-[44px]"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                              stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit for Approval'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// --------------------
// 3. EXPORT
// --------------------
export default CreateBlog;
