// controllers/customerAuthController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET;

// POST /customer/register
const registerCustomer = async (req, res) => {
  const { name, email, password, phone, cnic } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  // CNIC is optional, but if provided, do a light format check (13 digits, with or without dashes)
  if (cnic) {
    const cnicDigitsOnly = cnic.replace(/-/g, '');
    if (!/^\d{13}$/.test(cnicDigitsOnly)) {
      return res.status(400).json({ message: 'CNIC must be 13 digits (dashes optional, e.g. 12345-1234567-1)' });
    }
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      cnic,
      role: 'customer'
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' } // longer-lived than admin token, since customers shouldn't be logged out constantly
    );

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        token
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /customer/login
const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        token
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /customer/me  (used by frontend to check "am I logged in?" and load profile)
const getCurrentCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /customer/me  (update profile fields — name, phone, cnic; email/password handled separately)
const updateProfile = async (req, res) => {
  const { name, phone, cnic } = req.body;

  if (cnic) {
    const cnicDigitsOnly = cnic.replace(/-/g, '');
    if (!/^\d{13}$/.test(cnicDigitsOnly)) {
      return res.status(400).json({ message: 'CNIC must be 13 digits (dashes optional, e.g. 12345-1234567-1)' });
    }
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (cnic !== undefined) user.cnic = cnic;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cnic: user.cnic
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /customer/change-password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getCurrentCustomer,
  updateProfile,
  changePassword
};