import { useState } from "react";
import GameShowcase from "../components/GameShowcase";
import "../style/arcade.css";
import { useDashboard } from "../context/DashboardContext";

const Dashboard = () => {
  const { backgroundVideo } = useDashboard();

  return (
    <div className="home-wrapper">
      {/* Background video */}
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

      {/* Overlay */}
      <div className="home-overlay" />

      {/* Content */}
      <div className="home-content">
        <section className="arcade-hero">
          <h1 className="arcade-title">Retro Arcade Hub</h1>
          <p className="arcade-subtext">
            Select your favorite game and play!
          </p>
        </section>

        {/* Games */}
        <GameShowcase />
      </div>
    </div>
  );
};

export default Dashboard;
