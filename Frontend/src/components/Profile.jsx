import { useSelector } from "react-redux";
import '../style/arcade.css';

const Profile = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.users.currentUser);

  if (!user) return null;

  const username =
    user.username || (user.email ? user.email.split("@")[0] : "Player");

  const avatar =
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`;

  const scores = user.scores || {};

  return (
    <>
      {/* Overlay */}
      <div
        className={`arcade-modal-overlay2 ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Sliding drawer */}
      <div className={`settings-modal-wrapper ${isOpen ? "open" : ""}`}>
        {/* Avatar */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <img src={avatar} alt="avatar" className="game-modal-avatar" />
          <p className="game-modal-name">{username}</p>
          <p style={{ color: "#00ffff", fontSize: "0.75rem" }}>
            {user.email}
          </p>
        </div>

        {/* Scores */}
        <div style={{ marginTop: "30px" }}>
          <h4 className="settings-title" style={{ textAlign: "center" }}>
            Best Scores
          </h4>

          {Object.entries(scores).map(([game, score]) => (
            <div
              key={game}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 14px",
                marginBottom: "10px",
                border: "1px solid #00ffff",
                borderRadius: "10px",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "0.6rem",
              }}
            >
              <span>{game}</span>
              <span style={{ color: "#00ffff" }}>{score}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;