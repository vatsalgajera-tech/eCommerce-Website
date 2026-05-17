const Review = require('../models/Review');
const Product = require('../models/Product');

// @POST /api/reviews — Create a review (logged-in user)
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, body, orderId } = req.body;
    if (!productId || !rating || !body)
      return res.status(400).json({ success: false, message: 'Product, rating and review text are required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Check if user already reviewed this product
    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });

    const review = await Review.create({
      product: productId, user: req.user._id,
      order: orderId || undefined,
      rating, title, body,
      isVerifiedPurchase: !!orderId,
      isApproved: true, // Auto-approve; set false for manual moderation
    });

    // Update product rating average
    const allReviews = await Review.find({ product: productId, isApproved: true });
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(productId, {
      'ratings.average': Math.round(avg * 10) / 10,
      'ratings.count': allReviews.length,
    });

    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, review });
  } catch (err) { next(err); }
};

// @GET /api/reviews/:productId — Get approved reviews for a product
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar');
    res.json({ success: true, reviews, total: reviews.length });
  } catch (err) { next(err); }
};

// @GET /api/reviews/my — Logged-in user's reviews
exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('product', 'name images slug');
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
};

// @GET /api/admin/reviews — All reviews (admin)
exports.getAllReviews = async (req, res, next) => {
  try {
    const { approved, page = 1, limit = 20 } = req.query;
    const query = approved !== undefined ? { isApproved: approved === 'true' } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [reviews, total] = await Promise.all([
      Review.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
        .populate('user', 'name email')
        .populate('product', 'name images'),
      Review.countDocuments(query),
    ]);
    res.json({ success: true, reviews, total });
  } catch (err) { next(err); }
};

// @PUT /api/admin/reviews/:id/approve — Approve/reject a review
exports.toggleApproval = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    review.isApproved = !review.isApproved;
    await review.save();

    // Recalculate product rating
    const allReviews = await Review.find({ product: review.product, isApproved: true });
    const avg = allReviews.length ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length : 0;
    await Product.findByIdAndUpdate(review.product, {
      'ratings.average': Math.round(avg * 10) / 10,
      'ratings.count': allReviews.length,
    });

    res.json({ success: true, isApproved: review.isApproved });
  } catch (err) { next(err); }
};

// @DELETE /api/admin/reviews/:id
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) { next(err); }
};
