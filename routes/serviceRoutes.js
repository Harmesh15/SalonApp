const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const AuthMiddleware = require("../middlewares/authMiddleware");

// public route
router.get("/read",serviceController.getAllServices);

// Admin route

router.post("/create",AuthMiddleware.isAdmin,serviceController.createService);
router.delete("/delete/:id",AuthMiddleware.isAdmin,serviceController.deleteService);
router.put("/update/:id",AuthMiddleware.isAdmin,serviceController.updateService);
router.post("/availability",AuthMiddleware.isAdmin,serviceController.setServiceAvailability);

module.exports = router;