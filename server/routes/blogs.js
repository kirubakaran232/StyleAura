const express = require('express');
const router = express.Router();
const {
  getBlogs, getBlog, createBlog, updateBlog, deleteBlog,
  likeBlog, addComment, getAdminBlogs,
} = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public
router.get('/', getBlogs);
router.get('/admin/all', protect, adminOnly, getAdminBlogs);
router.get('/:slug', getBlog);
router.post('/:id/like', likeBlog);
router.post('/:id/comments', addComment);

// Admin
router.post(
  '/',
  protect,
  adminOnly,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 12 },
  ]),
  createBlog
);
router.put(
  '/:id',
  protect,
  adminOnly,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 12 },
  ]),
  updateBlog
);
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;
