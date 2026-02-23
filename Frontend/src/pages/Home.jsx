import GameShowcase from "../components/GameShowcase";
import "../style/arcade.css";
import bgVideo from "../assets/background.mp4";

const Home = ({ openAuthModal }) => {
  return (
    <div className="home-wrapper">
      {/* Background video */}
      <video
        className="home-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="home-overlay" />

      {/* Content */}
      <div className="home-content">
        <section className="arcade-hero">
          <h1 className="arcade-title">Retro Arcade Hub</h1>
          <p className="arcade-subtext">
            Play retro games. Beat high scores. Rule the leaderboard.
          </p>
        </section>

        <GameShowcase openAuthModal={openAuthModal} />
      </div>
    </div>
  );
};

export default Home;
