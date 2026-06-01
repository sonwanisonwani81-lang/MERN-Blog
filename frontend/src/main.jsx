// ============================================
// FILE: main.jsx
// PURPOSE: Entry point for the React app.
//          Wraps the App component with BrowserRouter
//          for routing and AuthProvider for global auth state.
// CALLED FROM: index.html — this is the first JS file loaded
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// CSS import — Tailwind styles
import './index.css'

// App component — all pages render here
import App from './App.jsx'

// BrowserRouter — enables client-side routing
// Allows us to have pages like /login, /dashboard, /admin
import { BrowserRouter } from 'react-router-dom'

// AuthProvider — provides global auth state to the entire app
// Makes user data, login(), and logout() available everywhere
import { AuthProvider } from './context/AuthContext.jsx'

// --------------------
// 2. RENDER APP
// --------------------
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
