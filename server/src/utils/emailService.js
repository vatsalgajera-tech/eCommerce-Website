const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_16_digit_app_password') {
    return null; // email not configured
  }
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
    port:   Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth:   { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
};

// Send OTP email to new user
exports.sendOTPEmail = async (toEmail, userName, otp) => {
  const transporter = createTransporter();
  if (!transporter) return false;
  try {
    await transporter.sendMail({
      from:    `"Shree Vastra" <${process.env.EMAIL_USER}>`,
      to:      toEmail,
      subject: `Your OTP for Shree Vastra Registration – ${otp}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
          <div style="background:linear-gradient(135deg,#7B1C2E,#9E2438);padding:32px;text-align:center">
            <h1 style="color:white;font-size:1.8rem;margin:0;font-family:Georgia,serif">Shree Vastra</h1>
            <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:0.85rem">Elegance in Every Thread</p>
          </div>
          <div style="padding:36px 32px">
            <p style="font-size:1rem;color:#2D1A1A;margin-bottom:8px">Hello <strong>${userName}</strong>,</p>
            <p style="color:#6B4F4F;margin-bottom:24px">Use this OTP to verify your account. It expires in <strong>10 minutes</strong>.</p>
            <div style="text-align:center;background:#FDF6EC;border-radius:12px;padding:28px;margin-bottom:24px;border:2px dashed #E8D5C4">
              <div style="font-size:2.8rem;font-weight:900;letter-spacing:0.3em;color:#7B1C2E;font-family:monospace">${otp}</div>
              <p style="color:#6B4F4F;font-size:0.8rem;margin:8px 0 0">Do not share this OTP with anyone</p>
            </div>
            <p style="font-size:0.8rem;color:#9B8B8B;text-align:center">If you didn't create an account, please ignore this email.</p>
          </div>
          <div style="background:#FDF6EC;padding:16px;text-align:center;font-size:0.75rem;color:#9B8B8B">
            © ${new Date().getFullYear()} Shree Vastra · Rajkot, Gujarat
          </div>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error('Email send error:', err.message);
    return false;
  }
};

// Notify admin of new user registration
exports.sendNewUserNotification = async (userName, userEmail) => {
  const transporter = createTransporter();
  if (!transporter) return;
  try {
    await transporter.sendMail({
      from:    `"Shree Vastra System" <${process.env.EMAIL_USER}>`,
      to:      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `🎉 New Customer Registered – ${userName}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto">
          <div style="background:#7B1C2E;padding:20px 24px;border-radius:12px 12px 0 0">
            <h2 style="color:white;margin:0;font-size:1.2rem">New Customer Registration</h2>
          </div>
          <div style="background:white;padding:24px;border-radius:0 0 12px 12px;border:1px solid #E8D5C4">
            <p style="margin:0 0 12px"><strong>Name:</strong> ${userName}</p>
            <p style="margin:0 0 12px"><strong>Email:</strong> ${userEmail}</p>
            <p style="margin:0;color:#6B4F4F;font-size:0.875rem">Registered at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
      `,
    });
  } catch (err) { console.error('Admin notify error:', err.message); }
};
