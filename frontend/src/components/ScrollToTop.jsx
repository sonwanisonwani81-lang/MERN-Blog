// ============================================
// FILE: ScrollToTop.jsx
// PURPOSE: Floating button that appears when user scrolls down.
//          Clicking it smoothly scrolls back to the top of the page.
//          Uses smooth scroll behavior from index.css.
// DESIGN: Circular button with fade-in/scale animation,
//         indigo background, arrow icon, subtle shadow.
// USED BY: App.jsx — rendered once, visible on all pages
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { useState, useEffect } from 'react';

// --------------------
// 2. SCROLL TO TOP COMPONENT
// --------------------
const ScrollToTop = () => {
  // Whether the button is visible (shows after scrolling down 400px)
  const [isVisible, setIsVisible] = useState(false);

  // --------------------
  // EFFECT: Listen to scroll events
  // --------------------
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 400px from top
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    // Cleanup listener on unmount
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // --------------------
  // SCROLL TO TOP HANDLER
  // --------------------
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // --------------------
  // JSX RETURN
  // --------------------
  // Only renders when isVisible is true
  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full
                 bg-indigo-600 text-white shadow-lg
                 hover:bg-indigo-700 hover:shadow-xl
                 active:scale-90
                 flex items-center justify-center
                 transition-all duration-200
                 animate-scale-in"
    >
      {/* Up arrow icon */}
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
};

// --------------------
// 3. EXPORT
// --------------------
export default ScrollToTop;
