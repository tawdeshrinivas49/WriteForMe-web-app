<<<<<<< HEAD
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
=======
// DigiLocker & JWT logic
const prisma = require('../../config/database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_writeforme_key';

exports.processDigiLockerLogin = async (digiLockerPayload) => {
  const { 
    phone, 
    name, 
    gender, 
    role, 
    hasFreshAcademicRecords,
    // Optional profile fields passed during signup/mocking
    udidNumber,
    disabilityType,
    homeLat,
    homeLng,
    highestEducation,
    stream,
    hasVehicle,
    vehicleType,
    lastLat,
    lastLng
  } = digiLockerPayload;

  // 1. Fetch user with linked candidate and volunteer profiles
  let user = await prisma.user.findUnique({ 
    where: { phone },
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
    include: {
      candidateProfile: true,
      volunteerProfile: true
    }
  });

  // 2. If user doesn't exist, create user + role-specific profile
  if (!user) {
    user = await prisma.user.create({
<<<<<<< HEAD
      data: {
        phone,
        name,
        gender: gender || 'OTHER',
        role: normalizedRole,   // now always STUDENT or VOLUNTEER
        digilockerIdHash
      },
=======
      data: { phone, name, gender, role },
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
      include: {
        candidateProfile: true,
        volunteerProfile: true
      }
    });

<<<<<<< HEAD
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
=======
    if (role === 'CANDIDATE' || role === 'STUDENT') {
      const candidateProfile = await prisma.candidateProfile.create({
        data: { 
          userId: user.id,
          udidNumber: udidNumber || null,
          disabilityType: disabilityType || 'VISUAL_IMPAIRMENT',
          homeLat: homeLat ? parseFloat(homeLat) : 0.0,
          homeLng: homeLng ? parseFloat(homeLng) : 0.0
        }
      });
      user.candidateProfile = candidateProfile;
    } 
    else if (role === 'VOLUNTEER') {
      const verificationStatus = hasFreshAcademicRecords 
        ? 'VERIFIED_DIGILOCKER' 
        : 'PENDING_MANUAL_AUDIT';

      const volunteerProfile = await prisma.volunteerProfile.create({
        data: { 
          userId: user.id,
          eduVerified: verificationStatus,
          highestEducation: highestEducation || 'BACHELORS',
          stream: stream || null,
          hasVehicle: hasVehicle || false,
          vehicleType: vehicleType || 'NONE',
          lastLat: lastLat ? parseFloat(lastLat) : 0.0,
          lastLng: lastLng ? parseFloat(lastLng) : 0.0
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
        }
      });
      user.volunteerProfile = volunteerProfile;
    }
<<<<<<< HEAD
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
=======
  }

  // 3. Extract profile IDs for seamless token payload authorization
  const candidateProfileId = user.candidateProfile?.id || null;
  const volunteerProfileId = user.volunteerProfile?.id || null;

  // 4. Generate JWT Token with embedded profile references
  const token = jwt.sign(
    { 
      userId: user.id, 
      role: user.role,
      candidateProfileId,
      volunteerProfileId
    }, 
    JWT_SECRET, 
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
    { expiresIn: '7d' }
  );

  return { user, token };
};