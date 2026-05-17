const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  size: String,
  color: String,
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, unique: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
    },
    billingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      city: String,
      state: String,
      pincode: String,
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod', 'upi', 'card', 'netbanking', 'wallet'],
      required: true,
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    deliveryOption: { type: String, enum: ['standard', 'express'], default: 'standard' },
    shippingCharge: { type: Number, default: 0 },
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    gstAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'return-requested', 'returned'],
      default: 'placed',
    },
    trackingId: String,
    shippingPartner: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    cancelReason: String,
    returnReason: String,
    invoiceUrl: String,
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre('save', async function () {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `SV${Date.now().toString().slice(-6)}${count + 1}`;
    this.statusHistory.push({ status: 'placed', note: 'Order placed successfully' });
  }
});

module.exports = mongoose.model('Order', orderSchema);
