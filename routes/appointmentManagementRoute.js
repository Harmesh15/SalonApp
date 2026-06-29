const express = require('express');
const router = express.Router();
const managementController = require('../controllers/appointmentManagement');
const { verifyToken } = require('../middlewares/authMiddleware'); // Aapka JWT middleware

// Cancel Endpoint (PUT ya PATCH best hota hai status update ke liye)
router.put('/cancel/:id', verifyToken, managementController.cancelAppointment);

// Reschedule Endpoint
router.put('/reschedule/:id', verifyToken, managementController.rescheduleAppointment);

module.exports = router;