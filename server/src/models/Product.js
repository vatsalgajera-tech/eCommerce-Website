const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sku: { type: String, unique: true, sparse: true }, // Optional, auto-generated
    category: {
      type: String,
      required: true,
      enum: ['sarees', 'kurti', 'kurta', 'dress', 'dupatta', 'top-bottom-set', 'tops-tunics', 'jumpsuits', 'gowns', 'lenghas'],
    },
    subcategory: { type: String, trim: true },
    brand: { type: String, default: 'Shree Vastra' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    discountPercent: { type: Number, min: 0, max: 100 },
    images: [{ url: String, publicId: String }],
    video: { url: String, publicId: String },
    description: { type: String, required: true },
    fabric: { type: String },
    colors: [{ name: String, hex: String }],
    sizes: [String],
    stockQty: { type: Number, default: 10, min: 0 },
    weight: { type: Number },
    occasion: [String],
    careInstructions: { type: String },
    tags: [String],
    seoTitle: { type: String },
    seoDescription: { type: String },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive', 'out-of-stock'], default: 'active' },
  },
  { timestamps: true }
);

// Auto-generate SKU if not provided (Mongoose v7+ async hook — no next param)
productSchema.pre('save', function () {
  if (!this.sku) {
    const cat = this.category.substring(0, 3).toUpperCase();
    this.sku = `SV-${cat}-${Date.now()}-${Math.floor(Math.random() * 999)}`;
  }
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Product', productSchema);
