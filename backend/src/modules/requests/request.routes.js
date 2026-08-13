const express = require('express');
const router = express.Router();
const requestsController = require('./request.controller');

// POST /api/v1/requests - Create new exam request (Pass OCR JSON output or custom payload)
router.post('/', requestsController.createRequest);

// GET /api/v1/requests - Get all candidate exam requests
router.get('/', requestsController.getRequests);

// GET /api/v1/requests/:id - Fetch detailed request info by ID
router.get('/:id', requestsController.getRequestById);

// POST /api/v1/requests/:id/verify-start-pin
router.post('/:id/verify-start-pin', requestsController.verifyStartPin);

// POST /api/v1/requests/:id/verify-completion-pin
router.post('/:id/verify-completion-pin', requestsController.verifyCompletionPin);

module.exports = router;