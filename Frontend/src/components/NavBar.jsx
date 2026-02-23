import { Link, useNavigate } from "react-router-dom";
import { useAuthView } from "../context/AuthViewContext";
import AuthModal from "./AuthModal";
import SettingsModal from "./SettingsModal";
import Profile from "../components/Profile";
import { useState, useEffect } from "react";
import { useDashboard } from "../context/DashboardContext";
import logo from "../assets/logo.svg";

import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/usersSlice";

const NavBar = ({ modalOpen, setModalOpen }) => {
  const user = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();

  const { setView } = useAuthView();
  const navigate = useNavigate();
  const { setBackgroundVideo } = useDashboard();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const openAuthModal = (type) => {
    setView(type); // "login" or "signup"
    setModalOpen(true);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const openSettings = () => {
    setSettingsOpen(!settingsOpen);
    setProfileOpen(false);
  };

  const openProfile = () => {
    setProfileOpen(!profileOpen);
    setSettingsOpen(false);
  };

  useEffect(() => {
    if (user) setModalOpen(false);
  }, [user, setModalOpen]);

  return (
    <>
      <aside className="arcade-drawer">
        <div className="drawer-header">
          <img src={logo} alt="Retro Arcade Hub" className="drawer-logo-img" />
          <h1 className="drawer-title">Retro Arcade Hub</h1>
          {user && (
            <>
              <img
                src={user.avatar}
                alt="User Avatar"
                className="game-modal-avatar"
              />
              <h4 className="drawer-username">@{user.username}</h4>
            </>
          )}
        </div>
        <nav className="drawer-links">
          {user ? (
            <>
              <Link to="/dashboard">Home</Link>
              <Link to="/leaderboard">Leaderboard</Link>
              <button onClick={openProfile}>Profile</button>
              <button onClick={openSettings}>Settings</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => openAuthModal("login")}>Login</button>
              <button onClick={() => openAuthModal("signup")}>Sign Up</button>
            </>
          )}
        </nav>
      </aside>

      <AuthModal isOpen={modalOpen && !user} onClose={() => setModalOpen(false)} />
      {user && (
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onSelectBackground={(video) => setBackgroundVideo(video)}
        />
      )}
      {user && <Profile isOpen={profileOpen} onClose={() => setProfileOpen(false)} />}
    </>
  );
};

export default NavBar;
