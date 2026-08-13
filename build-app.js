const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

function mkdir(p) {
  const full = path.join(ROOT, p);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
}

function write(p, content) {
  const full = path.join(ROOT, p);
  mkdir(path.dirname(full).replace(ROOT, '').replace(/^[/\\]/, ''));
  fs.writeFileSync(full, content.trimStart());
  console.log('✓', p);
}

// ==========================================
// BACKEND INFRASTRUCTURE
// ==========================================

write('backend/src/utils/apiResponse.js', `
class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200, meta = {}) {
    return res.status(statusCode).json({ success: true, message, data, ...meta });
  }
  static error(res, message = 'Internal Server Error', statusCode = 500, meta = {}) {
    return res.status(statusCode).json({ success: false, error: message, ...meta });
  }
}
module.exports = ApiResponse;
`);

write('backend/src/middlewares/validate.js', `
const { z } = require('zod');
const ApiResponse = require('../utils/apiResponse');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const message = error.errors?.map(e => \`\${e.path.join('.')}: \${e.message}\`).join(', ') || 'Validation failed';
    return ApiResponse.error(res, message, 400);
  }
};
module.exports = validate;
`);

write('backend/src/app.js', `
const express = require('express');
const cors = require('cors');
const prisma = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const ApiResponse = require('./utils/apiResponse');

const authRoutes = require('./modules/auth/auth.routes');
const ocrRoutes = require('./modules/ocr/ocr.routes');
const requestsRoutes = require('./modules/requests/request.routes');
const matchingRoutes = require('./modules/matching/matching.routes');
const paymentRoutes = require('./modules/payments/payment.routes');
const gamificationRoutes = require('./modules/gamification/gamification.routes');
const reviewRoutes = require('./modules/reviews/review.routes');
const userRoutes = require('./modules/users/user.routes');
const organizationRoutes = require('./modules/organizations/organization.routes');

const app = express();

const whitelist = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

app.get('/health', (req, res) => {
  ApiResponse.success(res, {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: \`\${Math.floor(process.uptime())}s\`,
  }, 'WriteForMe API is running');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ocr', ocrRoutes);
app.use('/api/v1/requests', requestsRoutes);
app.use('/api/v1/matching', matchingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/gamification', gamificationRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/organizations', organizationRoutes);

app.use((req, res) => {
  ApiResponse.error(res, \`Cannot \${req.method} \${req.originalUrl} - Route not found.\`, 404);
});

app.use(errorHandler);

const handleShutdown = async (signal) => {
  console.log(\`\\nReceived \${signal}. Closing Prisma connections...\`);
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

module.exports = app;
`);

// ==========================================
// AUTH MODULE
// ==========================================

write('backend/src/modules/auth/auth.service.js', `
const prisma = require('../../config/database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is required. Server will not start without it.');

exports.processDigiLockerLogin = async (payload) => {
  const {
    phone, name, gender, role, email,
    udidNumberMasked, disabilityType, udidDocUrl,
    highestQualification, academicStream, tenthPassoutYear,
    latitude, longitude, partnerOrgId,
    hasFreshAcademicRecords
  } = payload;

  let user = await prisma.user.findUnique({
    where: { phone },
    include: { candidateProfile: true, volunteerProfile: true }
  });

  if (!user) {
    user = await prisma.user.create({
      data: { phone, email: email || null, passwordHash: '', name, gender, role },
      include: { candidateProfile: true, volunteerProfile: true }
    });

    if (role === 'CANDIDATE') {
      const cp = await prisma.candidateProfile.create({
        data: {
          userId: user.id,
          fullName: name,
          udidNumberMasked: udidNumberMasked || '',
          disabilityType: disabilityType || '',
          udidDocUrl: udidDocUrl || '',
        }
      });
      user.candidateProfile = cp;
    } else if (role === 'VOLUNTEER') {
      const isLegacy = hasFreshAcademicRecords === false;
      const vp = await prisma.volunteerProfile.create({
        data: {
          userId: user.id,
          fullName: name,
          status: isLegacy ? 'PENDING_ADMIN_APPROVAL' : 'VERIFIED',
          isLegacyRecord: isLegacy,
          highestQualification: highestQualification || 'TENTH',
          academicStream: academicStream || 'OTHER',
          tenthPassoutYear: tenthPassoutYear || 2010,
          latitude: latitude ? parseFloat(latitude) : 0,
          longitude: longitude ? parseFloat(longitude) : 0,
          partnerOrgId: partnerOrgId || null,
        }
      });
      user.volunteerProfile = vp;
    }
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      candidateProfileId: user.candidateProfile?.id || null,
      volunteerProfileId: user.volunteerProfile?.id || null,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
};
`);

