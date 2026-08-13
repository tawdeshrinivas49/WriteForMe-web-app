<<<<<<< HEAD
// backend/src/modules/users/user.routes.js
=======
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate, authorize } = require('../../middlewares/authMiddleware');

<<<<<<< HEAD
// Authenticated user reading their profile
router.get('/me', authenticate, (req, res) => {
=======
// Authenticated user reading their profile or updating candidate/volunteer details
router.get('/me', authenticate, (req, res) => {
  // Convenience route using req.user.id populated by authMiddleware
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
  req.params.userId = req.user.id;
  return userController.getUserProfile(req, res);
});

// Read User Profile
router.get('/:userId', userController.getUserProfile);

// Candidate Profile Endpoints
<<<<<<< HEAD
router.put('/candidate', authenticate, userController.updateCandidateProfile);

// Volunteer Profile Endpoints
router.put('/volunteer', authenticate, userController.updateVolunteerProfile);
router.patch('/volunteer/location', authenticate, userController.updateVolunteerLocation);
router.patch('/volunteer/availability', authenticate, userController.toggleVolunteerAvailability);

// ✅ NEW: Dashboard data endpoints (protected)
router.get('/dashboard/student', authenticate, userController.getStudentDashboard);
router.get('/dashboard/volunteer', authenticate, userController.getVolunteerDashboard);
=======
router.put('/candidate', userController.updateCandidateProfile);

// Volunteer Profile Endpoints
router.put('/volunteer', userController.updateVolunteerProfile);
router.patch('/volunteer/location', userController.updateVolunteerLocation);
router.patch('/volunteer/availability', userController.toggleVolunteerAvailability);
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db

module.exports = router;