import api from '../utils/axios';

export const getApprovedBlogs = async (params = {}) => {
  const response = await api.get('/api/blog/public', { params });
  return response.data;
};

export const createBlog = async (blogData) => {
  const response = await api.post('/api/blog/create', blogData);
  return response.data;
};

export const getMyBlogs = async () => {
  const response = await api.get('/api/blog/myblogs');
  return response.data;
};

export const updateBlog = async (blogId, blogData) => {
  const response = await api.put(`/api/blog/update/${blogId}`, blogData);
  return response.data;
};

export const deleteBlog = async (blogId) => {
  const response = await api.delete(`/api/blog/delete/${blogId}`);
  return response.data;
};

export const getBlogById = async (blogId) => {
  const response = await api.get(`/api/blog/${blogId}`);
  return response.data;
};
