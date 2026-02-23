// routes/leaderboardRoute.js
const express = require("express");
const router = express.Router();
const {
  addScore,
  getLeaderboard
} = require("../controllers/leaderboardController");

// Add/update a score
router.post("/add", addScore);

// Get leaderboard
router.get("/", getLeaderboard);

module.exports = router;
