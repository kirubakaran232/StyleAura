const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const getBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('bookmarks');
  res.json({ success: true, bookmarks: user.bookmarks || [] });
});

const addBookmark = asyncHandler(async (req, res) => {
  const { itemId, type, title, slug, coverImage } = req.body;

  if (!itemId || !type || !title || !slug) {
    res.status(400);
    throw new Error('Bookmark item details are required');
  }

  const itemType = type === 'blog' ? 'Blog' : type === 'product' ? 'Product' : null;
  if (!itemType) {
    res.status(400);
    throw new Error('Invalid bookmark type');
  }

  const user = await User.findById(req.user.id).select('bookmarks');
  const exists = user.bookmarks.some(bookmark => bookmark.itemId.toString() === itemId);

  if (!exists) {
    user.bookmarks.push({ itemId, itemType, type, title, slug, coverImage });
    await user.save();
  }

  res.status(201).json({ success: true, bookmarks: user.bookmarks });
});

const removeBookmark = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('bookmarks');
  user.bookmarks = user.bookmarks.filter(
    bookmark => bookmark.itemId.toString() !== req.params.itemId
  );
  await user.save();

  res.json({ success: true, bookmarks: user.bookmarks });
});

const getLikedBlogs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('likedBlogs');
  res.json({
    success: true,
    likedBlogs: (user.likedBlogs || []).map(id => id.toString()),
  });
});

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark,
  getLikedBlogs,
};
