// routes/categoryDiscountRoute.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryDiscountController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes are admin-protected
router.get('/all', authMiddleware, ctrl.getAllDiscounts);
router.post('/set', authMiddleware, ctrl.setDiscount);
router.patch('/:category/toggle', authMiddleware, ctrl.toggleDiscount);
router.delete('/:category', authMiddleware, ctrl.deleteDiscount);

module.exports = router;