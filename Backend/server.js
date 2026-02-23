const express = require("express");
const cors = require("cors");
// 1. Rename this to 'connectDB' so it's clear it is a function, not the library
const connectDB = require("./config/db"); 

const app = express();

// 2. ACTUALLY CALL THE FUNCTION HERE
connectDB(); 

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/scores", require("./routes/scoreRoute"));
app.use("/api/leaderboard", require("./routes/leaderboardRoute"));

app.get("/", (req, res) => res.send("Backend running 🚀"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));