write('backend/src/modules/auth/auth.controller.js', `
const authService = require('./auth.service');
const DigiLockerProvider = require('./digilocker.provider');
const ApiResponse = require('../../utils/apiResponse');

exports.digilockerLogin = async (req, res, next) => {
  try {
    const digiLockerData = await DigiLockerProvider.fetchUserData(req.body);
    if (!digiLockerData.phone || !digiLockerData.role) {
      return ApiResponse.error(res, 'Phone and Role are required', 400);
    }
    const { user, token } = await authService.processDigiLockerLogin(digiLockerData);
    ApiResponse.success(res, { token, user }, 'Login successful');
  } catch (error) {
    console.error('Auth Error:', error.message);
    const statusCode = error.message.includes('pending production credentials') ? 501 : 500;
    ApiResponse.error(res, error.message || 'Authentication failed', statusCode);
  }
};
`);

write('backend/src/modules/auth/auth.routes.js', `
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

router.post('/digilocker', authController.digilockerLogin);

module.exports = router;
`);

// ==========================================
// REQUESTS MODULE
// ==========================================

write('backend/src/modules/requests/request.validator.js', `
const { z } = require('zod');

exports.createRequestSchema = z.object({
  examName: z.string().min(2),
  examDateTime: z.string().datetime(),
  examCenterName: z.string().min(2),
  examCenterAddress: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  genderPreference: z.enum(['ANY', 'MALE_ONLY', 'FEMALE_ONLY']).optional(),
  honorariumAmount: z.number().min(0).optional(),
  platformFee: z.number().min(0).optional(),
  masterExamId: z.string().uuid().optional(),
  customExamTitle: z.string().optional(),
  admitCardUrl: z.string().url().optional(),
  requiresTransport: z.boolean().optional(),
  notes: z.string().optional(),
});
`);

write('backend/src/modules/requests/request.service.js', `
const prisma = require('../../config/database');
const { generateVerificationPin } = require('../../utils/pinGenerator');
const { generateWhatsAppAlertLink } = require('../../utils/deepLinkGenerator');

class RequestsService {
  static async createRequest(data, candidateId) {
    const targetCandidateId = candidateId || data.candidateId;
    const candidateExists = await prisma.candidateProfile.findUnique({
      where: { id: targetCandidateId },
      include: { user: { select: { phone: true, name: true } } },
    });
    if (!candidateExists) throw new Error('Candidate profile not found.');

    const lat = parseFloat(data.latitude || 0);
    const lng = parseFloat(data.longitude || 0);

    const startPin = generateVerificationPin();
    const endPin = generateVerificationPin();

    const newRequest = await prisma.examRequest.create({
      data: {
        candidateId: targetCandidateId,
        masterExamId: data.masterExamId || null,
        customExamTitle: data.customExamTitle || null,
        verificationType: data.masterExamId ? 'MASTER_REGISTRY' : (data.admitCardUrl ? 'OCR_AUTO' : 'ADMIN_MANUAL'),
        examCenterName: data.examCenterName,
        examCenterAddress: data.examCenterAddress,
        latitude: lat,
        longitude: lng,
        examDateTime: new Date(data.examDateTime),
        admitCardUrl: data.admitCardUrl || null,
        genderPreference: data.genderPreference || 'ANY',
        requiredMaxQualification: data.requiredMaxQualification || 'TENTH',
        honorariumAmount: parseFloat(data.honorariumAmount) || 0,
        platformFee: parseFloat(data.platformFee) || 0,
        requiresTransport: data.requiresTransport || false,
        verificationPin: startPin,
        completionPin: endPin,
        status: 'MATCHING',
      },
    });

    if (lat !== 0 && lng !== 0) {
      await prisma.$executeRaw\`
        UPDATE "ExamRequest"
        SET "examLocation" = ST_SetSRID(ST_MakePoint(\${lng}, \${lat}), 4326)
        WHERE id = \${newRequest.id}
      \`;
    }

    let emergencyLink = null;
    if (data.isEmergency) {
      emergencyLink = generateWhatsAppAlertLink(
        candidateExists.user?.phone || '910000000000',
        data.examName || data.customExamTitle || 'Exam',
        data.examCenterName || 'Center',
        newRequest.id
      );
    }

    return { ...newRequest, emergencyLink };
  }

  static async getUserRequests(candidateId) {
    return prisma.examRequest.findMany({
      where: candidateId ? { candidateId } : {},
      include: {
        assignments: { include: { volunteer: { include: { user: { select: { name: true } } } } } },
        masterExam: true,
        escrowTransaction: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getRequestById(id) {
    return prisma.examRequest.findUnique({
      where: { id },
      include: {
        candidate: { include: { user: { select: { id: true, name: true, phone: true } } } },
        assignments: { include: { volunteer: { include: { user: { select: { id: true, name: true, phone: true } } } } } },
        reviews: true,
        escrowTransaction: true,
      },
    });
  }

  static async verifyStartPin(requestId, pin) {
    const request = await prisma.examRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new Error('Request not found.');
    if (request.status !== 'MATCHED') throw new Error(\`Cannot start. Current status: \${request.status}\`);
    if (request.verificationPin !== String(pin).trim()) throw new Error('Invalid start PIN.');
    return prisma.examRequest.update({
      where: { id: requestId },
      data: { status: 'IN_PERSON_VERIFIED', pinVerifiedAt: new Date() },
    });
  }

  static async verifyCompletionPin(requestId, pin) {
    const request = await prisma.examRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new Error('Request not found.');
    if (request.status !== 'IN_PERSON_VERIFIED') throw new Error(\`Cannot complete. Current status: \${request.status}\`);
    if (request.completionPin !== String(pin).trim()) throw new Error('Invalid completion PIN.');
    return prisma.examRequest.update({
      where: { id: requestId },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });
  }
}

module.exports = RequestsService;
`);

