const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/create-order', verifyToken, paymentController.createPaymentOrder);
router.get('/verify', paymentController.verifyPayment); // Cashfree is par GET request hit karega redirect ke waqt

module.exports = router;