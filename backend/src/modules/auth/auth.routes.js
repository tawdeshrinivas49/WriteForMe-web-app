// Auth endpoints
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// POST /api/v1/auth/digilocker
router.post('/digilocker', authController.digilockerLogin);

module.exports = router;