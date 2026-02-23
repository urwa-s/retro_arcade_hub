const mongoose = require("mongoose");

/* ================= AVATAR UTILS ================= */
const seeds = [
  "pixel", "neon", "arcade", "retro", "ghost",
  "gamer", "hero", "ninja", "cat", "fox"
];

const generateAvatar = () => {
  const seed = seeds[Math.floor(Math.random() * seeds.length)];
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;
};

/* ================= USER SCHEMA ================= */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: generateAvatar,
    },

    scores: {
      snakeGame: { type: Number, default: 0 },
      flappyBird: { type: Number, default: 0 },
      ticTacToe: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
