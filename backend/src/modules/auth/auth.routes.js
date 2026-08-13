<<<<<<< HEAD
=======
// Auth endpoints
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

<<<<<<< HEAD
router.get('/digilocker/initiate', authController.initiateDigiLocker);
router.get('/digilocker/callback', authController.digilockerCallback);
=======
// POST /api/v1/auth/digilocker
router.post('/digilocker', authController.digilockerLogin);
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db

module.exports = router;