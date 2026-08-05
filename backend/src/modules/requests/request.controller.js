const RequestsService = require('./request.service');

exports.createRequest = async (req, res) => {
  try {
    const payload = req.body;
    // Extract candidate ID from auth middleware or request body
    const candidateId = req.user?.candidateProfileId || req.user?.id || payload.candidateId;

    if (!candidateId) {
      return res.status(400).json({ error: 'Candidate ID is required to create a request' });
    }

    if (!payload.examName || !payload.examDate) {
      return res.status(400).json({ 
        error: 'Missing required fields: examName and examDate are mandatory' 
      });
    }

    const newRequest = await RequestsService.createRequest(payload, candidateId);

    res.status(201).json({
      message: 'Exam request successfully created and logged for scribe matching',
      data: newRequest
    });
  } catch (error) {
    console.error('Create Request Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create exam request' });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const candidateId = req.user?.candidateProfileId || req.user?.id;
    const requests = await RequestsService.getUserRequests(candidateId);
    res.status(200).json({ data: requests });
  } catch (error) {
    console.error('Get Requests Error:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve requests' });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await RequestsService.getRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Exam request not found' });
    }
    res.status(200).json({ data: request });
  } catch (error) {
    console.error('Get Request By ID Error:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve request details' });
  }
};


exports.verifyStartPin = async (req, res) => {
  try {
    const { id } = req.params;
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ error: 'Invigilator start PIN is required.' });
    }

    const updatedRequest = await RequestsService.verifyStartPin(id, pin);

    res.status(200).json({
      success: true,
      message: 'Invigilator PIN verified successfully! Exam is now IN_PROGRESS.',
      data: updatedRequest
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.verifyCompletionPin = async (req, res) => {
  try {
    const { id } = req.params;
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ error: 'Completion PIN is required.' });
    }

    const updatedRequest = await RequestsService.verifyCompletionPin(id, pin);

    res.status(200).json({
      success: true,
      message: 'Completion PIN verified successfully! Exam is officially COMPLETED.',
      data: updatedRequest
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};