// ============================================
// FILE: BlogCard.jsx
// PURPOSE: Reusable blog card component.
//          Displays blog title, author, date, and content snippet.
//          Clicking navigates to the BlogDetail page.
// DESIGN: Hover lift effect (-translate-y-1), entrance animation,
//         refined typography, animated "Read more" arrow.
// USED BY: Home.jsx (blog list grid)
// MOBILE VIEW:  Full width card
// DESKTOP VIEW: Card inside grid
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { Link } from 'react-router-dom';

// --------------------
// 2. BLOG CARD COMPONENT
// --------------------
// PROPS:
//   - blog: Blog data object { _id, title, content, author, createdAt }
//   - index: Card position in list (used for staggered entrance animation)
const BlogCard = ({ blog, index = 0 }) => {

  // --------------------
  // HELPER: Truncate content to snippet
  // --------------------
  // Shows only first 150 characters of content
  const getSnippet = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // --------------------
  // HELPER: Format date
  // --------------------
  // Converts MongoDB date to readable format (e.g., "28 May 2026")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // --------------------
  // HELPER: Get stagger delay class
  // --------------------
  // Maps card index to stagger delay (max 6 cards before cycling)
  const getStaggerClass = (idx) => {
    const staggerIndex = (idx % 6) + 1; // 1-6, then cycles
    return `stagger-${staggerIndex}`;
  };

  // --------------------
  // JSX RETURN
  // --------------------
  return (
    // Entire card is clickable — navigates to BlogDetail page
    // animate-slide-up: fade-in + slide-up entrance animation
    // stagger delay: each card appears slightly after the previous one
    // hover:-translate-y-1: card lifts up slightly on hover
    // hover:shadow-lg: shadow grows on hover for depth effect
    <Link
      to={`/blog/${blog._id}`}
      className={`group block bg-white rounded-lg border border-slate-200
                 hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg
                 transition-all duration-300 ease-out overflow-hidden
                 animate-slide-up opacity-0 ${getStaggerClass(index)}`}
    >
      {/* Gradient accent bar at top of card — adds visual interest */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

      <div className="p-5 md:p-6">

        {/* ---- TITLE ---- */}
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-2
                       tracking-tight line-clamp-2">
          {blog.title}
        </h2>

        {/* ---- AUTHOR + DATE ---- */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          {/* Author name */}
          <span className="font-medium text-slate-600">
            {blog.author?.name || 'Unknown Author'}
          </span>

          {/* Dot separator */}
          <span className="text-slate-300">·</span>

          {/* Formatted date */}
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        {/* ---- CONTENT SNIPPET ---- */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {getSnippet(blog.content)}
        </p>

        {/* ---- READ MORE LINK ---- */}
        {/* Arrow animates to the right on hover */}
        <span className="inline-flex items-center gap-1.5 text-sm font-medium
                         text-indigo-600 group-hover:gap-2.5 transition-all duration-200">
          Read more
          {/* Arrow slides right on card hover */}
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
};

// --------------------
// 3. EXPORT
// --------------------
export default BlogCard;
