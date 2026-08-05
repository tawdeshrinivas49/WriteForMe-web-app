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
  }
};