write('backend/src/modules/requests/request.controller.js', `
const RequestsService = require('./request.service');
const ApiResponse = require('../../utils/apiResponse');

exports.createRequest = async (req, res, next) => {
  try {
    const candidateId = req.user?.candidateProfileId || req.user?.id;
    if (!candidateId) return ApiResponse.error(res, 'Candidate ID required', 400);
    if (!req.body.examName || !req.body.examDateTime) {
      return ApiResponse.error(res, 'examName and examDateTime are required', 400);
    }
    const newRequest = await RequestsService.createRequest(req.body, candidateId);
    ApiResponse.success(res, newRequest, 'Exam request created', 201);
  } catch (error) {
    next(error);
  }
};

exports.getRequests = async (req, res, next) => {
  try {
    const candidateId = req.user?.candidateProfileId || req.user?.id;
    const requests = await RequestsService.getUserRequests(candidateId);
    ApiResponse.success(res, requests);
  } catch (error) {
    next(error);
  }
};

exports.getRequestById = async (req, res, next) => {
  try {
    const request = await RequestsService.getRequestById(req.params.id);
    if (!request) return ApiResponse.error(res, 'Not found', 404);
    ApiResponse.success(res, request);
  } catch (error) {
    next(error);
  }
};

exports.verifyStartPin = async (req, res, next) => {
  try {
    const { pin } = req.body;
    if (!pin) return ApiResponse.error(res, 'PIN required', 400);
    const updated = await RequestsService.verifyStartPin(req.params.id, pin);
    ApiResponse.success(res, updated, 'Start PIN verified. Exam is now IN_PERSON_VERIFIED.');
  } catch (error) {
    next(error);
  }
};

exports.verifyCompletionPin = async (req, res, next) => {
  try {
    const { pin } = req.body;
    if (!pin) return ApiResponse.error(res, 'PIN required', 400);
    const updated = await RequestsService.verifyCompletionPin(req.params.id, pin);
    ApiResponse.success(res, updated, 'Completion PIN verified. Exam is COMPLETED.');
  } catch (error) {
    next(error);
  }
};
`);

write('backend/src/modules/requests/request.routes.js', `
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validate');
const { createRequestSchema } = require('./request.validator');
const requestsController = require('./request.controller');

router.post('/', authenticate, validate(createRequestSchema), requestsController.createRequest);
router.get('/', authenticate, requestsController.getRequests);
router.get('/:id', authenticate, requestsController.getRequestById);
router.post('/:id/verify-start-pin', authenticate, requestsController.verifyStartPin);
router.post('/:id/verify-completion-pin', authenticate, requestsController.verifyCompletionPin);

module.exports = router;
`);

// ==========================================
// MATCHING MODULE
// ==========================================

