const userService = require("./user.service");
// backend/src/modules/users/user.controller.js
const prisma = require("../../config/database");

// ----- Student Dashboard -----
exports.getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: 'User ID missing from token' });
    }

    const student = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: {
          include: {
            requests: {
              where: {
                status: { in: ['CREATED', 'MATCHED', 'IN_PROGRESS'] }
              },
              orderBy: { examDate: 'asc' },
              take: 5
            }
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Even if candidateProfile is null, return empty data
    const dashboardData = {
      profile: student,
      upcomingExams: student.candidateProfile?.requests || [],
      stats: {
        totalSessions: 0,
        completedSessions: 0,
        averageRating: 0,
      }
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Student dashboard error:', error);
    next(error);
  }
};

// ----- Volunteer Dashboard -----
exports.getVolunteerDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: 'User ID missing from token' });

    const volunteer = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        volunteerProfile: {
          include: {
            requests: {
              orderBy: { examDate: 'asc' },
              take: 10, // or all
            },
          },
        },
      },
    });

    if (!volunteer) return res.status(404).json({ error: 'User not found' });

    const allRequests = volunteer.volunteerProfile?.requests || [];
    const active = allRequests.filter(r =>
      ['MATCHED', 'IN_PERSON_VERIFIED', 'IN_PROGRESS'].includes(r.status)
    );
    const completed = allRequests.filter(r => r.status === 'COMPLETED');

    const dashboardData = {
      profile: volunteer,
      upcomingAssignments: active,      // only active ones
      stats: {
        completedExams: completed.length,
        xpPoints: volunteer.volunteerProfile?.xpPoints || 0,
        averageRating: volunteer.volunteerProfile?.averageRating || 0,
      }
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Volunteer dashboard error:', error);
    next(error);
  }
};

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
      return res
        .status(400)
        .json({ success: false, error: "userId is required." });
    }

    const updatedProfile = await userService.updateCandidateProfile(userId, {
      udidNumber,
      disabilityType,
      homeLat,
      homeLng,
    });

    res.status(200).json({
      success: true,
      message: "Candidate profile updated successfully.",
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
      return res
        .status(400)
        .json({ success: false, error: "userId is required." });
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
      message: "Volunteer profile updated successfully.",
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
      return res
        .status(400)
        .json({ success: false, error: "userId is required." });
    }

    const updatedLocation = await userService.updateVolunteerLocation(
      userId,
      lastLat,
      lastLng,
    );

    res.status(200).json({
      success: true,
      message: "Volunteer live location updated.",
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
      return res
        .status(400)
        .json({ success: false, error: "userId is required." });
    }

    const updatedVolunteer = await userService.toggleVolunteerAvailability(
      userId,
      isAvailable,
    );

    res.status(200).json({
      success: true,
      message: `Volunteer availability set to ${isAvailable}.`,
      data: updatedVolunteer,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
