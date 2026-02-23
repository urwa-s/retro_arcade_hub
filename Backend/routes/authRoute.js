const express = require("express");
const { signup, login } = require("../controllers/authController");
const { updateUsername, updatePassword, updateAvatar } = require("../controllers/authController");

const router = express.Router();

// Auth
router.post("/signup", signup);
router.post("/login", login);

// User updates (no middleware)
router.put("/username", updateUsername);
router.put("/password", updatePassword);
router.put("/avatar", updateAvatar);

module.exports = router;
