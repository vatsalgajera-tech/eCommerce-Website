const router = require('express').Router();
const { createReview, getProductReviews, getMyReviews, getAllReviews, toggleApproval, deleteReview } = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/my', protect, getMyReviews);
router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);
router.get('/admin', protect, adminOnly, getAllReviews);
router.put('/admin/:id/approve', protect, adminOnly, toggleApproval);
router.delete('/admin/:id', protect, adminOnly, deleteReview);

module.exports = router;
