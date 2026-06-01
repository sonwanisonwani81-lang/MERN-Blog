// ============================================
// FILE: Login.jsx
// PURPOSE: Login form page for existing users.
//          User enters email and password.
//          On success: token saved to localStorage, redirect to dashboard.
//          On error: animated error message displayed.
// DESIGN: Centered card with refined styling, smooth input focus
//         transitions, indigo button with hover/active effects,
//         animated error messages, page entrance animation.
// MOBILE VIEW:  Full screen form
// TABLET VIEW:  Centered card
// DESKTOP VIEW: Same card, max-width 400px centered
// TESTED SIZES: 375px (iPhone), 768px (iPad), 1280px (Desktop)
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

// --------------------
// 2. LOGIN COMPONENT
// --------------------
const Login = () => {
  // Form field values
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Error message
  const [error, setError] = useState('');

  // Loading state — disables button during API call
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Get login function from AuthContext
  const { login } = useAuth();

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
    if (!formData.email || !formData.password) {
      setError('Both email and password are required.');
      return;
    }

    try {
      setLoading(true);

      // Call login API
      const response = await api.post('/api/auth/login', formData);

      // Save token + user data to context + localStorage
      login(response.data.user, response.data.token);

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err) {
      // Show error message from server, or generic message
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // JSX RETURN
  // --------------------
  return (
    // Full screen centered layout with fade-in entrance
    <div className="min-h-screen flex items-center justify-center px-4 py-12
                    animate-fade-in">

      {/* ---- LOGIN CARD ---- */}
      {/* Refined card: larger padding, subtle border, no heavy shadow */}
      <div className="w-full max-w-md">

        {/* Card header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900
                         tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">

          {/* ---- ERROR MESSAGE ---- */}
          {/* Animated slide-down when error appears */}
          {error && (
            <div className="mb-6 p-3 bg-rose-50 text-rose-600 text-sm rounded-lg
                           border border-rose-200 animate-slide-down">
              {error}
            </div>
          )}

          {/* ---- FORM ---- */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ---- EMAIL FIELD ---- */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                // Focus: smooth indigo ring transition
                className="w-full px-4 py-3 rounded-lg border border-slate-300
                           text-slate-900 placeholder-slate-400 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                           focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            {/* ---- PASSWORD FIELD ---- */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-slate-300
                           text-slate-900 placeholder-slate-400 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                           focus:border-indigo-500 transition-all duration-200"
              />
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
                /* Loading spinner inside button */
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* ---- FOOTER LINK ---- */}
        <p className="text-center mt-6 text-sm text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:text-indigo-700
                       transition-colors duration-200"
          >
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
};

// --------------------
// 3. EXPORT
// --------------------
export default Login;
