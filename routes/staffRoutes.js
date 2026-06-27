const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const staffController = require("../controllers/staffController");


router.get('/get', staffController.getAllStaff);
router.post('/add', [authMiddleware.verifyToken, authMiddleware.isAdmin], staffController.addStaff);
router.post('/assign/:id/service', [authMiddleware.verifyToken, authMiddleware.isAdmin], staffController.assignServices);
router.delete('/delete/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], staffController.deleteStaff);

module.exports = router;