const router = require('express').Router();
const Banner = require('../models/Banner');
const { protect, adminOnly } = require('../middleware/auth');

// Public: get active banners
router.get('/', async (req, res, next) => {
  try {
    const { position } = req.query;
    const query = { isActive: true };
    if (position) query.position = position;
    const banners = await Banner.find(query).sort({ order: 1 });
    res.json({ success: true, banners });
  } catch (err) { next(err); }
});

// Admin CRUD
router.use(protect, adminOnly);

router.post('/', async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, banner });
  } catch (err) { next(err); }
});

router.get('/all', async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json({ success: true, banners });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, banner });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
