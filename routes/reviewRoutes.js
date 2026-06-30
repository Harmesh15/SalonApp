const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken,isAdmin } = require('../middlewares/authMiddleware');

 // Aapka JWT Auth Middleware

// 1. Review post karna (Sirf Logged-in Customer ke liye)
router.post('/leave', verifyToken, reviewController.leaveReview);

// 2. Reviews dekhna (Public endpoint, koi bhi dekh sakta hai dashboard par)
router.get('/all', reviewController.getAllReviews);

// 3. Review par reply karna (Sirf Staff/Admin ke liye)
router.put('/reply/:reviewId', verifyToken,isAdmin, reviewController.respondToReview);

module.exports = router;