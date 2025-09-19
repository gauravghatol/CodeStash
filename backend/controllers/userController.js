const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

const signToken = (user) => jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

// helper to generate a 6-digit code
function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/users/register (OTP-based)
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please provide username, email, and password');
  }
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    res.status(400);
    throw new Error('User with that email or username already exists');
  }

  // Create user
  const user = await User.create({ username, email, password, isVerified: false });

  // Generate and store OTP for signup
  const otp = generateOtpCode();
  const salt = await bcrypt.genSalt(10);
  user.otpCodeHash = await bcrypt.hash(otp, salt);
  user.otpPurpose = 'signup';
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  // Send OTP via email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Your CodeStash verification code',
      html: `<p>Hi ${user.username},</p>
             <p>Your verification code is:</p>
             <p style="font-size:24px;font-weight:700;letter-spacing:4px">${otp}</p>
             <p>This code will expire in 10 minutes.</p>`,
    });
  } catch (err) {
    const fallback = String(process.env.DEV_EMAIL_FALLBACK || '').toLowerCase() === 'true';
    console.warn('Failed to send signup OTP:', err.message);
    if (fallback) {
      return res.json({
        message: 'Signup successful. Email could not be sent. Use this code to verify.',
        devCode: otp,
      });
    }
    await User.deleteOne({ _id: user._id }).catch(() => {});
    res.status(500);
    throw new Error('Failed to send verification code. Please try again later.');
  }

  res.json({ message: 'Signup successful. Enter the verification code sent to your email to verify the account.' });
});

// POST /api/users/verify-otp { email, code, purpose }
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, code, purpose } = req.body;
  if (!email || !code) {
    res.status(400);
    throw new Error('Email and code are required');
  }
  const user = await User.findOne({ email });
  if (!user || !user.otpCodeHash || !user.otpExpiresAt) {
    res.status(400);
    throw new Error('No active code. Please request a new one.');
  }
  if (user.otpPurpose && purpose && user.otpPurpose !== purpose) {
    res.status(400);
    throw new Error('Code purpose mismatch');
  }
  if (user.otpExpiresAt.getTime() < Date.now()) {
    res.status(400);
    throw new Error('Code expired. Please request a new one.');
  }
  const match = await bcrypt.compare(code, user.otpCodeHash);
  if (!match) {
    res.status(400);
    throw new Error('Invalid code');
  }
  if (!user.isVerified && (user.otpPurpose === 'signup' || purpose === 'signup')) {
    user.isVerified = true;
  }
  user.otpCodeHash = undefined;
  user.otpExpiresAt = undefined;
  user.otpPurpose = undefined;
  await user.save();
  res.json({ message: 'Code verified successfully.' });
});

// POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  const match = await user.matchPassword(password);
  if (!match) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  if (!user.isVerified) {
    res.status(401);
    throw new Error('Please verify your email before logging in');
  }
  const token = signToken(user);
  res.json({ token, user: { _id: user._id, username: user.username, email: user.email } });
});

// GET /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password -verificationToken');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// POST /api/users/resend-otp { email, purpose }
const resendOtp = asyncHandler(async (req, res) => {
  const { email, purpose = 'signup' } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (purpose === 'signup' && user.isVerified) {
    res.status(400);
    throw new Error('Account is already verified');
  }
  const otp = generateOtpCode();
  const salt = await bcrypt.genSalt(10);
  user.otpCodeHash = await bcrypt.hash(otp, salt);
  user.otpPurpose = purpose === 'signup' ? 'signup' : 'password_reset';
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  try {
    await sendEmail({
      to: user.email,
      subject: purpose === 'signup' ? 'Your CodeStash verification code' : 'Your CodeStash password reset code',
      html: `<p>Hi ${user.username},</p>
             <p>Your ${purpose === 'signup' ? 'verification' : 'password reset'} code is:</p>
             <p style="font-size:24px;font-weight:700;letter-spacing:4px">${otp}</p>
             <p>This code will expire in 10 minutes.</p>`,
    });
  } catch (err) {
    const fallback = String(process.env.DEV_EMAIL_FALLBACK || '').toLowerCase() === 'true';
    console.warn('Failed to resend OTP:', err.message);
    if (fallback) {
      return res.json({ message: 'Verification code resent (email failed). Use this code.', devCode: otp });
    }
    res.status(500);
    throw new Error('Could not resend code. Please try later.');
  }
  res.json({ message: 'Verification code resent.' });
});

// POST /api/users/forgot-password { email }
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: 'If an account exists, a code has been sent.' });
  }
  const otp = generateOtpCode();
  const salt = await bcrypt.genSalt(10);
  user.otpCodeHash = await bcrypt.hash(otp, salt);
  user.otpPurpose = 'password_reset';
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  try {
    await sendEmail({
      to: user.email,
      subject: 'Your CodeStash password reset code',
      html: `<p>Hi ${user.username},</p>
             <p>Your password reset code is:</p>
             <p style=\"font-size:24px;font-weight:700;letter-spacing:4px\">${otp}</p>
             <p>This code will expire in 10 minutes.</p>`,
    });
  } catch (err) {
    const fallback = String(process.env.DEV_EMAIL_FALLBACK || '').toLowerCase() === 'true';
    console.warn('Failed to send forgot-password OTP:', err.message);
    if (fallback) {
      return res.json({ message: 'If an account exists, use this code (email failed).', devCode: otp });
    }
    // Still respond with generic message to avoid enumeration
  }
  res.json({ message: 'If an account exists, a code has been sent.' });
});

// POST /api/users/reset-password { email, code, newPassword }
const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    res.status(400);
    throw new Error('Email, code and newPassword are required');
  }
  const user = await User.findOne({ email });
  if (!user || !user.otpCodeHash || !user.otpExpiresAt || user.otpPurpose !== 'password_reset') {
    res.status(400);
    throw new Error('Invalid or expired code');
  }
  if (user.otpExpiresAt.getTime() < Date.now()) {
    res.status(400);
    throw new Error('Code expired. Please request a new one.');
  }
  const match = await bcrypt.compare(code, user.otpCodeHash);
  if (!match) {
    res.status(400);
    throw new Error('Invalid code');
  }
  user.password = newPassword; // will be hashed by pre-save hook
  user.otpCodeHash = undefined;
  user.otpExpiresAt = undefined;
  user.otpPurpose = undefined;
  await user.save();
  res.json({ message: 'Password has been reset successfully.' });
});

module.exports = { registerUser, verifyOtp, loginUser, getUserProfile, resendOtp, forgotPassword, resetPassword };
