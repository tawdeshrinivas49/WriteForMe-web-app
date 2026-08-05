const prisma = require('../../config/database');

class UserService {
  /**
   * 1. Get Logged-in User Profile with role-specific details
   */
  static async getUserProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: true,
        volunteerProfile: true,
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
            reputationScore: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error(`User with ID '${userId}' not found.`);
    }

    return user;
  }

  /**
   * 2. Upsert Candidate Profile Attributes
   */
  static async updateCandidateProfile(userId, data) {
    const { udidNumber, disabilityType, homeLat, homeLng } = data;

    // Validate user existence and role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID '${userId}' not found.`);
    }

    const parsedLat = homeLat ? parseFloat(homeLat) : undefined;
    const parsedLng = homeLng ? parseFloat(homeLng) : undefined;

    const candidateProfile = await prisma.candidateProfile.upsert({
      where: { userId },
      update: {
        udidNumber: udidNumber || undefined,
        disabilityType: disabilityType || undefined,
        homeLat: parsedLat,
        homeLng: parsedLng,
      },
      create: {
        userId,
        udidNumber: udidNumber || null,
        disabilityType: disabilityType || null,
        homeLat: parsedLat || null,
        homeLng: parsedLng || null,
      },
    });

    return candidateProfile;
  }

  /**
   * 3. Upsert Volunteer Profile Attributes
   */
  static async updateVolunteerProfile(userId, data) {
    const {
      upiId,
      hasVehicle,
      vehicleType,
      highestEducation,
      maxExamLevelAllowed,
      eduDocumentUrl,
    } = data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID '${userId}' not found.`);
    }

    const volunteerProfile = await prisma.volunteerProfile.upsert({
      where: { userId },
      update: {
        upiId: upiId || undefined,
        hasVehicle: typeof hasVehicle === 'boolean' ? hasVehicle : undefined,
        vehicleType: vehicleType || undefined,
        highestEducation: highestEducation || undefined,
        maxExamLevelAllowed: maxExamLevelAllowed || undefined,
        eduDocumentUrl: eduDocumentUrl || undefined,
      },
      create: {
        userId,
        upiId: upiId || null,
        hasVehicle: hasVehicle || false,
        vehicleType: vehicleType || 'NONE',
        highestEducation: highestEducation || null,
        maxExamLevelAllowed: maxExamLevelAllowed || 'SECONDARY',
        eduDocumentUrl: eduDocumentUrl || null,
      },
    });

    return volunteerProfile;
  }

  /**
   * 4. Update Volunteer Live Location Tracking
   */
  static async updateVolunteerLocation(userId, lastLat, lastLng) {
    if (lastLat === undefined || lastLng === undefined) {
      throw new Error('Both lastLat and lastLng are required for location updates.');
    }

    const volunteer = await prisma.volunteerProfile.findUnique({
      where: { userId },
    });

    if (!volunteer) {
      throw new Error(`Volunteer profile not found for user ID '${userId}'.`);
    }

    return await prisma.volunteerProfile.update({
      where: { userId },
      data: {
        lastLat: parseFloat(lastLat),
        lastLng: parseFloat(lastLng),
      },
    });
  }

  /**
   * 5. Toggle Volunteer Availability Status
   */
  static async toggleVolunteerAvailability(userId, isAvailable) {
    if (typeof isAvailable !== 'boolean') {
      throw new Error('isAvailable must be a boolean (true or false).');
    }

    const volunteer = await prisma.volunteerProfile.findUnique({
      where: { userId },
    });

    if (!volunteer) {
      throw new Error(`Volunteer profile not found for user ID '${userId}'.`);
    }

    return await prisma.volunteerProfile.update({
      where: { userId },
      data: { isAvailable },
    });
  }
}

module.exports = UserService;