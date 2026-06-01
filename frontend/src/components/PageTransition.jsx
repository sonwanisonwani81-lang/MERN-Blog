// ============================================
// FILE: PageTransition.jsx
// PURPOSE: Wraps page components with a fade + slide-up
//          animation that triggers on every route change.
//          When the URL changes, the old page fades out
//          and the new page slides in smoothly.
// USED BY: App.jsx — wraps each <Route> element
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// --------------------
// 2. PAGE TRANSITION COMPONENT
// --------------------
// PROPS:
//   - children: The page component to animate
const PageTransition = ({ children }) => {
  // Get current URL path — changes on every route navigation
  const location = useLocation();

  // Controls whether the animation is active
  const [isVisible, setIsVisible] = useState(false);

  // Track the previous path to detect changes
  const prevPathRef = useRef(location.pathname);

  // --------------------
  // EFFECT: Trigger animation on route change
  // --------------------
  // Uses requestAnimationFrame to avoid synchronous setState in effect body.
  // When the URL changes:
  //   1. Hide the current page (fade out) via rAF
  //   2. After a short delay, show new page (fade in)
  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath !== prevPathRef.current) {
      prevPathRef.current = currentPath;

      // Use rAF to defer setState — avoids synchronous setState in effect
      const raf = requestAnimationFrame(() => {
        setIsVisible(false);
        // After fade-out completes, fade in the new page
        const timeout = setTimeout(() => {
          setIsVisible(true);
        }, 150);
        // Store timeout for cleanup
        return () => clearTimeout(timeout);
      });

      return () => cancelAnimationFrame(raf);
    } else {
      // Same path — show immediately (initial load)
      const raf = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [location.pathname]);

  // --------------------
  // JSX RETURN
  // --------------------
  return (
    <div
      className={`
        transition-all duration-300 ease-out
        ${isVisible
          ? 'opacity-100 translate-y-0'  // Visible: full opacity, normal position
          : 'opacity-0 translate-y-4'     // Hidden: transparent, shifted down slightly
        }
      `}
    >
      {/* Render the page content */}
      {children}
    </div>
  );
};

// --------------------
// 3. EXPORT
// --------------------
export default PageTransition;
