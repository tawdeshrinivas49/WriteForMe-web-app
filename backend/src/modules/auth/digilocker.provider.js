class DigiLockerProvider {
  static async fetchUserData(clientPayload) {
    const isMock = process.env.USE_MOCK_DIGILOCKER === 'true';

    if (isMock) {
      // DEVELOPMENT: Return the mock JSON payload directly from Postman
      return {
        phone: clientPayload.phone,
        name: clientPayload.name,
        gender: clientPayload.gender,
        role: clientPayload.role,
        hasFreshAcademicRecords: clientPayload.hasFreshAcademicRecords || false
      };
    } else {
      // PRODUCTION: The clientPayload will contain an OAuth 'code' instead of raw user data
      const { authorizationCode } = clientPayload;
      
      if (!authorizationCode) {
        throw new Error("Authorization code missing for live DigiLocker login");
      }

      // TODO: Implement actual DigiLocker OAuth flow here later
      // 1. axios.post(DIGILOCKER_TOKEN_URL, { code: authorizationCode, ... })
      // 2. axios.get(DIGILOCKER_PROFILE_URL, { headers: { Authorization: `Bearer ${token}` } })
      // 3. Parse the XML/JSON response to match our standard object
      
      throw new Error("Live DigiLocker API integration pending production credentials.");
    }
  }
}

module.exports = DigiLockerProvider;