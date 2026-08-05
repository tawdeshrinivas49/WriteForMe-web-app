const userService = require('./user.service');

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