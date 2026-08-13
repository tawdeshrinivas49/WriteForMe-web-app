const userService = require('./user.service');
<<<<<<< HEAD
// backend/src/modules/users/user.controller.js
const prisma = require('../../config/database');

exports.getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT middleware

    const student = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: {
          include: {
            requests: {
              where: { status: { in: ['CREATED', 'MATCHED', 'IN_PROGRESS'] } },
              orderBy: { examDate: 'asc' },
              take: 5,
            },
          },
        },
      },
    });

    if (!student || student.role !== 'STUDENT') {
      return res.status(403).json({ error: 'Not a student account' });
    }

    const totalSessions = await prisma.examRequest.count({
      where: { candidateId: student.candidateProfile.id },
    });
    const completedSessions = await prisma.examRequest.count({
      where: { candidateId: student.candidateProfile.id, status: 'COMPLETED' },
    });
    // Average rating - dummy for now; compute from reviews if available
    const averageRating = 4.8;

    res.json({
      profile: student,
      upcomingExams: student.candidateProfile.requests,
      stats: {
        totalSessions,
        completedSessions,
        averageRating,
      },
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
};

/**
 * GET /users/dashboard/volunteer
 * Fetch volunteer dashboard data (assigned exams, stats)
 */
exports.getVolunteerDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const volunteer = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        volunteerProfile: {
          include: {
            requests: {
              where: { status: { in: ['MATCHED', 'IN_PROGRESS', 'COMPLETED'] } },
              orderBy: { examDate: 'asc' },
              take: 5,
            },
          },
        },
      },
    });

    if (!volunteer || volunteer.role !== 'VOLUNTEER') {
      return res.status(403).json({ error: 'Not a volunteer account' });
    }

    const totalExams = await prisma.examRequest.count({
      where: { volunteerId: volunteer.volunteerProfile.id },
    });
    const completedExams = await prisma.examRequest.count({
      where: { volunteerId: volunteer.volunteerProfile.id, status: 'COMPLETED' },
    });
    const avgRatingResult = await prisma.scribeReview.aggregate({
      where: { request: { volunteerId: volunteer.volunteerProfile.id } },
      _avg: { rating: true },
    });

    res.json({
      profile: volunteer,
      upcomingAssignments: volunteer.volunteerProfile.requests,
      stats: {
        totalExams,
        completedExams,
        averageRating: avgRatingResult._avg.rating || 0,
        xpPoints: volunteer.volunteerProfile.xpPoints || 0,
      },
    });
  } catch (error) {
    console.error('Volunteer dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
};

=======
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db

// GET /api/v1/users/:userId
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await userService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/v1/users/candidate
exports.updateCandidateProfile = async (req, res) => {
  try {
    const { userId, udidNumber, disabilityType, homeLat, homeLng } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required.' });
    }

    const updatedProfile = await userService.updateCandidateProfile(userId, {
      udidNumber,
      disabilityType,
      homeLat,
      homeLng,
    });

    res.status(200).json({
      success: true,
      message: 'Candidate profile updated successfully.',
      data: updatedProfile,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/v1/users/volunteer
exports.updateVolunteerProfile = async (req, res) => {
  try {
    const {
      userId,
      upiId,
      hasVehicle,
      vehicleType,
      highestEducation,
      maxExamLevelAllowed,
      eduDocumentUrl,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required.' });
    }

    const updatedProfile = await userService.updateVolunteerProfile(userId, {
      upiId,
      hasVehicle,
      vehicleType,
      highestEducation,
      maxExamLevelAllowed,
      eduDocumentUrl,
    });

    res.status(200).json({
      success: true,
      message: 'Volunteer profile updated successfully.',
      data: updatedProfile,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// PATCH /api/v1/users/volunteer/location
exports.updateVolunteerLocation = async (req, res) => {
  try {
    const { userId, lastLat, lastLng } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required.' });
    }

    const updatedLocation = await userService.updateVolunteerLocation(userId, lastLat, lastLng);

    res.status(200).json({
      success: true,
      message: 'Volunteer live location updated.',
      data: updatedLocation,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// PATCH /api/v1/users/volunteer/availability
exports.toggleVolunteerAvailability = async (req, res) => {
  try {
    const { userId, isAvailable } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required.' });
    }

    const updatedVolunteer = await userService.toggleVolunteerAvailability(userId, isAvailable);

    res.status(200).json({
      success: true,
      message: `Volunteer availability set to ${isAvailable}.`,
      data: updatedVolunteer,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};