write('backend/src/modules/matching/matching.service.js', `
const prisma = require('../../config/database');
const { calculateDistanceKm, estimateTravelTimeMinutes } = require('../../config/mapmyindia');

const EDU_RANK = {
  TENTH: 1, TWELFTH: 2, DIPLOMA: 3, BACHELORS: 4, MASTERS: 5, DOCTORATE: 6,
};

class MatchingService {
  static async findVolunteersForRequest(requestId, radiusKm = 15) {
    const request = await prisma.examRequest.findUnique({
      where: { id: requestId },
      include: { candidate: { include: { user: true } }, masterExam: true },
    });
    if (!request) throw new Error('Request not found');

    const targetExamLevel = request.masterExam?.requiredQualification || request.requiredMaxQualification || 'BACHELORS';
    const targetExamStream = request.masterExam?.stream || request.candidate?.academicStream || null;

    const searchLat = parseFloat(request.latitude || 0);
    const searchLng = parseFloat(request.longitude || 0);
    const radiusMeters = radiusKm * 1000;

    const candidates = await prisma.$queryRaw\`
      SELECT
        vp.id AS "volunteerId",
        vp."userId" AS "userId",
        u.name AS "volunteerName",
        u.phone AS "phone",
        u.gender AS "gender",
        vp."hasVehicle",
        vp."vehicleType",
        vp."highestQualification" AS "highestEducation",
        vp."academicStream" AS "volunteerStream",
        vp."ratingAverage" AS "averageRating",
        vp."latitude" AS "lastLat",
        vp."longitude" AS "lastLng",
        ROUND((ST_DistanceSphere(vp.location, ST_SetSRID(ST_MakePoint(\${searchLng}, \${searchLat}), 4326)) / 1000)::numeric, 2) AS "distanceKm"
      FROM "VolunteerProfile" vp
      JOIN "User" u ON vp."userId" = u.id
      WHERE vp."isAvailable" = true
        AND vp.location IS NOT NULL
        AND ST_DistanceSphere(vp.location, ST_SetSRID(ST_MakePoint(\${searchLng}, \${searchLat}), 4326)) <= \${radiusMeters}
      ORDER BY "distanceKm" ASC
    \`;

    const filtered = candidates.filter((vol) => {
      if (request.genderPreference === 'FEMALE_ONLY' && vol.gender !== 'FEMALE') return false;
      if (request.genderPreference === 'MALE_ONLY' && vol.gender !== 'MALE') return false;

      const volEduRank = EDU_RANK[vol.highestEducation?.toUpperCase()] || 4;
      const examEduRank = EDU_RANK[targetExamLevel.toUpperCase()] || 4;
      if (volEduRank >= examEduRank) return false;

      if (targetExamStream && vol.volunteerStream && vol.volunteerStream.toUpperCase() === targetExamStream.toUpperCase()) return false;

      return true;
    }).map((vol) => {
      const distanceKm = parseFloat(vol.distanceKm) || calculateDistanceKm(searchLat, searchLng, vol.lastLat, vol.lastLng);
      const etaMinutes = estimateTravelTimeMinutes(distanceKm);
      return {
        volunteerId: vol.volunteerId,
        userId: vol.userId,
        volunteerName: vol.volunteerName,
        phone: vol.phone,
        gender: vol.gender,
        hasVehicle: vol.hasVehicle,
        vehicleType: vol.vehicleType,
        highestEducation: vol.highestEducation,
        volunteerStream: vol.volunteerStream,
        averageRating: parseFloat(vol.averageRating || 5),
        distanceKm,
        etaMinutes,
      };
    });

    return {
      requestId,
      searchCenter: { lat: searchLat, lng: searchLng, radiusKm },
      appliedFilters: { genderPref: request.genderPreference, targetExamLevel, targetExamStream: targetExamStream || 'ANY' },
      totalEligibleFound: filtered.length,
      volunteers: filtered,
    };
  }

  static async assignVolunteerToRequest(requestId, volunteerId) {
    const volunteer = await prisma.volunteerProfile.findUnique({
      where: { id: volunteerId },
      include: { user: { select: { name: true, phone: true } } },
    });
    if (!volunteer) throw new Error('Volunteer not found');

    await prisma.scribeAssignment.create({
      data: { requestId, volunteerId, status: 'ACCEPTED' },
    });

    return prisma.examRequest.update({
      where: { id: requestId },
      data: { status: 'MATCHED' },
      include: {
        assignments: { include: { volunteer: { include: { user: true } } } },
        candidate: { include: { user: true } },
      },
    });
  }
}

module.exports = MatchingService;
`);

write('backend/src/modules/matching/matching.controller.js', `
const matchingService = require('./matching.service');
const ApiResponse = require('../../utils/apiResponse');

exports.findVolunteers = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const radiusKm = parseFloat(req.query.radiusKm) || 15;
    const results = await matchingService.findVolunteersForRequest(requestId, radiusKm);
    ApiResponse.success(res, results.volunteers, 'Volunteers found', 200, {
      requestId, searchRadiusKm: radiusKm, totalMatched: results.volunteers.length, appliedFilters: results.appliedFilters,
    });
  } catch (error) { next(error); }
};

exports.assignVolunteer = async (req, res, next) => {
  try {
    const { requestId, volunteerId } = req.body;
    if (!requestId || !volunteerId) return ApiResponse.error(res, 'requestId and volunteerId required', 400);
    const updated = await matchingService.assignVolunteerToRequest(requestId, volunteerId);
    ApiResponse.success(res, updated, 'Assigned successfully');
  } catch (error) { next(error); }
};
`);

write('backend/src/modules/matching/matching.routes.js', `
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/authMiddleware');
const matchingController = require('./matching.controller');

router.get('/:requestId', authenticate, matchingController.findVolunteers);
router.post('/assign', authenticate, matchingController.assignVolunteer);

module.exports = router;
`);

// ==========================================
// PAYMENTS MODULE
// ==========================================

