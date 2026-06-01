// ============================================
// FILE: ProtectedRoute.jsx
// PURPOSE: Guards protected pages from unauthorized access.
//          If user is not logged in → redirects to /login.
//          If admin-only page and user is not admin → redirects to /dashboard.
// CALLED FROM: App.jsx — wraps protected routes
// WHY IT'S NEEDED:
//   - Dashboard should not be visible without login
//   - AdminPanel should not be visible without admin role
//   - Security: only authorized users can access protected pages
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --------------------
// 2. PROTECTED ROUTE COMPONENT
// --------------------
// Only renders children if the user is authorized.
// PROPS:
//   - children: The protected page component (e.g., Dashboard)
//   - adminOnly: Should only admin have access? (default: false)
const ProtectedRoute = ({ children, adminOnly = false }) => {

  const { user, token } = useAuth();

  // CHECK 1: Is user logged in?
  if (!token || !user) {
    // No token or user — redirect to login
    // replace: true — prevents back button from returning to protected page
    return <Navigate to="/login" replace />;
  }

  // CHECK 2: Is this admin-only and user is not admin?
  if (adminOnly && user.role !== 'admin') {
    // User is not admin — redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // All checks passed — render the page
  return children;
};

// --------------------
// 3. EXPORT
// --------------------
export default ProtectedRoute;
