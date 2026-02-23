import React from "react";
import { useMusic } from "../context/MusicContext";

export default function AudioPlayer() {
  const {
    isPlaying,
    play,
    pause,
    nextTrack,
    prevTrack,
    hasAutoplayFailed,
  } = useMusic();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "243px",
        background: "#111",
        color: "#fff",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        zIndex: 1000,
      }}
    >
      {/* Previous Track */}
      <button onClick={prevTrack} style={buttonStyle}>
        <i className="fas fa-backward"></i>
      </button>

      {/* Play/Pause Button */}
      {isPlaying ? (
        <button onClick={pause} style={buttonStyle}>
          <i className="fas fa-pause"></i>
        </button>
      ) : (
        <button onClick={play} style={buttonStyle}>
          <i className="fas fa-play"></i>
        </button>
      )}

      {/* Next Track */}
      <button onClick={nextTrack} style={buttonStyle}>
        <i className="fas fa-forward"></i>
      </button>

      {/* Autoplay Error Message */}
      {hasAutoplayFailed && (
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            width: "100%",
            backgroundColor: "#ff4d4d",
            color: "#fff",
            textAlign: "center",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          <span>Autoplay failed. Please click play to start music.</span>
        </div>
      )}
    </div>
  );
}

// Basic button styling for the player
const buttonStyle = {
  background: "transparent",
  border: "none",
  color: "#0098ff",
  fontSize: "30px",
  cursor: "pointer",
  padding: "10px",
  transition: "all 0.3s ease",
  borderRadius: "8px",
  width: "40px",
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxSizing: "border-box",
};

// Add a hover effect to the buttons for better interactivity
buttonStyle[':hover'] = {
  background: "#444",
};
