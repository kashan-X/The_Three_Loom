require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models').User;

const ADMIN_REGISTRATION_CODE = process.env.ADMIN_REGISTRATION_CODE;
const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  const { userId, name, email, password, cnic, role, adminCode } = req.body;

  // Only allow admin registration with correct admin code
  if (role !== 'admin' || adminCode !== ADMIN_REGISTRATION_CODE) {
    return res.status(403).json({ message: 'Only admin registration is allowed with valid admin code' });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId,
      name,
      email,
      password: hashedPassword,
      cnic,
      role
    });

    res.status(201).json({
      message: 'Admin registered successfully',
      userId: user.id,
      name: user.name,
      email: user.email,
      cnic: user.cnic
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin login is allowed' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
        token: token
      }
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};
