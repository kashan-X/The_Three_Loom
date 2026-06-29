// routes/customerAuthRoute.js
const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  getCurrentCustomer,
  updateProfile,
  changePassword
} = require('../controllers/customerAuthController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.get('/me', authMiddleware, getCurrentCustomer);         // protected: get profile
router.put('/me', authMiddleware, updateProfile);              // protected: update profile
router.put('/change-password', authMiddleware, changePassword); // protected: change password

module.exports = router;