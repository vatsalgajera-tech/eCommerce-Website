const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @GET /api/admin/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const [totalOrders, deliveredRevenue, deliveredOrders, totalProducts, totalCustomers, recentOrders, lowStock] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $match: { status: 'delivered' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.countDocuments({ status: 'delivered' }),
      Product.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'customer' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Product.find({ stockQty: { $lte: 5 }, status: 'active' }).select('name stockQty category'),
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: deliveredRevenue[0]?.total || 0,
        deliveredOrders,
        totalProducts,
        totalCustomers,
      },
      recentOrders,
      lowStock,
    });
  } catch (err) { next(err); }
};

// @GET /api/admin/customers
exports.getCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'customer' };
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const skip = (Number(page) - 1) * Number(limit);
    const [customers, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select('-password -otp'),
      User.countDocuments(query),
    ]);
    res.json({ success: true, customers, total });
  } catch (err) { next(err); }
};

// @PUT /api/admin/customers/:id/block
exports.toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ success: true, isBlocked: user.isBlocked });
  } catch (err) { next(err); }
};
