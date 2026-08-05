const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate, authorize } = require('../../middlewares/authMiddleware');

// Authenticated user reading their profile or updating candidate/volunteer details
router.get('/me', authenticate, (req, res) => {
  // Convenience route using req.user.id populated by authMiddleware
  req.params.userId = req.user.id;
  return userController.getUserProfile(req, res);
});

// Read User Profile
router.get('/:userId', userController.getUserProfile);

// Candidate Profile Endpoints
router.put('/candidate', userController.updateCandidateProfile);

// Volunteer Profile Endpoints
router.put('/volunteer', userController.updateVolunteerProfile);
router.patch('/volunteer/location', userController.updateVolunteerLocation);
router.patch('/volunteer/availability', userController.toggleVolunteerAvailability);

module.exports = router;