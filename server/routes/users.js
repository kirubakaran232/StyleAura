const express = require('express');
const router = express.Router();
const {
  getBookmarks,
  addBookmark,
  removeBookmark,
  getLikedBlogs,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/bookmarks', protect, getBookmarks);
router.post('/bookmarks', protect, addBookmark);
router.delete('/bookmarks/:itemId', protect, removeBookmark);
router.get('/likes', protect, getLikedBlogs);

module.exports = router;
