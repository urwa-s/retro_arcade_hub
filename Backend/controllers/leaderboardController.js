const User = require("../models/User");

// Add or update score
exports.addScore = async (req, res) => {
  try {
    const { userId, game, score } = req.body;
    if (!userId || !game || score === undefined) {
      return res.status(400).json({ message: "Missing data" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.scores) user.scores = {};
    const currentScore = user.scores[game] || 0;

    if (score > currentScore) {
      user.scores[game] = score;
      await user.save();
    }

    res.json({ game, highScore: user.scores[game] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all leaderboard scores
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({});
    const scores = [];

    users.forEach(u => {
      if (u.scores) {
        for (let game in u.scores) {
          scores.push({
            username: u.username || (u.email?.split("@")[0] ?? "Guest"),
            game,
            score: u.scores[game]
          });
        }
      }
    });

    // Sort descending
    scores.sort((a, b) => b.score - a.score);

    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
