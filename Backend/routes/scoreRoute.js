const express = require("express");
const router = express.Router();
const { updateHighScore, incrementScore } = require("../controllers/scoreController");

// POST /api/scores/update  → update high score for a game
router.post("/update", updateHighScore);

// POST /api/scores/increment → increment Tic Tac Toe wins
router.post("/increment", incrementScore);

module.exports = router;
