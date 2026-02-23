import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import { useState } from "react";
import SnakeGame from "./games/SnakeGame";
import TicTacToe from "./games/TicTacToe";
import FlappyBird from "./games/FlappyBird";
import Leaderboard from "./pages/Leaderboard";
import AudioPlayer from "./components/AudioPlayer";

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  const openAuthModal = () => setModalOpen(true);

  return (
    <Router>
      <div className="app-layout">
        <NavBar modalOpen={modalOpen} setModalOpen={setModalOpen} />
        <AudioPlayer />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home openAuthModal={openAuthModal} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard/>}/>
             <Route path="/snake" element={<SnakeGame />} />
             <Route path="/tictactoe" element={<TicTacToe />} />
            <Route path="/flappy" element={<FlappyBird />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
