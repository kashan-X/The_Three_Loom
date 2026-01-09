const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware.js');
const { registerUser, loginUser } = require('../controllers/auth.js');


router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
