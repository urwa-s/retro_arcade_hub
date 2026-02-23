import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../style/arcade.css";

import tictactoeImg from "../assets/tictactoe.PNG";
import snakeImg from "../assets/snake.PNG";
import flappybird from "../assets/flappy.PNG";

const games = [
  { name: "Tic Tac Toe", route: "/tictactoe", image: tictactoeImg },
  { name: "Snake Game", route: "/snake", image: snakeImg },
  { name: "Flappy Bird", route: "/flappy", image: flappybird }
];

const GameShowcase = ({ openAuthModal }) => {
  const navigate = useNavigate();
  const user = useSelector(state => state.users.currentUser); // Redux user

  const handleGameClick = (route) => {
    if (!user) {
      if (openAuthModal) openAuthModal("login");
      return;
    }
    navigate(route);
  };

  return (
    <section className="arcade-games-showcase">
      <h2 className="arcade-section-title">Games</h2>
      <div className="arcade-games-grid">
        {games.map((game, i) => (
          <div
            key={i}
            className="arcade-game-card"
            onClick={() => handleGameClick(game.route)}
            style={{ cursor: "pointer" }}
          >
            <div className="arcade-game-image">
              <img src={game.image} alt={game.name} />
            </div>
            <div className="arcade-game-name">{game.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GameShowcase;
