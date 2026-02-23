import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateHighScore } from "../redux/usersSlice";
import { useDashboard } from "../context/DashboardContext";

const FlappyBird = () => {
  const { backgroundVideo } = useDashboard();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.users.currentUser);
  const previousScore = useSelector(
    state => state.users.currentUser?.scores?.flappyBird || 0
  );

  const username =
    user?.username || (user?.email ? user.email.split("@")[0] : "Guest");

  const avatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`;

  const sentRef = useRef(false);

  // 🔊 audio
  const dieAudio = useRef(new Audio("/src/assets/game-over.mp3"));
  const winAudio = useRef(new Audio("/src/assets/win.mp3"));

  const [birdY, setBirdY] = useState(200);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const birdYRef = useRef(birdY);
  const scoreRef = useRef(score);

  useEffect(() => { birdYRef.current = birdY; }, [birdY]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  useEffect(() => {
    dieAudio.current.load();
    winAudio.current.load();
  }, []);

  const playAudio = audioRef => {
    setTimeout(() => {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }, 50);
  };

  // 🌍 gravity
  useEffect(() => {
    if (gameOver) return;
    const gravity = setInterval(
      () => setBirdY(y => Math.min(y + 3, 380)),
      30
    );
    return () => clearInterval(gravity);
  }, [gameOver]);

  // 🧱 pipes + collision
  useEffect(() => {
    if (gameOver) return;

    const pipeInterval = setInterval(() => {
      setPipes(prev => {
        const updated = prev
          .map(p => ({ ...p, x: p.x - 5 }))
          .filter(p => p.x + 50 > 0);

        if (updated.length === 0 || updated[updated.length - 1].x < 150) {
          const h = Math.random() * 150 + 50;
          updated.push({
            x: 300,
            topHeight: h,
            bottomHeight: 400 - h - 100,
            passed: false,
          });
        }

        const y = birdYRef.current;

        for (let pipe of updated) {
          const hitPipe =
            40 > pipe.x &&
            40 < pipe.x + 50 &&
            (y < pipe.topHeight ||
              y + 20 > pipe.topHeight + 100);

          if (hitPipe) {
            setGameOver(true);
            setShowModal(true);
            return updated;
          }
        }

        updated.forEach(p => {
          if (!p.passed && p.x + 50 < 20) {
            p.passed = true;
            setScore(s => s + 1);
          }
        });

        return updated;
      });
    }, 50);

    return () => clearInterval(pipeInterval);
  }, [gameOver]);

  // 🏆 game over handler
  useEffect(() => {
    if (!gameOver || !user?._id || sentRef.current) return;

    if (scoreRef.current > previousScore) {
      playAudio(winAudio);
      setIsNewHighScore(true);
    } else {
      playAudio(dieAudio);
      setIsNewHighScore(false);
    }

    dispatch(
      updateHighScore({
        game: "flappyBird",
        score: scoreRef.current,
      })
    );

    sentRef.current = true;
  }, [gameOver, previousScore, dispatch, user]);

  const jump = () => {
    if (!gameOver) setBirdY(y => Math.max(y - 30, 0));
  };

  const resetGame = () => {
    setBirdY(200);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setShowModal(false);
    setIsNewHighScore(false);
    sentRef.current = false;
  };

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
        <div className="arcade-card2" onMouseDown={jump}>
          <h2 className="arcade-card-title">Flappy Bird</h2>

          <div className="flappy-game" onClick={jump}>
            <div
              className="flappy-bird"
              style={{ top: birdY, left: 20 }}
            />

            {pipes.map((pipe, i) => (
              <div key={i}>
                <div
                  className="flappy-pipe"
                  style={{
                    height: pipe.topHeight,
                    top: 0,
                    left: pipe.x,
                  }}
                />
                <div
                  className="flappy-pipe"
                  style={{
                    height: pipe.bottomHeight,
                    bottom: 0,
                    left: pipe.x,
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flappy-score">Score: {score}</div>
          <p style={{ fontSize: "0.6rem", color: "#00ffff" }}>
            Click anywhere to jump
          </p>

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

export default FlappyBird;
