const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

router.get('/digilocker/initiate', authController.initiateDigiLocker);
router.get('/digilocker/callback', authController.digilockerCallback);

module.exports = router;