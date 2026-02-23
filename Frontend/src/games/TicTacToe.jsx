import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { incrementTicTacToeWin } from "../redux/usersSlice";
import { useDashboard } from "../context/DashboardContext";

const human = "X";
const ai = "O";

const TicTacToe = () => {
  const { backgroundVideo } = useDashboard();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(s => s.users.currentUser);
  const username =
    user?.username || (user?.email ? user.email.split("@")[0] : "Guest");
  const avatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`;

  const sentRef = useRef(false);

  // 🔊 audio
  const orbAudio = useRef(new Audio("/src/assets/eat-orb.mp3"));
  const winAudio = useRef(new Audio("/src/assets/win.mp3"));
  const loseAudio = useRef(new Audio("/src/assets/game-over.mp3"));

  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    orbAudio.current.load();
    winAudio.current.load();
    loseAudio.current.load();
  }, []);

  const playAudio = audioRef => {
    setTimeout(() => {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }, 40);
  };

  const handleClick = i => {
    if (board[i] || winner) return;

    const newBoard = [...board];
    newBoard[i] = human;

    // 🔊 orb sound on click
    playAudio(orbAudio);

    let w = checkWinner(newBoard);
    if (w) return finish(newBoard, w);

    setBoard(newBoard);

    setTimeout(() => {
      const aiMove = bestMove(newBoard);
      if (aiMove !== null) newBoard[aiMove] = ai;

      w = checkWinner(newBoard);
      if (w) return finish([...newBoard], w);

      setBoard([...newBoard]);
    }, 400);
  };

  const finish = (b, w) => {
    if (sentRef.current) return;

    setBoard(b);
    setWinner(w);
    setShowModal(true);

    if (w === human) {
      playAudio(winAudio);
      if (user?._id) {
        dispatch(incrementTicTacToeWin());
        sentRef.current = true;
      }
    } else if (w === ai) {
      playAudio(loseAudio);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setShowModal(false);
    sentRef.current = false;
  };

  const resultText =
    winner === "draw"
      ? "Draw"
      : winner === human
      ? "You Win"
      : "You Lost";

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
          <h2 className="arcade-card-title">Tic Tac Toe</h2>

          <div className="ttt-board">
            {board.map((c, i) => (
              <div
                key={i}
                className="ttt-cell"
                onClick={() => handleClick(i)}
              >
                {c}
              </div>
            ))}
          </div>

          {showModal && (
            <div className="game-modal-overlay">
              <div className="game-modal">
                <h3>{resultText}</h3>

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

export default TicTacToe;

/* ---------- minimax ---------- */

function checkWinner(b) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (let l of lines) {
    const [a,b1,c] = l;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  }
  if (b.every(x => x)) return "draw";
  return null;
}

function bestMove(board) {
  const MISTAKE_CHANCE = 0.3;

  const available = [];
  for (let i = 0; i < 9; i++) if (!board[i]) available.push(i);

  if (Math.random() < MISTAKE_CHANCE) {
    return available[Math.floor(Math.random() * available.length)];
  }

  let bestScore = -Infinity;
  let move = null;

  for (let i of available) {
    board[i] = ai;
    const score = minimax(board, false);
    board[i] = null;
    if (score > bestScore) {
      bestScore = score;
      move = i;
    }
  }
  return move;
}

function minimax(board, isMax) {
  const result = checkWinner(board);
  if (result === ai) return 1;
  if (result === human) return -1;
  if (result === "draw") return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = ai;
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = human;
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
}
