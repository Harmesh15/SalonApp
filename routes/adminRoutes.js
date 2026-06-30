const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken,isAdmin } = require('../middlewares/authMiddleware');

// --- Appointments Management ---
router.get('/appointments', verifyToken, isAdmin,adminController.getAllAppointments); // View & Search
router.put('/appointments/:id', verifyToken, isAdmin,adminController.updateAppointment); // Confirm/Reschedule/Cancel

// --- Customers Management ---
router.get('/customers', verifyToken,isAdmin, adminController.getAllCustomers); // View list
router.delete('/customers/:id', verifyToken,isAdmin, adminController.deleteCustomer); // Remove customer

module.exports = router;