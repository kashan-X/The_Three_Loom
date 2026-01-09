// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/place', orderController.createOrder);
router.get('/all', authMiddleware, orderController.getAllOrders);
router.delete('/:id', authMiddleware, orderController.deleteOrder);
router.put('/:id', authMiddleware, orderController.updateOrder);
router.get('/customer-summary', orderController.getCustomerSummary);


module.exports = router;
