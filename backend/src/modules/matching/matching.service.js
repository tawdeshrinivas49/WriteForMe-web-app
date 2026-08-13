const prisma = require('../../config/database');
const { calculateDistanceKm, estimateTravelTimeMinutes } = require('../../config/mapmyindia');

// Map educational qualifications to numerical ranks for eligibility checks
const EDU_RANK = {
  'BELOW_10TH': 1,
  '10TH': 2,
  'SECONDARY': 2,
  '12TH': 3,
  'HIGHER_SECONDARY': 3,
  'DIPLOMA': 3,
  'BACHELORS': 4,
  'UNDERGRADUATE': 4,
  'GRADUATION': 4,
  'MASTERS': 5,
  'POSTGRADUATE': 5,
  'DOCTORATE': 6,
  'PHD': 6,
};

class MatchingService {
  /**
   * 1. Find and rank eligible volunteers near an exam request using PostGIS + MapMyIndia ETA Engine
   */
  static async findVolunteersForRequest(requestId, radiusKm = 10) {
    // 1. Fetch the Exam Request along with candidate details
    const request = await prisma.examRequest.findUnique({
      where: { id: requestId },
      include: {
        candidate: {
          include: { user: true },
        },
        masterExam: true,
      },
    });

    if (!request) {
      throw new Error(`Exam request with ID '${requestId}' not found.`);
    }

    // Determine target exam qualification level & stream
    const targetExamLevel =
      request.masterExam?.requiredQualification || request.examLevel || 'BACHELORS';
    const targetExamStream =
      request.masterExam?.stream || request.stream || request.candidate?.stream || null;

    // 2. Determine Search Anchor Coordinates & Transport Strategy
    let searchLat, searchLng;
    let transportStrategy = '';

    if (request.requiresTransport && request.pickupLat && request.pickupLng) {
      searchLat = parseFloat(request.pickupLat);
      searchLng = parseFloat(request.pickupLng);
      transportStrategy = 'PICKUP_ANCHORED_SEARCH';
    } else {
      searchLat = parseFloat(request.examCenterLat || request.lat || 0.0);
      searchLng = parseFloat(request.examCenterLng || request.lng || 0.0);
      transportStrategy = 'CENTER_ANCHORED_SEARCH';
    }

    const radiusMeters = radiusKm * 1000;

    // 3. Raw PostGIS Query to fetch candidates within geospatial radius
    const candidates = await prisma.$queryRaw`
      SELECT 
        vp.id AS "volunteerId",
        vp."userId" AS "userId",
        u.name AS "volunteerName",
        u.phone AS "phone",
        u.gender AS "gender",
        vp."hasVehicle",
        vp."vehicleType",
        vp."highestEducation",
        vp."stream" AS "volunteerStream",
        vp."maxExamLevelAllowed",
        vp."averageRating",
        vp."lastLat" AS "lastLat",
        vp."lastLng" AS "lastLng",
        ROUND(
          (ST_DistanceSphere(
            vp.location, 
            ST_SetSRID(ST_MakePoint(${searchLng}, ${searchLat}), 4326)
          ) / 1000)::numeric, 2
        ) AS "distanceKm"
      FROM "VolunteerProfile" vp
      JOIN "User" u ON vp."userId" = u.id
      WHERE vp."isAvailable" = true
        AND vp.location IS NOT NULL
        AND ST_DistanceSphere(
          vp.location, 
          ST_SetSRID(ST_MakePoint(${searchLng}, ${searchLat}), 4326)
        ) <= ${radiusMeters}
      ORDER BY "distanceKm" ASC;
    `;

    // 4. Multi-Layer Filtering & Travel Time Augmentation
    const filteredVolunteers = candidates
      .filter((vol) => {
        // --- CONSTRAINT 1: Gender Filter ---
        if (request.genderPref === 'FEMALE_ONLY' && vol.gender !== 'FEMALE') return false;
        if (request.genderPref === 'MALE_ONLY' && vol.gender !== 'MALE') return false;

        // --- CONSTRAINT 2: Lower Education Level Check ---
        // Scribe must have an educational qualification strictly lower than the exam level
        const volEduRank = EDU_RANK[vol.highestEducation?.toUpperCase()] || 4;
        const examEduRank = EDU_RANK[targetExamLevel.toUpperCase()] || 4;

        if (volEduRank >= examEduRank) {
          return false;
        }

        // --- CONSTRAINT 3: Stream Disconnect Filter ---
        // Prevents subject bias / unfair advantage
        if (
          targetExamStream &&
          vol.volunteerStream &&
          vol.volunteerStream.toUpperCase() === targetExamStream.toUpperCase()
        ) {
          return false;
        }

        return true;
      })
      .map((vol) => {
        // Compute precise distance fallback if DB spatial distance was truncated
        const distanceKm =
          parseFloat(vol.distanceKm) ||
          calculateDistanceKm(searchLat, searchLng, vol.lastLat, vol.lastLng);

        // Calculate travel ETA in minutes using MapMyIndia routing logic
        const etaMinutes = estimateTravelTimeMinutes(distanceKm);

        // Transportation Action Classification
        let transportAction = 'STANDARD_COMMUTE';
        if (request.requiresTransport) {
          if (vol.hasVehicle) {
            transportAction = 'DIRECT_VOLUNTEER_RIDE';
          } else {
            transportAction = 'TRIGGER_THIRD_PARTY_RIDE';
          }
        }

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
          averageRating: parseFloat(vol.averageRating || 5.0),
          distanceKm,
          etaMinutes,
          transportAction,
        };
      });

    return {
      requestId,
      transportStrategy,
      searchCenter: { lat: searchLat, lng: searchLng, radiusKm },
      appliedFilters: {
        genderPref: request.genderPref,
        targetExamLevel,
        targetExamStream: targetExamStream || 'ANY / UNRESTRICTED',
        streamDisconnectEnforced: Boolean(targetExamStream),
      },
      totalEligibleFound: filteredVolunteers.length,
      volunteers: filteredVolunteers,
    };
  }

  /**
   * 2. Confirm and Assign a Volunteer to an Exam Request
   */
  static async assignVolunteerToRequest(requestId, volunteerId) {
    const volunteer = await prisma.volunteerProfile.findUnique({
      where: { id: volunteerId },
      include: { user: { select: { name: true, phone: true } } },
    });

    if (!volunteer) {
      throw new Error(`Volunteer profile with ID '${volunteerId}' not found.`);
    }

    const updatedRequest = await prisma.examRequest.update({
      where: { id: requestId },
      data: {
        volunteerId: volunteer.id,
        status: 'MATCHED',
      },
      include: {
        volunteer: { include: { user: true } },
        candidate: { include: { user: true } },
      },
    });

    return updatedRequest;
  }
}

module.exports = MatchingService;