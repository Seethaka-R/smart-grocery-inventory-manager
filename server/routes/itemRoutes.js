const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getItems, addItem, updateItem, deleteItem, updateQuantity,
  getLowStockItems, getExpiryAlerts
} = require('../controllers/itemController');

// Alert routes (before /:id to avoid conflict)
router.get('/alerts/lowstock', protect, getLowStockItems);
router.get('/alerts/expiry', protect, getExpiryAlerts);

// CRUD routes
router.route('/').get(protect, getItems).post(protect, addItem);
router.route('/:id').put(protect, updateItem).delete(protect, deleteItem);
router.patch('/:id/quantity', protect, updateQuantity);

module.exports = router;