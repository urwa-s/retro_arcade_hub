import { useEffect } from "react";
import driftSound from "../assets/audio.mp3";
import "../style/arcade.css";

const AuthTransition = ({ text = "POWERING UP..." }) => {
  useEffect(() => {
    const audio = new Audio(driftSound);
    audio.volume = 0.6;      // adjust if needed
    audio.play().catch(() => {
      // autoplay can fail silently, that's okay
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="auth-transition">
      <div className="auth-transition-box">
        <h1 className="glitch">{text}</h1>
        <p className="blink">Loading...</p>
      </div>
    </div>
  );
};

export default AuthTransition;