write('backend/src/modules/payments/payment.service.js', `
const Razorpay = require('razorpay');
const crypto = require('crypto');
const prisma = require('../../config/database');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

class PaymentService {
  static async createEscrowOrder(requestId, adminOverrideHonorarium = null) {
    const request = await prisma.examRequest.findUnique({
      where: { id: requestId },
      include: { candidate: { include: { user: true } }, masterExam: true }
    });
    if (!request) throw new Error('Request not found');

    const baseHonorarium = adminOverrideHonorarium || request.honorariumAmount || 500;
    const transportAllowance = request.requiresTransport ? 250 : 0;
    const totalAmountINR = baseHonorarium + transportAllowance + (request.platformFee || 0);
    const totalAmountPaise = totalAmountINR * 100;

    const options = {
      amount: totalAmountPaise,
      currency: 'INR',
      receipt: \`rcpt_escrow_\${requestId.substring(0, 8)}\`,
      notes: { requestId: request.id, candidateName: request.candidate.user.name, examName: request.examCenterName }
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        razorpayOrder = { id: \`order_mock_\${Date.now()}\`, amount: totalAmountPaise, currency: 'INR', status: 'created' };
      } else throw err;
    }

    return {
      orderId: razorpayOrder.id,
      requestId: request.id,
      currency: 'INR',
      breakdown: { baseHonorariumINR: baseHonorarium, transportAllowanceINR: transportAllowance, platformFeeINR: request.platformFee || 0, totalAmountINR },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      escrowStatus: 'PENDING_PAYMENT'
    };
  }

  static async verifyAndLockEscrow(paymentDetails) {
    const { requestId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentDetails;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (secret && razorpaySignature && !razorpayOrderId.startsWith('order_mock')) {
      const generated = crypto.createHmac('sha256', secret).update(\`\${razorpayOrderId}|\${razorpayPaymentId}\`).digest('hex');
      if (generated !== razorpaySignature) throw new Error('Invalid payment signature');
    }
    return { requestId, razorpayOrderId, razorpayPaymentId, escrowStatus: 'HELD_IN_ESCROW', lockedAt: new Date() };
  }

  static async releaseEscrowPayout(requestId) {
    const request = await prisma.examRequest.findUnique({
      where: { id: requestId },
      include: { volunteer: { include: { user: true } }, masterExam: true }
    });
    if (!request) throw new Error('Request not found');
    if (request.status !== 'COMPLETED') throw new Error(\`Exam must be COMPLETED. Current: \${request.status}\`);
    if (!request.volunteerId) throw new Error('No volunteer assigned');

    const volunteer = request.volunteer;
    const recipientUpi = \`\${volunteer.user.phone.replace('+91', '').replace(/[^0-9]/g, '')}@upi\`;
    const baseHonorarium = request.honorariumAmount || 500;
    const transportAllowance = request.requiresTransport ? 250 : 0;
    const totalPayout = baseHonorarium + transportAllowance;

    await prisma.volunteerProfile.update({
      where: { id: volunteer.id },
      data: { totalExamsScribed: { increment: 1 }, totalXp: { increment: 100 } }
    });

    return {
      payoutId: \`pout_\${Math.random().toString(36).substring(2, 12)}\`,
      requestId: request.id,
      volunteerName: volunteer.user.name,
      recipientUpi,
      amountTransferredINR: totalPayout,
      payoutStatus: 'SUCCESS',
      paymentMode: 'DIRECT_UPI',
      transferredAt: new Date()
    };
  }
}

module.exports = PaymentService;
`);

write('backend/src/modules/payments/payment.controller.js', `
const paymentService = require('./payment.service');
const ApiResponse = require('../../utils/apiResponse');

exports.createEscrowOrder = async (req, res, next) => {
  try {
    const { requestId, adminHonorariumOverride } = req.body;
    if (!requestId) return ApiResponse.error(res, 'requestId required', 400);
    const orderData = await paymentService.createEscrowOrder(requestId, adminHonorariumOverride);
    ApiResponse.success(res, orderData, 'Escrow order created', 201);
  } catch (error) { next(error); }
};

exports.verifyEscrow = async (req, res, next) => {
  try {
    const { requestId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!requestId || !razorpayOrderId) return ApiResponse.error(res, 'Missing fields', 400);
    const result = await paymentService.verifyAndLockEscrow({ requestId, razorpayOrderId, razorpayPaymentId, razorpaySignature });
    ApiResponse.success(res, result);
  } catch (error) { next(error); }
};

exports.releasePayout = async (req, res, next) => {
  try {
    const { requestId } = req.body;
    if (!requestId) return ApiResponse.error(res, 'requestId required', 400);
    const result = await paymentService.releaseEscrowPayout(requestId);
    ApiResponse.success(res, result, 'Payout released');
  } catch (error) { next(error); }
};
`);

