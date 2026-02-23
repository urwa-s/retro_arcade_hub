const User = require("../models/User");

exports.incrementScore = async (req, res) => {
  try {
    const { userId, game } = req.body;

    if (!userId || !game) {
      return res.status(400).json({ message: "Missing data" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof user.scores[game] !== "number") {
      user.scores[game] = 0;
    }

    user.scores[game] += 1;
    await user.save();

    res.json({
      game,
      newValue: user.scores[game],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateHighScore = async (req, res) => {
  try {
    const { userId, game, score } = req.body;

    if (!userId || !game || score === undefined) {
      return res.status(400).json({ message: "Missing data" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // current score from DB
    const currentScore = user.scores[game];

    // update ONLY if new score is higher
    if (score > currentScore) {
      user.scores[game] = score;
      await user.save();
    }

    res.json({
      game,
      highScore: user.scores[game],
      updated: score > currentScore,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
