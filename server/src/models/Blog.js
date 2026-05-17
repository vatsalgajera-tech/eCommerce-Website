const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { url: String },
  author: { type: String, default: 'Shree Vastra Team' },
  tags: [String],
  category: { type: String, default: 'Fashion' },
  isPublished: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
