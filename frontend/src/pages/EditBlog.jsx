import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/blog/${id}`);
        const blog = response.data;
        setFormData({
          title: blog.title || '',
          content: blog.content || ''
        });
      } catch (err) {
        setFetchError('Could not load blog.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.content) {
      setError('Both title and content are required.');
      return;
    }

    try {
      setSubmitting(true);
      await api.put(`/api/blog/update/${id}`, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <div className="h-8 skeleton-shimmer rounded w-1/2 mb-6"></div>
          <div className="h-4 skeleton-shimmer rounded w-full mb-3"></div>
          <div className="h-4 skeleton-shimmer rounded w-full mb-3"></div>
          <div className="h-4 skeleton-shimmer rounded w-3/4 mb-6"></div>
          <div className="h-40 skeleton-shimmer rounded w-full mb-4"></div>
          <div className="h-11 skeleton-shimmer rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-rose-600">{fetchError}</p>
        <Link to="/dashboard" className="text-indigo-600 mt-4 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 md:py-12 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-2">
            Edit Blog
          </h1>
          <p className="text-slate-500 text-sm">
            Update your blog content
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          {error && (
            <div className="mb-6 p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-200 animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">Blog Title</label>
              <input
                type="text" id="title" name="title"
                value={formData.title} onChange={handleChange}
                maxLength={200}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
              <p className="mt-1.5 text-xs text-slate-400 text-right">{formData.title.length}/200</p>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1.5">Blog Content</label>
              <textarea
                id="content" name="content"
                value={formData.content} onChange={handleChange}
                rows={12}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-y min-h-[200px]"
              />
            </div>

            <button
              type="submit" disabled={submitting}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[44px]"
            >
              {submitting ? 'Updating...' : 'Update Blog'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
