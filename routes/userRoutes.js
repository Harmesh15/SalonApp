const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware")

console.log("userRouter register api hit");

router.post("/register",userController.register);
router.post("/login",userController.login);
router.get("/profile",authMiddleware.verifyToken, userController.userProfile);
router.put("/update",authMiddleware.verifyToken,userController.updateProfile);


module.exports = router;