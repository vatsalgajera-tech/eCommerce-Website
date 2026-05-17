const Product = require('../models/Product');

// @GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, size, color, fabric, occasion, sort, search, page = 1, limit = 12, featured, newArrival, bestSeller } = req.query;
    const query = { status: 'active' };

    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (bestSeller === 'true') query.isBestSeller = true;
    if (minPrice || maxPrice) {
      query.discountPrice = {};
      if (minPrice) query.discountPrice.$gte = Number(minPrice);
      if (maxPrice) query.discountPrice.$lte = Number(maxPrice);
    }
    if (size) query.sizes = { $in: size.split(',') };
    if (color) query['colors.name'] = { $in: color.split(',') };
    if (fabric) query.fabric = { $regex: fabric, $options: 'i' };
    if (occasion) query.occasion = { $in: occasion.split(',') };
    if (search) query.$text = { $search: search };

    const sortOptions = {
      'price-asc': { discountPrice: 1 },
      'price-desc': { discountPrice: -1 },
      newest: { createdAt: -1 },
      popular: { 'ratings.count': -1 },
      rated: { 'ratings.average': -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortBy).skip(skip).limit(Number(limit)).select('-__v'),
      Product.countDocuments(query),
    ]);

    res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
};

// @GET /api/products/:slug
exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: 'active' });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

// @POST /api/admin/products
exports.createProduct = async (req, res, next) => {
  try {
    // Auto-generate slug from name
    const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const discountPercent = req.body.price && req.body.discountPrice
      ? Math.round(((req.body.price - req.body.discountPrice) / req.body.price) * 100) : 0;

    const product = await Product.create({ ...req.body, slug, discountPercent });
    res.status(201).json({ success: true, product });
  } catch (err) { next(err); }
};

// @PUT /api/admin/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

// @DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { next(err); }
};
