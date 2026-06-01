// ============================================
// FILE: SkeletonCard.jsx
// PURPOSE: Placeholder card shown while blog data is loading.
//          Instead of a boring spinner, users see a card-shaped
//          skeleton that mimics the real blog card layout.
//          This makes the page feel faster because users
//          can see the structure before content arrives.
// USED BY: Home.jsx, Dashboard.jsx, AdminPanel.jsx
// ============================================

// --------------------
// 1. SKELETON CARD COMPONENT
// --------------------
// PROPS:
//   - type: 'blog-card' (Home grid), 'dashboard-item' (Dashboard list), 'admin-item' (AdminPanel list)
const SkeletonCard = ({ type = 'blog-card' }) => {

  // --------------------
  // BLOG CARD SKELETON (for Home page grid)
  // --------------------
  if (type === 'blog-card') {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-5 animate-fade-in">
        {/* Title placeholder — 2 lines */}
        <div className="h-5 skeleton-shimmer rounded w-3/4 mb-2"></div>
        <div className="h-5 skeleton-shimmer rounded w-1/2 mb-4"></div>

        {/* Author + date placeholder */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-3 skeleton-shimmer rounded w-20"></div>
          <div className="h-3 skeleton-shimmer rounded w-3"></div>
          <div className="h-3 skeleton-shimmer rounded w-24"></div>
        </div>

        {/* Content snippet placeholder — 3 lines */}
        <div className="h-3 skeleton-shimmer rounded w-full mb-2"></div>
        <div className="h-3 skeleton-shimmer rounded w-full mb-2"></div>
        <div className="h-3 skeleton-shimmer rounded w-2/3 mb-4"></div>

        {/* "Read more" placeholder */}
        <div className="h-3 skeleton-shimmer rounded w-20"></div>
      </div>
    );
  }

  // --------------------
  // DASHBOARD ITEM SKELETON
  // --------------------
  if (type === 'dashboard-item') {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-5 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          {/* Left side — title, date, snippet */}
          <div className="flex-1 mb-4 md:mb-0 md:mr-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 skeleton-shimmer rounded w-48"></div>
              <div className="h-5 skeleton-shimmer rounded w-16 rounded-full"></div>
            </div>
            <div className="h-3 skeleton-shimmer rounded w-28 mb-2"></div>
            <div className="h-3 skeleton-shimmer rounded w-3/4"></div>
          </div>

          {/* Right side — action buttons */}
          <div className="flex gap-2">
            <div className="h-9 skeleton-shimmer rounded-lg w-16"></div>
            <div className="h-9 skeleton-shimmer rounded-lg w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------
  // ADMIN ITEM SKELETON
  // --------------------
  if (type === 'admin-item') {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-5 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          {/* Left side — blog details */}
          <div className="flex-1 mb-4 md:mb-0 md:mr-4">
            <div className="h-5 skeleton-shimmer rounded w-56 mb-2"></div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 skeleton-shimmer rounded w-20"></div>
              <div className="h-3 skeleton-shimmer rounded w-3"></div>
              <div className="h-3 skeleton-shimmer rounded w-24"></div>
            </div>
            <div className="h-3 skeleton-shimmer rounded w-full mb-1"></div>
            <div className="h-3 skeleton-shimmer rounded w-4/5"></div>
          </div>

          {/* Right side — approve/reject buttons */}
          <div className="flex gap-2">
            <div className="h-9 skeleton-shimmer rounded-lg w-20"></div>
            <div className="h-9 skeleton-shimmer rounded-lg w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback — generic skeleton
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 animate-fade-in">
      <div className="h-5 skeleton-shimmer rounded w-3/4 mb-3"></div>
      <div className="h-3 skeleton-shimmer rounded w-full mb-2"></div>
      <div className="h-3 skeleton-shimmer rounded w-2/3"></div>
    </div>
  );
};

// --------------------
// 2. EXPORT
// --------------------
export default SkeletonCard;
