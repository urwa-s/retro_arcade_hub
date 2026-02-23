import { useEffect, useState } from "react";
import api from "../api/axios";
import { useDashboard } from "../context/DashboardContext";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [game, setGame] = useState("flappyBird");
  const { backgroundVideo } = useDashboard();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await api.get("/leaderboard");
        setScores(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    };
    fetchScores();
  }, []);

  const filtered = scores
    .filter(s => s.game === game)
    .sort((a, b) => b.score - a.score);

  return (
  <div className="home-wrapper">
      <video
        key={backgroundVideo}
        className="home-video"
        autoPlay
        muted
        loop
        playsInline
        >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
           
    <div className="home-overlay" />
      <div className="home-content">
        <div className="arcade-card2">
    <h2>🏆 Leaderboard</h2>
    <select
      className="game-select"
      value={game}
      onChange={e => setGame(e.target.value)}
    >
      <option value="flappyBird">Flappy Bird</option>
      <option value="snakeGame">Snake</option>
      <option value="ticTacToe">Tic Tac Toe</option>
    </select>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {filtered.length === 0 && (
          <tr>
            <td colSpan="3">No scores yet</td>
          </tr>
        )}
        {filtered.map((row, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{row.username}</td>
            <td>{row.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
      </div>
    </div>
  );
};

export default Leaderboard;
