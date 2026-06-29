const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Customer routes
router.post('/place', upload.single('paymentScreenshot'), orderController.createOrder);
router.get('/my-orders', authMiddleware, orderController.getMyOrders);
router.get('/:id/cancel-preview', authMiddleware, orderController.getCancelPreview);
router.post('/:id/cancel', authMiddleware, orderController.cancelOrder);

// Admin routes
router.get('/all', authMiddleware, orderController.getAllOrders);
router.get('/customer-summary', orderController.getCustomerSummary);
router.post('/:id/approve-payment', authMiddleware, orderController.approvePayment);
router.post('/:id/reject-payment', authMiddleware, orderController.rejectPayment);
router.delete('/:id', authMiddleware, orderController.deleteOrder);
router.put('/:id', authMiddleware, orderController.updateOrder);

module.exports = router;