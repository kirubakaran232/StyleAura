const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const Click = require('../models/Click');
const Product = require('../models/Product');
const User = require('../models/User');
const { uploadBuffer, uploadFiles } = require('../utils/cloudinary');

function safeJsonParse(value, fallback) {
  if (typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

// @desc    Get all blogs (paginated, filtered)
// @route   GET /api/blogs
const getBlogs = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 12, 1), 50);

  const query = { isPublished: true };
  if (category && category !== 'All') query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (pageNumber - 1) * limitNumber;
  const total = await Blog.countDocuments(query);
  const blogs = await Blog.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNumber)
    .select('-comments -content')
    .lean();

  res.json({
    success: true,
    blogs,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      hasMore: skip + blogs.length < total,
    },
  });
});

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true }).lean();

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  if (Array.isArray(blog.featuredProducts) && blog.featuredProducts.length > 0) {
    const validIds = blog.featuredProducts
      .map(id => id?.toString?.() || id)
      .filter(id => mongoose.Types.ObjectId.isValid(id));
    blog.featuredProducts = validIds.length > 0
      ? await Product.find({ _id: { $in: validIds } }).lean()
      : [];
  }

  // Increment views
  await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

  // Track click
  await Click.create({
    resourceId: blog._id,
    resourceType: 'blog',
    ipHash: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({ success: true, blog });
});

// @desc    Create blog (admin)
// @route   POST /api/blogs
const createBlog = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  // Handle tags
  if (typeof data.tags === 'string') {
    data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
  }
  if (typeof data.featuredProducts === 'string') {
    data.featuredProducts = data.featuredProducts.split(',').filter(Boolean);
  }

  const cover = req.files?.coverImage?.[0] || req.files?.['coverImage[]']?.[0];
  const images = req.files?.images || req.files?.['images[]'] || [];

  if (cover) {
    const uploadedCover = await uploadBuffer(cover, 'styleaura/blogs/covers');
    data.coverImage = uploadedCover.url;
    data.coverImagePublicId = uploadedCover.publicId;
  }

  if (images.length > 0) {
    const uploadedImages = await uploadFiles(images, 'styleaura/blogs/gallery');
    data.images = uploadedImages.map(image => image.url);
    // If cover wasn't uploaded, use first image as cover for nicer cards.
    if (!data.coverImage) data.coverImage = data.images[0];
  }

  // Ensure unique slug
  if (data.title && !data.slug) {
    let slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    const existing = await Blog.findOne({ slug });
    if (existing) slug = slug + '-' + Date.now();
    data.slug = slug;
  }

  if (!data.title || !data.content || !data.category) {
    res.status(400);
    throw new Error('Title, content, and category are required');
  }

  const blog = await Blog.create(data);
  res.status(201).json({ success: true, blog });
});

// @desc    Update blog (admin)
// @route   PUT /api/blogs/:id
const updateBlog = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  if (typeof data.tags === 'string') {
    data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
  }
  if (typeof data.featuredProducts === 'string') {
    data.featuredProducts = data.featuredProducts.split(',').filter(Boolean);
  }

  const cover = req.files?.coverImage?.[0] || req.files?.['coverImage[]']?.[0];
  const newImages = req.files?.images || req.files?.['images[]'] || [];

  if (cover) {
    const uploadedCover = await uploadBuffer(cover, 'styleaura/blogs/covers');
    data.coverImage = uploadedCover.url;
    data.coverImagePublicId = uploadedCover.publicId;
  }

  // Keep whatever images the client says to keep, then append newly uploaded ones.
  const existingImages = safeJsonParse(req.body.existingImages, null);
  if (Array.isArray(existingImages)) {
    data.images = existingImages.filter(Boolean);
  }
  if (newImages.length > 0) {
    const uploadedImages = await uploadFiles(newImages, 'styleaura/blogs/gallery');
    const uploaded = uploadedImages.map(image => image.url);
    data.images = Array.isArray(data.images) ? [...data.images, ...uploaded] : uploaded;
  }

  const blog = await Blog.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  res.json({ success: true, blog });
});

// @desc    Delete blog (admin)
// @route   DELETE /api/blogs/:id
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }
  res.json({ success: true, message: 'Blog deleted' });
});

// @desc    Like a blog
// @route   POST /api/blogs/:id/like
const likeBlog = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('likedBlogs');
  const alreadyLiked = user.likedBlogs.some(id => id.toString() === req.params.id);

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: alreadyLiked ? -1 : 1 } },
    { new: true }
  );

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  if (alreadyLiked) {
    user.likedBlogs = user.likedBlogs.filter(id => id.toString() !== req.params.id);
  } else {
    user.likedBlogs.push(blog._id);
  }
  await user.save();

  if (blog.likes < 0) {
    blog.likes = 0;
    await blog.save();
  }

  res.json({ success: true, likes: blog.likes, liked: !alreadyLiked });
});

// @desc    Add comment
// @route   POST /api/blogs/:id/comments
const addComment = asyncHandler(async (req, res) => {
  const { name, email, content } = req.body;
  if (!name || !email || !content) {
    res.status(400);
    throw new Error('Name, email, and content are required');
  }

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: { name, email, content } } },
    { new: true }
  );

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  res.status(201).json({ success: true, comments: blog.comments });
});

// @desc    Get all blogs (admin, includes drafts)
// @route   GET /api/blogs/admin/all
const getAdminBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort('-createdAt').select('-content -comments');
  res.json({ success: true, blogs });
});

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  getAdminBlogs,
};
