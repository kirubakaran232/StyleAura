const express = require('express');
const router = express.Router();
const { login, getMe, logout, register } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.get('/me', protect, getMe);

module.exports = router;
