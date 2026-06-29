const express = require("express");
const router = express.Router();
const bookingController = require('../controllers/appointmentController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get("/slots",bookingController.getAvailableSlots);
router.post("/book",verifyToken,bookingController.bookAppointment);
router.post("/update",verifyToken);
router.post("/cancle",verifyToken);


module.exports = router;