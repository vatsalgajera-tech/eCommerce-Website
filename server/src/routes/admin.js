const router = require('express').Router();
const { getDashboard, getCustomers, toggleBlockUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/dashboard', getDashboard);
router.get('/customers', getCustomers);
router.put('/customers/:id/block', toggleBlockUser);

module.exports = router;
