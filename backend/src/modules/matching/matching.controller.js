const matchingService = require('./matching.service');

exports.findVolunteers = async (req, res) => {
  try {
    const { requestId } = req.params;
    const radiusKm = parseFloat(req.query.radiusKm) || 10; // Default 10km radius

    const results = await matchingService.findVolunteersForRequest(requestId, radiusKm);

    res.status(200).json({
      success: true,
      requestId,
      searchRadiusKm: radiusKm,
      totalMatched: results.volunteers.length,
      transportStrategy: results.transportStrategy,
      data: results.volunteers
    });
  } catch (error) {
    console.error('Find Volunteers Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.assignVolunteer = async (req, res) => {
  try {
    const { requestId, volunteerId } = req.body;

    if (!requestId || !volunteerId) {
      return res.status(400).json({ error: 'Both requestId and volunteerId are required.' });
    }

    const updatedRequest = await matchingService.assignVolunteerToRequest(requestId, volunteerId);

    res.status(200).json({
      message: 'Scribe successfully assigned to exam request!',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Assign Volunteer Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};