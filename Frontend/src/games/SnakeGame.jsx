import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateHighScore } from "../redux/usersSlice";
import { useDashboard } from "../context/DashboardContext";

const SnakeGame = () => {
  const { backgroundVideo } = useDashboard();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.users.currentUser);
  const previousScore = useSelector(
    state => state.users.currentUser?.scores?.snakeGame || 0
  );

  const username =
    user?.username ||
    (user?.email ? user.email.split("@")[0] : "Guest");

  const avatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`;

  const sentRef = useRef(false);

  // 🎵 Audio
  const eatAudio = useRef(new Audio("/src/assets/eat-orb.mp3"));
  const dieAudio = useRef(new Audio("/src/assets/game-over.mp3"));
  const winAudio = useRef(new Audio("/src/assets/win.mp3"));

  // 🐍 Game state
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState("RIGHT");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const gridSize = 20;
  const speed =
    difficulty === "easy"
      ? 300
      : difficulty === "hard"
      ? 100
      : 200;

  // preload audio
  useEffect(() => {
    eatAudio.current.load();
    dieAudio.current.load();
    winAudio.current.load();
  }, []);

  // 🎮 controls
  useEffect(() => {
    const handleKey = e => {
      if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
      if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
      if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
      if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
      if (e.key === " ") togglePause();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction]);

  const togglePause = () => setIsPaused(p => !p);

  // ⏱️ game loop
  useEffect(() => {
    if (gameOver || isPaused) return;
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, isPaused, speed]);

  const playAudio = audioRef => {
    setTimeout(() => {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }, 50);
  };

  const moveSnake = () => {
    const head = [...snake[0]];

    if (direction === "UP") head[1]--;
    if (direction === "DOWN") head[1]++;
    if (direction === "LEFT") head[0]--;
    if (direction === "RIGHT") head[0]++;

    const hitWall =
      head[0] < 0 ||
      head[0] >= gridSize ||
      head[1] < 0 ||
      head[1] >= gridSize;

    const hitSelf = snake.some(
      s => s[0] === head[0] && s[1] === head[1]
    );

    if (hitWall || hitSelf) {
      setGameOver(true);
      setShowModal(true);
      return;
    }

    const newSnake = [head, ...snake];

    if (head[0] === food[0] && head[1] === food[1]) {
      setScore(s => s + 1);
      setFood([
        Math.floor(Math.random() * gridSize),
        Math.floor(Math.random() * gridSize),
      ]);
      playAudio(eatAudio);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  // 🏆 handle game over + high score
  useEffect(() => {
    if (!gameOver || !user?._id || sentRef.current) return;

    if (score > previousScore) {
      playAudio(winAudio);
      setIsNewHighScore(true);
    } else {
      playAudio(dieAudio);
      setIsNewHighScore(false);
    }

    dispatch(updateHighScore({ game: "snakeGame", score }));
    sentRef.current = true;
  }, [gameOver, score, previousScore, user, dispatch]);

  const resetGame = () => {
    setSnake([[5, 5]]);
    setFood([10, 10]);
    setDirection("RIGHT");
    setScore(0);
    setGameOver(false);
    setShowModal(false);
    setIsPaused(false);
    setIsNewHighScore(false);
    sentRef.current = false;
  };

  return (
    <div className="home-wrapper">
      <video className="home-video" autoPlay muted loop playsInline>
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      <div className="home-overlay" />

      <div className="home-content">
        <div className="arcade-card2">
          <h2 className="arcade-card-title">Snake</h2>
          <p>Score: {score}</p>

          <div className="snake-board">
            {Array.from({ length: gridSize }).map((_, y) =>
              Array.from({ length: gridSize }).map((_, x) => {
                const isSnake = snake.some(
                  s => s[0] === x && s[1] === y
                );
                const isFood = food[0] === x && food[1] === y;

                return (
                  <div
                    key={`${x}-${y}`}
                    className={`snake-cell ${
                      isSnake ? "snake" : ""
                    } ${isFood ? "food" : ""}`}
                  />
                );
              })
            )}
          </div>

          <div className="difficulty-options">
            {["easy", "medium", "hard"].map(level => (
              <button
                key={level}
                className={`difficulty-btn ${
                  difficulty === level ? "active" : ""
                }`}
                onClick={() => setDifficulty(level)}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="difficulty-options">
            <button className="difficulty-btn" onClick={resetGame}>
              Reset
            </button>
            <button className="difficulty-btn" onClick={togglePause}>
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>

          {showModal && (
            <div className="game-modal-overlay">
              <div className="game-modal">
                <h3>Game Over</h3>
                <img
                  src={avatar}
                  alt="avatar"
                  className="game-modal-avatar"
                />
                <p className="game-modal-name">{username}</p>
                <p className="game-modal-score">Score: {score}</p>

                {isNewHighScore && (
                  <p className="new-high-score">
                    🏆 NEW HIGH SCORE!
                  </p>
                )}

                <div className="game-modal-actions">
                  <button
                    className="arcade-button"
                    onClick={resetGame}
                  >
                    Play Again
                  </button>
                  <button
                    className="arcade-button"
                    onClick={() => navigate("/dashboard")}
                  >
                    Home Screen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
