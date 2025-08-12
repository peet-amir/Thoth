const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateRegistration, validateLogin, validatePasswordUpdate } = require('../validators/auth.validator');

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/password', authenticate, validatePasswordUpdate, authController.updatePassword);

module.exports = router;