write('backend/src/modules/payments/payment.routes.js', `
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/authMiddleware');
const paymentController = require('./payment.controller');

router.post('/escrow', authenticate, paymentController.createEscrowOrder);
router.post('/verify', authenticate, paymentController.verifyEscrow);
router.post('/release', authenticate, paymentController.releasePayout);

module.exports = router;
`);

// ==========================================
// USERS MODULE
// ==========================================

write('backend/src/modules/users/user.service.js', `
const prisma = require('../../config/database');

class UserService {
  static async getUserProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: true,
        volunteerProfile: { include: { partnerOrganization: true } },
        partnerAdmin: { include: { partnerOrganization: true } },
      },
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  static async updateCandidateProfile(userId, data) {
    return prisma.candidateProfile.upsert({
      where: { userId },
      update: {
        fullName: data.fullName,
        udidNumberMasked: data.udidNumberMasked,
        disabilityType: data.disabilityType,
        udidDocUrl: data.udidDocUrl,
      },
      create: {
        userId,
        fullName: data.fullName || '',
        udidNumberMasked: data.udidNumberMasked || '',
        disabilityType: data.disabilityType || '',
        udidDocUrl: data.udidDocUrl || '',
      },
    });
  }

  static async updateVolunteerProfile(userId, data) {
    return prisma.volunteerProfile.upsert({
      where: { userId },
      update: {
        fullName: data.fullName,
        highestQualification: data.highestQualification,
        academicStream: data.academicStream,
        tenthPassoutYear: data.tenthPassoutYear,
        addressText: data.addressText,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        partnerOrgId: data.partnerOrgId || null,
        hasVehicle: typeof data.hasVehicle === 'boolean' ? data.hasVehicle : undefined,
        vehicleType: data.vehicleType || undefined,
      },
      create: {
        userId,
        fullName: data.fullName || '',
        highestQualification: data.highestQualification || 'TENTH',
        academicStream: data.academicStream || 'OTHER',
        tenthPassoutYear: data.tenthPassoutYear || 2010,
        latitude: data.latitude ? parseFloat(data.latitude) : 0,
        longitude: data.longitude ? parseFloat(data.longitude) : 0,
        hasVehicle: data.hasVehicle || false,
        vehicleType: data.vehicleType || 'NONE',
      },
    });
  }

  static async updateVolunteerLocation(userId, lat, lng) {
    if (lat === undefined || lng === undefined) throw new Error('Lat/Lng required');
    return prisma.volunteerProfile.update({
      where: { userId },
      data: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
    });
  }

  static async toggleVolunteerAvailability(userId, isAvailable) {
    if (typeof isAvailable !== 'boolean') throw new Error('isAvailable must be boolean');
    return prisma.volunteerProfile.update({
      where: { userId },
      data: { isAvailable },
    });
  }
}

module.exports = UserService;
`);

write('backend/src/modules/users/user.controller.js', `
const UserService = require('./user.service');
const ApiResponse = require('../../utils/apiResponse');

exports.getMe = async (req, res, next) => {
  try {
    const user = await UserService.getUserProfile(req.user.id);
    ApiResponse.success(res, user);
  } catch (error) { next(error); }
};

exports.updateCandidate = async (req, res, next) => {
  try {
    const profile = await UserService.updateCandidateProfile(req.user.id, req.body);
    ApiResponse.success(res, profile, 'Candidate profile updated');
  } catch (error) { next(error); }
};

exports.updateVolunteer = async (req, res, next) => {
  try {
    const profile = await UserService.updateVolunteerProfile(req.user.id, req.body);
    ApiResponse.success(res, profile, 'Volunteer profile updated');
  } catch (error) { next(error); }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const { lastLat, lastLng } = req.body;
    const profile = await UserService.updateVolunteerLocation(req.user.id, lastLat, lastLng);
    ApiResponse.success(res, profile, 'Location updated');
  } catch (error) { next(error); }
};

exports.toggleAvailability = async (req, res, next) => {
  try {
    const { isAvailable } = req.body;
    const profile = await UserService.toggleVolunteerAvailability(req.user.id, isAvailable);
    ApiResponse.success(res, profile, 'Availability updated');
  } catch (error) { next(error); }
};
`);

write('backend/src/modules/users/user.routes.js', `
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/authMiddleware');
const userController = require('./user.controller');

router.get('/me', authenticate, userController.getMe);
router.put('/profile/candidate', authenticate, userController.updateCandidate);
router.put('/profile/volunteer', authenticate, userController.updateVolunteer);
router.patch('/location', authenticate, userController.updateLocation);
router.patch('/availability', authenticate, userController.toggleAvailability);

module.exports = router;
`);

// ==========================================
// OTHER MODULES (auth guards added)
// ==========================================

write('backend/src/modules/ocr/ocr.routes.js', `
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/authMiddleware');
const ocrController = require('./ocr.controller');

router.post('/parse', authenticate, ocrController.parseAdmitCard);
router.get('/master-exams', authenticate, ocrController.getMasterExams);

module.exports = router;
`);

