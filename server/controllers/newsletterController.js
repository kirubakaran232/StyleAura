const asyncHandler = require('express-async-handler');
const Subscriber = require('../models/Subscriber');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const existing = await Subscriber.findOne({ email });
  if (existing) {
    if (!existing.isActive) {
      existing.isActive = true;
      await existing.save();
      return res.json({ success: true, message: 'Welcome back! Resubscribed successfully.' });
    }
    return res.status(400).json({ success: false, message: 'Already subscribed!' });
  }

  await Subscriber.create({ email });
  res.status(201).json({ success: true, message: 'Successfully subscribed!' });
});

// @desc    Get all subscribers (admin)
// @route   GET /api/newsletter/subscribers
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find().sort('-createdAt');
  res.json({ success: true, subscribers, total: subscribers.length });
});

module.exports = { subscribe, getSubscribers };
