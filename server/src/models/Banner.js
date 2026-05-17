const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    image: { url: String, publicId: String },
    mobileImage: { url: String, publicId: String },
    linkUrl: String,
    buttonText: String,
    position: { type: String, enum: ['hero', 'mid', 'sidebar', 'popup'], default: 'hero' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
