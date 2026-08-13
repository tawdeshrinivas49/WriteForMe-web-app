<<<<<<< HEAD
// backend/src/modules/auth/auth.controller.js
const authService = require('./auth.service');
const DigiLockerProvider = require('./digilocker.provider');
const prisma = require('../../config/database');

exports.initiateDigiLocker = async (req, res) => {
  try {
    let role = (req.query.role || 'CANDIDATE').toUpperCase();
    let prismaRole;
    if (role === 'CANDIDATE' || role === 'STUDENT') {
      prismaRole = 'STUDENT';
    } else if (role === 'VOLUNTEER') {
      prismaRole = 'VOLUNTEER';
    } else {
      prismaRole = 'STUDENT'; // fallback
    }

    const { url, state, codeVerifier } = await DigiLockerProvider.createAuthorizationUrl(prismaRole);

    // ✅ Use upsert to avoid unique constraint errors
    await prisma.authSession.upsert({
      where: { state },
      update: {
        codeVerifier,
        role: prismaRole,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        state,
        codeVerifier,
        role: prismaRole,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    res.status(200).json({ url, state });
  } catch (error) {
    console.error('Initiate Error:', error.message);
    res.status(500).json({ error: error.message || 'Could not initiate DigiLocker verification' });
  }
};


// ✅ NEW callback handler for the session‑based flow
exports.digilockerCallback = async (req, res) => {
  try {
    // Extract query parameters from the redirect
    const { success, id, scope } = req.query;

    if (success !== 'True' || !id) {
      return res.status(400).json({ error: 'Invalid callback: missing success or id' });
    }

    // Fetch user data from Setu using the session ID
    const digiLockerData = await DigiLockerProvider.fetchUserDataBySessionId(id);

    // Determine role – we don't have it from callback, so we need to retrieve it.
    // You could store the role in a temporary cache keyed by session ID, or derive from state.
    // For simplicity, we'll assume the role is 'CANDIDATE' or we can infer from the user's earlier state.
    // Better: store role in a map or DB with the session ID.
    // But we can also set a default role or fetch it from the AuthSession table using a lookup.
    // Since we don't have the state here, we could use a separate lookup by session ID if we stored it.
    // For now, we'll use 'CANDIDATE' as fallback.
    const role = 'CANDIDATE'; // You may want to make this dynamic

    // Complete login / account creation
    const { user, token } = await authService.processDigiLockerLogin(
      digiLockerData,
      role,
      {} // extraProfileData if needed
    );

    res.status(200).json({
      message: 'Authentication successful',
      token,
      user,
    });
  } catch (error) {
    console.error('Callback Error:', error.message);
    res.status(500).json({ error: error.message || 'Authentication failed' });
=======
const authService = require('./auth.service');
const DigiLockerProvider = require('./digilocker.provider');

exports.digilockerLogin = async (req, res) => {
  try {
    // 1. Let the Provider decide how to fetch the data (Mock vs Live)
    const digiLockerData = await DigiLockerProvider.fetchUserData(req.body);

    // 2. Validate the standardized data
    if (!digiLockerData.phone || !digiLockerData.role) {
      return res.status(400).json({ error: 'Phone and Role are required' });
    }

    // 3. Pass clean, guaranteed data to the Service (DB & JWT logic)
    const { user, token } = await authService.processDigiLockerLogin(digiLockerData);

    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Auth Error:', error.message);
    // Send back 400 for explicit thrown errors, 500 for actual crashes
    const statusCode = error.message.includes('pending production credentials') ? 501 : 500;
    res.status(statusCode).json({ error: error.message || 'Authentication failed' });
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
  }
};