// ============================================
// FILE: Navbar.jsx
// PURPOSE: Top navigation bar — visible on every page.
//          Mobile: Logo left + Hamburger right, menu slides down
//          Desktop: Logo left + Links right (inline)
//          Logged-in user sees: Dashboard, Logout
//          Logged-out user sees: Login, Register
//          Admin also sees: Admin Panel
// DESIGN: Glassmorphism (backdrop-blur), animated mobile menu,
//         active link indicator, smooth hover transitions.
// MOBILE VIEW:  Hamburger menu, slide-down animation
// DESKTOP VIEW: Horizontal links, inline
// TESTED SIZES: 375px (iPhone), 768px (iPad), 1280px (Desktop)
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --------------------
// 2. NAVBAR COMPONENT
// --------------------
const Navbar = () => {
  // Mobile menu open/close state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // useLocation gives us the current URL path — used for active link styling
  const location = useLocation();

  // --------------------
  // LOGOUT HANDLER
  // --------------------
  const handleLogout = () => {
    logout();              // Clear auth state + localStorage
    setIsMenuOpen(false);  // Close mobile menu
    navigate('/');         // Redirect to home
  };

  // --------------------
  // TOGGLE MOBILE MENU
  // --------------------
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // --------------------
  // LINK CLICK HANDLER
  // --------------------
  // Closes mobile menu when any link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // --------------------
  // HELPER: Check if link is active
  // --------------------
  // Returns true if the given path matches the current URL
  const isActive = (path) => location.pathname === path;

  // --------------------
  // HELPER: Active link classes
  // --------------------
  // Returns different styles for active vs inactive links
  const linkClasses = (path) =>
    `transition-colors duration-200 ${
      isActive(path)
        ? 'text-indigo-600 font-medium'           // Active: indigo color + medium weight
        : 'text-slate-600 hover:text-slate-900'    // Inactive: slate, darkens on hover
    }`;

  // --------------------
  // JSX RETURN
  // --------------------
  return (
    // Navbar — fixed at top, glassmorphism effect (translucent white + blur)
    // backdrop-blur-md: blurs content behind the navbar
    // bg-white/80: white background at 80% opacity
    // border-b: subtle bottom border instead of heavy shadow
    <nav className="fixed top-0 left-0 right-0 z-50
                    backdrop-blur-md bg-white/80 border-b border-slate-200">

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* ---- LOGO ---- */}
          {/* Logo scales up slightly on hover for a subtle interactive feel */}
          <Link
            to="/"
            className="text-xl font-semibold text-slate-900 tracking-tight
                       transition-transform duration-200 hover:scale-105"
          >
            MERN Blog
          </Link>

          {/* ---- DESKTOP LINKS (hidden on mobile, visible on md+) ---- */}
          <div className="hidden md:flex items-center gap-6">
            {/* Home link — always visible */}
            <Link to="/" className={linkClasses('/')}>
              Home
            </Link>

            {/* Logged-in user links */}
            {isLoggedIn && (
              <>
                <Link to="/dashboard" className={linkClasses('/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/create" className={linkClasses('/create')}>
                  Create Blog
                </Link>
              </>
            )}

            {/* Admin-only link */}
            {isLoggedIn && user?.role === 'admin' && (
              <Link to="/admin" className={linkClasses('/admin')}>
                Admin Panel
              </Link>
            )}

            {/* Auth links */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-slate-600 hover:text-rose-600 transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className={linkClasses('/login')}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg
                             hover:bg-indigo-700 active:scale-[0.98]
                             transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ---- MOBILE HAMBURGER BUTTON ---- */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900
                       transition-colors duration-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {/* Animated hamburger icon — transforms between ☰ and X */}
            <div className="w-6 h-5 relative flex flex-col justify-between">
              {/* Top line — rotates 45deg when menu open */}
              <span
                className={`block h-0.5 w-6 bg-current rounded-full
                           transition-all duration-300 origin-center
                           ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
              ></span>

              {/* Middle line — fades out when menu open */}
              <span
                className={`block h-0.5 w-6 bg-current rounded-full
                           transition-all duration-300
                           ${isMenuOpen ? 'opacity-0' : ''}`}
              ></span>

              {/* Bottom line — rotates -45deg when menu open */}
              <span
                className={`block h-0.5 w-6 bg-current rounded-full
                           transition-all duration-300 origin-center
                           ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* ---- MOBILE MENU ---- */}
      {/* Slides down + fades in when open. Uses max-height transition for smooth height animation. */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out
                    ${isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {/* Border top separates menu from navbar */}
        <div className="px-4 py-4 space-y-1 border-t border-slate-100 bg-white/90">

          {/* Home link */}
          <Link
            to="/"
            onClick={handleLinkClick}
            className={`block py-2 px-3 rounded-lg transition-colors duration-200
                       ${isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Home
          </Link>

          {/* Logged-in links */}
          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                onClick={handleLinkClick}
                className={`block py-2 px-3 rounded-lg transition-colors duration-200
                           ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Dashboard
              </Link>
              <Link
                to="/create"
                onClick={handleLinkClick}
                className={`block py-2 px-3 rounded-lg transition-colors duration-200
                           ${isActive('/create') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Create Blog
              </Link>
            </>
          )}

          {/* Admin link */}
          {isLoggedIn && user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={handleLinkClick}
              className={`block py-2 px-3 rounded-lg transition-colors duration-200
                         ${isActive('/admin') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Admin Panel
            </Link>
          )}

          {/* Auth buttons */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 px-3 rounded-lg text-slate-600
                         hover:bg-rose-50 hover:text-rose-600 transition-colors duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className={`block py-2 px-3 rounded-lg transition-colors duration-200
                           ${isActive('/login') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={handleLinkClick}
                className="block py-2 px-3 mt-2 text-center bg-indigo-600 text-white
                           rounded-lg hover:bg-indigo-700 active:scale-[0.98]
                           transition-all duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// --------------------
// 3. EXPORT
// --------------------
export default Navbar;
