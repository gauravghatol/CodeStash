const express = require('express');
const { registerUser, verifyOtp, loginUser, getUserProfile, resendOtp, forgotPassword, resetPassword } = require('../controllers/userController');
const { getUserSnippets } = require('../controllers/snippetController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// OTP based routes
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getUserProfile);
router.get('/:userId/snippets', protect, getUserSnippets);

module.exports = router;
