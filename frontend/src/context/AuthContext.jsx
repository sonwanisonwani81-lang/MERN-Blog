// ============================================
// FILE: AuthContext.jsx
// PURPOSE: Provides global authentication state for the app.
//          Stores user data and JWT token in memory + localStorage.
//          Exposes login(), logout(), user, token, and isLoggedIn.
// CALLED FROM: main.jsx — wraps the entire App component
// WHY IT'S NEEDED:
//   - Navbar needs to know if user is logged in
//   - Protected routes need to check tokens
//   - Login/Logout need to update global state
//   - Avoids reading localStorage in every component
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { createContext, useContext, useState } from 'react';

// --------------------
// 2. CREATE CONTEXT
// --------------------
// AuthContext — a global container for auth data
// Default value: null (no data initially)
const AuthContext = createContext(null);

// --------------------
// 3. AUTH PROVIDER COMPONENT
// --------------------
// Wraps the entire app and provides auth state + functions
const AuthProvider = ({ children }) => {

  // User data (name, email, role, id)
  // Initial value: load from localStorage if previously logged in
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // JWT token
  // Initial value: load from localStorage if previously logged in
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // --------------------
  // LOGIN FUNCTION
  // --------------------
  // Saves user data and token to state + localStorage
  // Called by: Login.jsx on successful login
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwtToken);
  };

  // --------------------
  // LOGOUT FUNCTION
  // --------------------
  // Clears user data and token from state + localStorage
  // Called by: Navbar.jsx on logout button click
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // --------------------
  // CONTEXT VALUE
  // --------------------
  // These values are available throughout the app
  const contextValue = {
    user,              // User data { id, name, email, role }
    token,             // JWT token string
    login,             // Login function
    logout,            // Logout function
    isLoggedIn: !!token // Boolean — is user logged in?
  };

  // --------------------
  // RENDER PROVIDER
  // --------------------
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// --------------------
// 4. USE AUTH HOOK
// --------------------
// Shortcut to access auth context in any component
// Usage: const { user, token, login, logout } = useAuth();
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};

// --------------------
// 5. EXPORTS
// --------------------
// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
export default AuthContext;
