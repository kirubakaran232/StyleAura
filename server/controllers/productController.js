const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Click = require('../models/Click');

// @desc    Get all products (paginated, filtered)
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 12, sort = '-createdAt', trending } = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 12, 1), 50);

  const query = { isActive: true };
  if (category && category !== 'All') query.category = category;
  if (trending === 'true') query.isTrending = true;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (pageNumber - 1) * limitNumber;
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNumber);

  res.json({
    success: true,
    products,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      hasMore: skip + products.length < total,
    },
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

// @desc    Create product (admin)
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  if (typeof data.pros === 'string') {
    data.pros = data.pros.split('\n').map(p => p.trim()).filter(Boolean);
  }
  if (typeof data.cons === 'string') {
    data.cons = data.cons.split('\n').map(c => c.trim()).filter(Boolean);
  }

  // Handle uploaded images
  if (req.files && req.files.length > 0) {
    data.images = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      publicId: file.filename,
    }));
  }

  // Unique slug
  if (data.name && !data.slug) {
    let slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    const existing = await Product.findOne({ slug });
    if (existing) slug = slug + '-' + Date.now();
    data.slug = slug;
  }

  const product = await Product.create(data);
  res.status(201).json({ success: true, product });
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  if (typeof data.pros === 'string') {
    data.pros = data.pros.split('\n').map(p => p.trim()).filter(Boolean);
  }
  if (typeof data.cons === 'string') {
    data.cons = data.cons.split('\n').map(c => c.trim()).filter(Boolean);
  }

  if (req.files && req.files.length > 0) {
    data.images = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      publicId: file.filename,
    }));
  }

  const product = await Product.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, message: 'Product deleted' });
});

// @desc    Track affiliate click
// @route   POST /api/products/:id/click
const trackClick = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $inc: { clicks: 1 } },
    { new: true }
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Click.create({
    resourceId: product._id,
    resourceType: 'product',
    ipHash: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({ success: true, clicks: product.clicks, affiliateLink: product.affiliateLink });
});

// @desc    Get all products (admin)
// @route   GET /api/products/admin/all
const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort('-createdAt');
  res.json({ success: true, products });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  trackClick,
  getAdminProducts,
};
