const router = require('express').Router();
const { placeOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders, trackOrder } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// IMPORTANT: specific routes must come before /:id wildcard
router.get('/admin', protect, adminOnly, getAllOrders);
router.get('/my', protect, getMyOrders);
router.get('/track/:orderNumber', trackOrder); // public tracking by order number
router.post('/', protect, placeOrder);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
