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
    include: {
      candidateProfile: true,
      volunteerProfile: true
    }
  });

  // 2. If user doesn't exist, create user + role-specific profile
  if (!user) {
    user = await prisma.user.create({
      data: { phone, name, gender, role },
      include: {
        candidateProfile: true,
        volunteerProfile: true
      }
    });

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
        }
      });
      user.volunteerProfile = volunteerProfile;
    }
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
    { expiresIn: '7d' }
  );

  return { user, token };
};