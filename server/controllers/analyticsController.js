const asyncHandler = require('express-async-handler');
const Blog = require('../models/Blog');
const Product = require('../models/Product');
const Click = require('../models/Click');
const Subscriber = require('../models/Subscriber');

// @desc    Get analytics summary
// @route   GET /api/analytics/summary
const getSummary = asyncHandler(async (req, res) => {
  const [totalBlogs, totalProducts, totalSubscribers, totalClicks] = await Promise.all([
    Blog.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Subscriber.countDocuments({ isActive: true }),
    Click.countDocuments(),
  ]);

  // Total views across all blogs
  const viewsAgg = await Blog.aggregate([
    { $group: { _id: null, totalViews: { $sum: '$views' }, totalLikes: { $sum: '$likes' } } },
  ]);
  const totalViews = viewsAgg[0]?.totalViews || 0;
  const totalLikes = viewsAgg[0]?.totalLikes || 0;

  // Total product clicks
  const clicksAgg = await Product.aggregate([
    { $group: { _id: null, totalClicks: { $sum: '$clicks' } } },
  ]);
  const totalProductClicks = clicksAgg[0]?.totalClicks || 0;

  // Clicks per day (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const clicksPerDay = await Click.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, resourceType: 'product' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Views per day (last 30 days)
  const viewsPerDay = await Click.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, resourceType: 'blog' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Top products by clicks
  const topProducts = await Product.find()
    .sort('-clicks')
    .limit(5)
    .select('name clicks images slug');

  // Top blogs by views
  const topBlogs = await Blog.find()
    .sort('-views')
    .limit(5)
    .select('title views likes coverImage slug');

  res.json({
    success: true,
    stats: {
      totalBlogs,
      totalProducts,
      totalSubscribers,
      totalClicks,
      totalViews,
      totalLikes,
      totalProductClicks,
    },
    charts: { clicksPerDay, viewsPerDay },
    topProducts,
    topBlogs,
  });
});

module.exports = { getSummary };
