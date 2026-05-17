const router = require('express').Router();
const {
  register, verifyOTP, login, loginSendOTP, loginVerifyOTP,
  forgotPassword, resetPassword, getMe,
  updateProfile, getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);               // password-based (admin/fallback)
router.post('/login/send-otp', loginSendOTP);   // OTP login step 1
router.post('/login/verify-otp', loginVerifyOTP); // OTP login step 2
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:id', protect, updateAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.put('/addresses/:id/default', protect, setDefaultAddress);

module.exports = router;
