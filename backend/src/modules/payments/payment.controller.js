const paymentService = require('./payment.service');

exports.createEscrowOrder = async (req, res) => {
  try {
    const { requestId, adminHonorariumOverride } = req.body;

    if (!requestId) {
      return res.status(400).json({ success: false, error: 'requestId is required.' });
    }

    const orderData = await paymentService.createEscrowOrder(requestId, adminHonorariumOverride);

    res.status(201).json({
      success: true,
      message: 'Escrow order created successfully.',
      data: orderData
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.verifyEscrow = async (req, res) => {
  try {
    const { requestId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!requestId || !razorpayOrderId) {
      return res.status(400).json({ success: false, error: 'requestId and razorpayOrderId are required.' });
    }

    const verificationResult = await paymentService.verifyAndLockEscrow({
      requestId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    res.status(200).json({
      success: true,
      data: verificationResult
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.releasePayout = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ success: false, error: 'requestId is required.' });
    }

    const payoutResult = await paymentService.releaseEscrowPayout(requestId);

    res.status(200).json({
      success: true,
      message: 'Instant UPI payout released to volunteer!',
      data: payoutResult
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};