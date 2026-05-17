const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      password,
      otp,
      otpExpiry,
    });

    // In development, log OTP to console so user can verify without email setup
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n📧 OTP for ${email}: ${otp}\n`);
    }

    // TODO: Send OTP via email when email credentials are configured
    // sendOTPEmail(email, otp);

    res.status(201).json({
      success: true,
      message: `OTP sent! Check server console for OTP (dev mode: ${otp})`,
      userId: user._id,
      // In dev mode, also return OTP in response for easy testing
      ...(process.env.NODE_ENV !== 'production' && { devOTP: otp }),
    });
  } catch (err) { next(err); }
};

// @POST /api/auth/verify-otp
exports.verifyOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) return res.status(400).json({ success: false, message: 'userId and otp are required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (user.otpExpiry < Date.now()) return res.status(400).json({ success: false, message: 'OTP expired. Please register again.' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) { next(err); }
};

// @POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'No account found with this email' });
    if (!user.password) return res.status(401).json({ success: false, message: 'Please set a password first' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect password' });
    if (user.isBlocked) return res.status(403).json({ success: false, message: 'Your account has been blocked. Contact support.' });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) { next(err); }
};

// @POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'No account found with this email' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(`\n🔑 Password reset OTP for ${email}: ${otp}\n`);
    // TODO: Send via email when configured

    res.json({
      success: true,
      message: 'OTP sent to your email',
      userId: user._id,
      ...(process.env.NODE_ENV !== 'production' && { devOTP: otp }),
    });
  } catch (err) { next(err); }
};

// @POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { userId, otp, newPassword } = req.body;
    if (!userId || !otp || !newPassword)
      return res.status(400).json({ success: false, message: 'userId, otp and newPassword are required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (user.otpExpiry < Date.now()) return res.status(400).json({ success: false, message: 'OTP expired' });
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully. Please login.' });
  } catch (err) { next(err); }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @PUT /api/auth/profile — Update name, phone
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name: name.trim() }), ...(phone && { phone: phone.trim() }) },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar } });
  } catch (err) { next(err); }
};

// @GET /api/auth/addresses
exports.getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json({ success: true, addresses: user.addresses });
  } catch (err) { next(err); }
};

// @POST /api/auth/addresses
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const isFirst = user.addresses.length === 0;
    const newAddr = { ...req.body, isDefault: isFirst ? true : !!req.body.isDefault };
    if (newAddr.isDefault) user.addresses.forEach(a => { a.isDefault = false; });
    user.addresses.push(newAddr);
    await user.save();
    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (err) { next(err); }
};

// @PUT /api/auth/addresses/:id
exports.updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });
    if (req.body.isDefault) user.addresses.forEach(a => { a.isDefault = false; });
    Object.assign(addr, req.body);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) { next(err); }
};

// @DELETE /api/auth/addresses/:id
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });
    const wasDefault = addr.isDefault;
    addr.deleteOne();
    if (wasDefault && user.addresses.length > 0) user.addresses[0].isDefault = true;
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) { next(err); }
};

// @PUT /api/auth/addresses/:id/default
exports.setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.forEach(a => { a.isDefault = a._id.toString() === req.params.id; });
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) { next(err); }
};
