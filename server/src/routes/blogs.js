const router = require('express').Router();
const Blog = require('../models/Blog');
const { protect, adminOnly } = require('../middleware/auth');

// Public
router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 }).select('-content');
    res.json({ success: true, blogs });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } }, { new: true }
    );
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, blog });
  } catch (err) { next(err); }
});

// Admin
router.use(protect, adminOnly);

router.get('/admin/all', async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const slug = req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const blog = await Blog.create({ ...req.body, slug });
    res.status(201).json({ success: true, blog });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, blog });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
