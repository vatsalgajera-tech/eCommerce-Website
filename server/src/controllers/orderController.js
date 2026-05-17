const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// Shipping rates (fixed flat rate as requested)
const SHIPPING_RATES = { standard: 99, express: 199, free_threshold: 999 };
const GST_RATE = 0.05; // 5% GST

// @POST /api/orders
exports.placeOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, deliveryOption, couponCode } = req.body;

    // Validate stock & get latest prices
    let subtotal = 0;
    const orderItems = [];
    const mongoose = require('mongoose');
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.product))
        return res.status(400).json({ success: false, message: 'Invalid product in cart. Please refresh and try again.' });
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      if (product.stockQty < item.qty) return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });

      const price = product.discountPrice || product.price;
      subtotal += price * item.qty;
      orderItems.push({ product: product._id, name: product.name, image: product.images[0]?.url, size: item.size, color: item.color, qty: item.qty, price });
    }

    // Coupon
    let couponDiscount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && coupon.expiry > Date.now() && coupon.usedCount < coupon.usageLimit && subtotal >= coupon.minOrderValue) {
        couponDiscount = coupon.discountType === 'flat' ? coupon.discountValue : Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity);
        coupon.usedCount += 1;
        coupon.usedBy.push(req.user._id);
        await coupon.save();
      }
    }

    const afterDiscount = subtotal - couponDiscount;
    const shippingCharge = afterDiscount >= SHIPPING_RATES.free_threshold ? 0 : SHIPPING_RATES[deliveryOption] || SHIPPING_RATES.standard;
    const gstAmount = Math.round(afterDiscount * GST_RATE);
    const totalAmount = afterDiscount + shippingCharge + gstAmount;

    const order = await Order.create({
      user: req.user._id, items: orderItems, shippingAddress, billingAddress,
      paymentMethod, deliveryOption, couponCode, couponDiscount, subtotal,
      shippingCharge, gstAmount, totalAmount,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    });

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stockQty: -item.qty } });
    }

    res.status(201).json({ success: true, order });
  } catch (err) { next(err); }
};

// @GET /api/orders/my
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('items.product', 'name images');
    res.json({ success: true, orders });
  } catch (err) { next(err); }
};

// @GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images slug');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, order });
  } catch (err) { next(err); }
};

// @PUT /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note, trackingId, shippingPartner } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    if (trackingId) order.trackingId = trackingId;
    if (shippingPartner) order.shippingPartner = shippingPartner;
    if (status === 'delivered') order.deliveredAt = new Date();
    order.statusHistory.push({ status, note });
    await order.save();

    res.json({ success: true, order });
  } catch (err) { next(err); }
};

// @GET /api/admin/orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('user', 'name email'),
      Order.countDocuments(query),
    ]);
    res.json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
};
