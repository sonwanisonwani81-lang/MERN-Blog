// ============================================
// FILE: Home.jsx
// PURPOSE: Home page — displays all approved blogs.
//          First page users see when visiting the site.
//          Blog list shown in a responsive grid layout.
//          Each blog card is clickable → BlogDetail page.
// MOBILE VIEW:  Single column blog cards
// TABLET VIEW:  2 column grid
// DESKTOP VIEW: 3 column grid
// TESTED SIZES: 375px (iPhone), 768px (iPad), 1280px (Desktop)
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import { useState, useEffect } from 'react';
import api from '../utils/axios';
import BlogCard from '../components/BlogCard';
import SkeletonCard from '../components/SkeletonCard';

// --------------------
// 2. HOME COMPONENT
// --------------------
const Home = () => {
  // State: list of approved blogs
  const [blogs, setBlogs] = useState([]);

  // State: loading indicator
  const [loading, setLoading] = useState(true);

  // State: error message
  const [error, setError] = useState('');

  // State: search query
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // State: pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const limit = 6;

  // --------------------
  // FETCH BLOGS ON MOUNT / SEARCH / PAGE CHANGE
  // --------------------
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params = { page, limit };
        if (search) params.search = search;
        const response = await api.get('/api/blog/public', { params });
        const data = response.data;
        setBlogs(data.blogs || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setHasMore(data.pagination.hasMore || false);
        }
      } catch (err) {
        console.error('Blogs fetch error:', err);
        setError('Could not load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [search, page]);

  // --------------------
  // HANDLE SEARCH
  // --------------------
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1); // Reset to first page on new search
  };

  // --------------------
  // HANDLE PAGE CHANGE
  // --------------------
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --------------------
  // JSX RETURN
  // --------------------
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ---- PAGE HEADER ---- */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900
                       tracking-tight mb-3">
          Latest Blogs
        </h1>
        <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto mb-6">
          Read admin-approved blogs and leave comments
        </p>

        {/* ---- SEARCH BAR ---- */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search blogs by title..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200"
          >
            Search
          </button>
        </form>
      </div>

      {/* ---- LOADING STATE (Skeleton cards) ---- */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <SkeletonCard type="blog-card" />
          <SkeletonCard type="blog-card" />
          <SkeletonCard type="blog-card" />
          <SkeletonCard type="blog-card" />
          <SkeletonCard type="blog-card" />
          <SkeletonCard type="blog-card" />
        </div>
      )}

      {/* ---- ERROR STATE ---- */}
      {error && (
        <div className="text-center py-12 animate-fade-in">
          <div className="bg-rose-50 text-rose-600 p-4 rounded-lg inline-block border border-rose-200">
            {error}
          </div>
        </div>
      )}

      {/* ---- NO BLOGS STATE ---- */}
      {!loading && !error && blogs.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <p className="text-slate-400 text-lg">
            {search ? 'No blogs match your search.' : 'No blogs yet. Check back later!'}
          </p>
          {search && (
            <button
              onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
              className="mt-4 text-indigo-600 font-medium text-sm hover:text-indigo-700 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* ---- BLOG GRID ---- */}
      {!loading && !error && blogs.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogs.map((blog, index) => (
              <BlogCard key={blog._id} blog={blog} index={index} />
            ))}
          </div>

          {/* ---- PAGINATION ---- */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pageNum === page
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={!hasMore}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// --------------------
// 3. EXPORT
// --------------------
export default Home;