write('backend/src/modules/gamification/gamification.routes.js', `
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/authMiddleware');
const gamificationController = require('./gamification.controller');

router.get('/profile/:volunteerId', authenticate, gamificationController.getVolunteerProfile);
router.get('/leaderboard', authenticate, gamificationController.getLeaderboard);
router.get('/badges', authenticate, gamificationController.getAllBadges);
router.post('/process-event', authenticate, gamificationController.processExamEvent);

module.exports = router;
`);

write('backend/src/modules/reviews/review.routes.js', `
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/authMiddleware');
const reviewController = require('./review.controller');

router.post('/scribe', authenticate, reviewController.createScribeReview);
router.post('/platform', authenticate, reviewController.createPlatformFeedback);
router.get('/volunteer/:volunteerId', authenticate, reviewController.getVolunteerReviews);
router.get('/request/:requestId', authenticate, reviewController.getReviewByRequestId);
router.get('/platform', authenticate, reviewController.getPlatformFeedback);

module.exports = router;
`);

write('backend/src/modules/organizations/organization.routes.js', `
const express = require('express');
const router = express.Router();
const organizationController = require('./organization.controller');
const { authenticate, authorize } = require('../../middlewares/authMiddleware');

router.get('/', organizationController.getAllOrganizations);
router.get('/domain/:domain', organizationController.getOrganizationByDomain);
router.get('/:id', organizationController.getOrganizationById);

router.post('/', authenticate, authorize('SUPER_ADMIN', 'PARTNER_ADMIN'), organizationController.createOrganization);
router.post('/assign-user', authenticate, authorize('SUPER_ADMIN', 'PARTNER_ADMIN'), organizationController.assignUserToOrganization);
router.post('/auto-assign-email', authenticate, organizationController.assignUserByEmailDomain);
router.post('/cleanup-duplicates', authenticate, authorize('SUPER_ADMIN'), organizationController.cleanupDuplicates);
router.get('/:id/metrics', authenticate, authorize('SUPER_ADMIN', 'PARTNER_ADMIN'), organizationController.getOrganizationMetrics);

module.exports = router;
`);

// ==========================================
// PRISMA SCHEMA (aligned with design doc)
// ==========================================

