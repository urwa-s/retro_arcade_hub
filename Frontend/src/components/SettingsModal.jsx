import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../style/arcade.css";
import api from "../api/axios";
import { updateUser } from "../redux/usersSlice";
import { useDashboard } from "../context/DashboardContext";
import bgVideo1 from "../assets/background.mp4";
import bgVideo2 from "../assets/background2.mp4";
import bgVideo3 from "../assets/background3.mp4";

const avatarSeeds = [
  "pixel","neon","arcade","retro","ghost",
  "gamer","hero","ninja","cat","fox"
];

const videos = [
  { name: "Blue Arcade", src: bgVideo1 },
  { name: "Retro Grid", src: bgVideo2 },
  { name: "Neon Night", src: bgVideo3 },
];

const SettingsModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.users.currentUser);
  const { setBackgroundVideo } = useDashboard();

  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  /* ================= USERNAME ================= */
  const handleUsernameUpdate = async () => {
    if (!newUsername.trim()) {
      setStatusMsg("Username cannot be empty");
      return;
    }
    try {
      const res = await api.put("/auth/username", {
        userId: user._id,
        username: newUsername,
      });
      dispatch(updateUser({ username: res.data.username }));
      setStatusMsg("Username updated successfully");
    } catch (err) {
      setStatusMsg(err.response?.data?.message || "Failed to update username");
    }
  };

  /* ================= PASSWORD ================= */
  const handlePasswordUpdate = async () => {
    if (!oldPassword || !newPassword) {
      setStatusMsg("Fill both password fields");
      return;
    }
    try {
      await api.put("/auth/password", {
        userId: user._id,
        oldPassword,
        newPassword,
      });
      setStatusMsg("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setStatusMsg(err.response?.data?.message || "Failed to update password");
    }
  };

  /* ================= AVATAR ================= */
  const handleAvatarUpdate = async (url) => {
    try {
      const res = await api.put("/auth/avatar", {
        userId: user._id,
        avatar: url,
      });
      dispatch(updateUser({ avatar: res.data.avatar }));
      setStatusMsg("Avatar updated!");
    } catch (err) {
      setStatusMsg(err.response?.data?.message || "Failed to update avatar");
    }
  };

  /* ================= BACKGROUND ================= */
  const handleBackgroundSelect = (video) => {
    setBackgroundVideo(video); // 🔥 instant change
    onClose();
  };

  return (
    <>
      {/* Overlay behind drawer */}
      <div
        className={`arcade-modal-overlay2 ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className={`settings-modal-wrapper ${isOpen ? "open" : ""}`}>

        <h2 className="arcade-card-title">Settings</h2>

        {statusMsg && <div className="settings-status-msg">{statusMsg}</div>}

        {/* Username */}
        <div className="settings-section">
          <h4 className="settings-title">Change Username</h4>
          <input
            className="settings-input"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="New username"
          />
          <button className="arcade-nav-btn" onClick={handleUsernameUpdate}>
            Update Username
          </button>
        </div>

        {/* Password */}
        <div className="settings-section">
          <h4 className="settings-title">Change Password</h4>
          <input
            className="settings-input"
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            className="settings-input"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="arcade-nav-btn" onClick={handlePasswordUpdate}>
            Update Password
          </button>
        </div>

        {/* Avatar */}
        <div className="settings-section">
          <h4 className="settings-title">Choose Avatar</h4>
          <div className="avatar-grid">
            {avatarSeeds.map((seed) => {
              const url = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;
              return (
                <div
                  key={seed}
                  className="avatar-tile"
                  onClick={() => handleAvatarUpdate(url)}
                >
                  <img src={url} alt={seed} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Background */}
        <div className="settings-section">
          <h4 className="settings-title">Background</h4>
          <div className="settings-video-grid">
            {videos.map((video, idx) => (
              <div
                key={idx}
                className="settings-video-tile"
                onClick={() => handleBackgroundSelect(video.src)}
              >
                <video
                  src={video.src}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="settings-video-preview"
                />
                <span className="settings-video-name">{video.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
