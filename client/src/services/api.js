import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Attach token from localStorage if present
const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// ── Blogs ───────────────────────────────────────────────────
export const getBlogs = (params) => api.get('/blogs', { params });
export const getBlog = (slug) => api.get(`/blogs/${slug}`);
export const createBlog = (data) => api.post('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);
export const likeBlog = (id) => api.post(`/blogs/${id}/like`);
export const addComment = (id, data) => api.post(`/blogs/${id}/comments`, data);
export const getAdminBlogs = () => api.get('/blogs/admin/all');

export const getBookmarks = () => api.get('/users/bookmarks');
export const addBookmark = (item) => api.post('/users/bookmarks', item);
export const removeBookmark = (itemId) => api.delete(`/users/bookmarks/${itemId}`);
export const getLikedBlogs = () => api.get('/users/likes');

// ── Products ────────────────────────────────────────────────
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (slug) => api.get(`/products/${slug}`);
export const createProduct = (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const trackClick = (id) => api.post(`/products/${id}/click`);
export const getAdminProducts = () => api.get('/products/admin/all');

// ── Analytics ───────────────────────────────────────────────
export const getAnalytics = () => api.get('/analytics/summary');

// ── Newsletter ──────────────────────────────────────────────
export const subscribe = (email) => api.post('/newsletter/subscribe', { email });

export default api;
