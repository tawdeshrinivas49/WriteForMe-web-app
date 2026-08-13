// backend/src/modules/users/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate, authorize } = require('../../middlewares/authMiddleware');

// Authenticated user reading their profile
router.get('/me', authenticate, (req, res) => {
  req.params.userId = req.user.id;
  return userController.getUserProfile(req, res);
});

// Read User Profile
router.get('/:userId', userController.getUserProfile);

// Candidate Profile Endpoints
router.put('/candidate', authenticate, userController.updateCandidateProfile);

// Volunteer Profile Endpoints
router.put('/volunteer', authenticate, userController.updateVolunteerProfile);
router.patch('/volunteer/location', authenticate, userController.updateVolunteerLocation);
router.patch('/volunteer/availability', authenticate, userController.toggleVolunteerAvailability);

// ✅ NEW: Dashboard data endpoints (protected)
router.get('/dashboard/student', authenticate, userController.getStudentDashboard);
router.get('/dashboard/volunteer', authenticate, userController.getVolunteerDashboard);

module.exports = router;