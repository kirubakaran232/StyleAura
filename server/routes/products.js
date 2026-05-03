const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, createProduct, updateProduct,
  deleteProduct, trackClick, getAdminProducts,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public
router.get('/', getProducts);
router.get('/admin/all', protect, adminOnly, getAdminProducts);
router.get('/:slug', getProduct);
router.post('/:id/click', trackClick);

// Admin
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
