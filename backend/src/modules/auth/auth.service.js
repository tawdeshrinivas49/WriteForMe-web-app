// backend/src/modules/auth/auth.service.js
const prisma = require('../../config/database');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_writeforme_key';

function hashDigiLockerId(digilockerId) {
  const salt = process.env.DIGILOCKER_SALT || 'writeforme_salt_key';
  return crypto.createHash('sha256').update(digilockerId + salt).digest('hex');
}

exports.processDigiLockerLogin = async (digiLockerPayload, role, extraProfileData = {}) => {
  // ✅ Normalize role to Prisma enum values
  let normalizedRole = role.toUpperCase();
  if (normalizedRole === 'CANDIDATE') normalizedRole = 'STUDENT';
  // If it's already STUDENT or VOLUNTEER, keep it.
  // Also ensure it's one of the allowed values; fallback to STUDENT if invalid.
  if (!['STUDENT', 'VOLUNTEER'].includes(normalizedRole)) {
    normalizedRole = 'STUDENT';
  }

  const {
    digilockerId,
    phone,
    name,
    gender,
    hasFreshAcademicRecords
  } = digiLockerPayload;

  const digilockerIdHash = hashDigiLockerId(digilockerId);

  // 1. Fetch existing user by hashed DigiLocker ID or phone
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { digilockerIdHash },
        { phone }
      ]
    },
    include: {
      candidateProfile: true,
      volunteerProfile: true
    }
  });

  // 2. If user doesn't exist, create user + role-specific profile
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        name,
        gender: gender || 'OTHER',
        role: normalizedRole,   // now always STUDENT or VOLUNTEER
        digilockerIdHash
      },
      include: {
        candidateProfile: true,
        volunteerProfile: true
      }
    });

    // Create role-specific profile
    if (normalizedRole === 'STUDENT') {
      const candidateProfile = await prisma.candidateProfile.create({
        data: {
          userId: user.id,
          udidNumber: extraProfileData.udidNumber || null,
          udidVerified: extraProfileData.udidNumber ? 'VERIFIED_DIGILOCKER' : 'UNVERIFIED',
          disabilityType: extraProfileData.disabilityType || 'VISUAL_IMPAIRMENT',
          homeLat: extraProfileData.homeLat ? parseFloat(extraProfileData.homeLat) : 0.0,
          homeLng: extraProfileData.homeLng ? parseFloat(extraProfileData.homeLng) : 0.0
        }
      });
      user.candidateProfile = candidateProfile;
    } else if (normalizedRole === 'VOLUNTEER') {
      const verificationStatus = hasFreshAcademicRecords
        ? 'VERIFIED_DIGILOCKER'
        : 'PENDING_MANUAL_AUDIT';

      const volunteerProfile = await prisma.volunteerProfile.create({
        data: {
          userId: user.id,
          eduVerified: verificationStatus,
          highestEducation: extraProfileData.highestEducation || 'BACHELORS',
          stream: extraProfileData.stream || null,
          hasVehicle: extraProfileData.hasVehicle || false,
          vehicleType: extraProfileData.vehicleType || 'NONE',
          lastLat: extraProfileData.lastLat ? parseFloat(extraProfileData.lastLat) : 0.0,
          lastLng: extraProfileData.lastLng ? parseFloat(extraProfileData.lastLng) : 0.0
        }
      });
      user.volunteerProfile = volunteerProfile;
    }
  } else if (!user.digilockerIdHash) {
    // Update existing legacy user record with hashed DigiLocker ID
    user = await prisma.user.update({
      where: { id: user.id },
      data: { digilockerIdHash },
      include: { candidateProfile: true, volunteerProfile: true }
    });
  }

  // 3. Generate JWT Token
  const candidateProfileId = user.candidateProfile?.id || null;
  const volunteerProfileId = user.volunteerProfile?.id || null;

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      candidateProfileId,
      volunteerProfileId
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
};