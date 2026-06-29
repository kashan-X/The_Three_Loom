require('dotenv').config();
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const User     = require('../models/user');
const { sendPasswordResetEmail } = require('../services/emailService');

const ADMIN_REGISTRATION_CODE = process.env.ADMIN_REGISTRATION_CODE;
const JWT_SECRET              = process.env.JWT_SECRET;
const CLIENT_URL              = process.env.CLIENT_URL || 'http://localhost:5173';

const registerUser = async (req, res) => {
  const { name, email, password, cnic, role, adminCode } = req.body;

  if (role !== 'admin' || adminCode !== ADMIN_REGISTRATION_CODE) {
    return res.status(403).json({ message: 'Only admin registration is allowed with valid admin code' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, cnic, role });

    res.status(201).json({
      message: 'Admin registered successfully',
      userId: user._id, name: user.name, email: user.email, cnic: user.cnic
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)               return res.status(400).json({ message: 'User not found' });
    if (user.role !== 'admin') return res.status(403).json({ message: 'Only admin login is allowed' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', user: { userId: user._id, name: user.name, email: user.email, token } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email, role: 'admin' });

    // Always respond the same way — don't reveal whether the email exists
    if (!user) {
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // Generate a secure random token
    const rawToken  = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.passwordResetToken  = hashedToken;
    user.passwordResetExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    const resetUrl = `${CLIENT_URL}/admin/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;
    await sendPasswordResetEmail(user, resetUrl);

    res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /auth/reset-password
const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ message: 'Email, token and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      email,
      role: 'admin',
      passwordResetToken:  hashedToken,
      passwordResetExpiry: { $gt: new Date() }, // not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired.' });
    }

    user.password            = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken  = null;
    user.passwordResetExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };