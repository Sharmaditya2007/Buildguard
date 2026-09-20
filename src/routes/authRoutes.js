const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validateRegister, validateLogin } = require('../middlewares/validate');

// Public auth routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected user profile route
router.get('/me', protect, getMe);

module.exports = router;
