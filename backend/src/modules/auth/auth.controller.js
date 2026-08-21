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

exports.digilockerCallback = async (req, res) => {
  try {
    const { success, id, scope } = req.query;

    if (success !== 'True' || !id) {
      return res.status(400).json({ error: 'Invalid callback: missing success or id' });
    }

    const digiLockerData = await DigiLockerProvider.fetchUserDataBySessionId(id);

    // We need to retrieve the role from a temporary store; for now we'll use a default.
    // In a real implementation, you'd store the role with the session ID.
    const role = 'STUDENT'; // or fetch from AuthSession using state

    const { user, token } = await authService.processDigiLockerLogin(
      digiLockerData,
      role,
      {} // extraProfileData
    );

    res.status(200).json({
      message: 'Authentication successful',
      token,
      user,
    });
  } catch (error) {
    console.error('Callback Error:', error.message);
    res.status(500).json({ error: error.message || 'Authentication failed' });
  }
};

// ---------- NEW: Email/Password Signup ----------
exports.signup = async (req, res) => {
  try {
    const userData = req.body;
    const result = await authService.signupUser(userData);
    // If the user role requires DigiLocker, we return a redirect URL
    if (result.redirectUrl) {
      return res.status(201).json({ redirectUrl: result.redirectUrl });
    }
    // Otherwise, return token and user
    res.status(201).json({
      message: 'Account created successfully',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// ---------- NEW: Email/Password Login ----------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = await authService.loginUser(email, password);
    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(401).json({ error: error.message });
  }
};

// ---------- NEW: Google Login ----------
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }
    const result = await authService.googleLogin(credential);
    res.status(200).json({
      message: 'Google login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Google Login Error:', error.message);
    res.status(401).json({ error: error.message });
  }
};