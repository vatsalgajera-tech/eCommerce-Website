const router = require('express').Router();
const { placeOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// IMPORTANT: specific routes must come before /:id wildcard
router.get('/admin', protect, adminOnly, getAllOrders);
router.get('/my', protect, getMyOrders);
router.post('/', protect, placeOrder);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
