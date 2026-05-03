const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/summary', protect, adminOnly, getSummary);

module.exports = router;