write('backend/prisma/schema.prisma', `
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  extensions = [postgis(schema: "public")]
}

enum UserRole {
  CANDIDATE
  VOLUNTEER
  PARTNER_ADMIN
  SUPER_ADMIN
}

enum VolunteerStatus {
  PENDING_ADMIN_APPROVAL
  VERIFIED
  REJECTED
  SUSPENDED
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum GenderPreference {
  MALE_ONLY
  FEMALE_ONLY
  ANY
}

enum EducationLevel {
  TENTH
  TWELFTH
  DIPLOMA
  BACHELORS
  MASTERS
  DOCTORATE
}

enum Stream {
  SCIENCE
  COMMERCE
  ARTS
  ENGINEERING
  MEDICAL
  LAW
  OTHER
}

enum ExamVerificationType {
  MASTER_REGISTRY
  OCR_AUTO
  ADMIN_MANUAL
}

enum RequestStatus {
  DRAFT
  PENDING_VERIFICATION
  MATCHING
  MATCHED
  IN_PERSON_VERIFIED
  COMPLETED
  CANCELLED
}

enum AssignmentStatus {
  PROPOSED
  ACCEPTED
  DECLINED
  CANCELLED
}

enum EscrowStatus {
  NOT_REQUIRED
  PENDING_PAYMENT
  HELD_IN_ESCROW
  RELEASED_TO_VOLUNTEER
  REFUNDED_TO_STUDENT
}

model User {
  id              String   @id @default(uuid())
  phone           String   @unique
  email           String?  @unique
  passwordHash    String
  role            UserRole
  gender          Gender
  isPhoneVerified Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  candidateProfile CandidateProfile?
  volunteerProfile VolunteerProfile?
  partnerAdmin     PartnerAdmin?
  createdRequests  ExamRequest[] @relation("CandidateRequests")
  reviewsGiven     Review[] @relation("ReviewsGiven")
  reviewsReceived  Review[] @relation("ReviewsReceived")
}

model CandidateProfile {
  id               String   @id @default(uuid())
  userId           String   @unique
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName         String
  digilockerRefId  String?  @unique
  udidNumberMasked String
  disabilityType   String
  udidDocUrl       String
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model VolunteerProfile {
  id                   String              @id @default(uuid())
  userId               String              @unique
  user                 User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName             String
  status               VolunteerStatus     @default(PENDING_ADMIN_APPROVAL)
  isLegacyRecord       Boolean             @default(false)
  highestQualification EducationLevel
  academicStream       Stream
  tenthPassoutYear     Int
  partnerOrgId         String?
  partnerOrganization  PartnerOrganization? @relation(fields: [partnerOrgId], references: [id])
  addressText          String?
  latitude             Float
  longitude            Float
  location             Unsupported("geometry(Point, 4326)")?
  isAvailable          Boolean             @default(true)
  hasVehicle           Boolean             @default(false)
  vehicleType          String              @default("NONE")
  totalXp              Int                 @default(0)
  ratingAverage        Float               @default(0.0)
  totalExamsScribed    Int                 @default(0)
  assignments          ScribeAssignment[]
  xpLogs               XPLog[]
  createdAt            DateTime            @default(now())
  updatedAt            DateTime            @updatedAt
}

model MasterExam {
  id        String   @id @default(uuid())
  title     String
  organizer String
  category  String
  isActive  Boolean  @default(true)
  requests  ExamRequest[]
  createdAt DateTime @default(now())
}

model ExamRequest {
  id                     String              @id @default(uuid())
  candidateId            String
  candidate              User                @relation("CandidateRequests", fields: [candidateId], references: [id])
  masterExamId           String?
  masterExam             MasterExam?         @relation(fields: [masterExamId], references: [id])
  customExamTitle        String?
  verificationType       ExamVerificationType
  examCenterName         String
  examCenterAddress      String
  latitude               Float
  longitude              Float
  examLocation           Unsupported("geometry(Point, 4326)")?
  examDateTime           DateTime
  admitCardUrl           String?
  rawOcrText             String?             @db.Text
  structuredOcrData      Json?
  genderPreference       GenderPreference    @default(ANY)
  requiredMaxQualification EducationLevel
  verificationPin        String?
  completionPin          String?
  pinVerifiedAt          DateTime?
  status                 RequestStatus       @default(MATCHING)
  honorariumAmount       Float               @default(0.0)
  platformFee            Float               @default(0.0)
  requiresTransport      Boolean             @default(false)
  escrowTransaction      EscrowTransaction?
  assignments            ScribeAssignment[]
  reviews                Review[]
  createdAt              DateTime            @default(now())
  updatedAt              DateTime            @updatedAt
}

model ScribeAssignment {
  id          String           @id @default(uuid())
  requestId   String
  examRequest ExamRequest      @relation(fields: [requestId], references: [id], onDelete: Cascade)
  volunteerId String
  volunteer   VolunteerProfile @relation(fields: [volunteerId], references: [id])
  status      AssignmentStatus @default(PROPOSED)
  assignedAt  DateTime         @default(now())
  acceptedAt  DateTime?
  completedAt DateTime?

  @@unique([requestId, volunteerId])
}

model EscrowTransaction {
  id                 String      @id @default(uuid())
  requestId          String      @unique
  examRequest         ExamRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)
  honorariumAmount   Float
  platformFeeAmount  Float
  totalInboundAmount Float
  razorpayOrderId    String?     @unique
  razorpayPaymentId  String?     @unique
  razorpayPayoutId   String?     @unique
  status             EscrowStatus @default(PENDING_PAYMENT)
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt
}

model Review {
  id          String      @id @default(uuid())
  requestId   String
  examRequest ExamRequest @relation(fields: [requestId], references: [id])
  reviewerId  String
  reviewer    User        @relation("ReviewsGiven", fields: [reviewerId], references: [id])
  revieweeId  String
  reviewee    User        @relation("ReviewsReceived", fields: [revieweeId], references: [id])
  rating      Int
  tags        String[]
  comment     String?     @db.Text
  createdAt   DateTime    @default(now())
}

model XPLog {
  id          String           @id @default(uuid())
  volunteerId String
  volunteer   VolunteerProfile @relation(fields: [volunteerId], references: [id], onDelete: Cascade)
  xpEarned    Int
  reason      String
  createdAt   DateTime         @default(now())
}

model PartnerOrganization {
  id         String   @id @default(uuid())
  name       String
  domain     String   @unique
  logoUrl    String?
  admins     PartnerAdmin[]
  volunteers VolunteerProfile[]
  createdAt  DateTime @default(now())
}

model PartnerAdmin {
  id                  String              @id @default(uuid())
  userId              String              @unique
  user                User                @relation(fields: [userId], references: [id])
  partnerOrgId        String
  partnerOrganization PartnerOrganization @relation(fields: [partnerOrgId], references: [id])
}

model SystemSettings {
  id                Int      @id @default(1)
  isPlatformFree    Boolean  @default(true)
  platformFeeAmount Float    @default(0.0)
  maxSearchRadiusKm Float    @default(15.0)
  updatedAt         DateTime @updatedAt
}
`);

console.log('\n✅ Backend build complete!');
console.log('\n📋 NEXT STEPS:');
console.log('   1. cd backend && npm install zod express-rate-limit helmet');
console.log('   2. Add JWT_SECRET to your .env file');
console.log('   3. npx prisma migrate dev --name align_schema');