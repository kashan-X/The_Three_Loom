// routes/contactRoute.js
const express = require('express');
const router = express.Router();
const {
  submitMessage,
  getAllMessages,
  updateMessageStatus,
  deleteMessage
} = require('../controllers/contactController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', submitMessage);                              // public
router.get('/', authMiddleware, getAllMessages);               // admin only
router.put('/:id', authMiddleware, updateMessageStatus);       // admin only
router.delete('/:id', authMiddleware, deleteMessage);          // admin only

module.exports = router;