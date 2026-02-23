import { useAuthView } from "../context/AuthViewContext";
import Signup from "./Signup";
import Login from "./Login";
import "../style/arcade.css";

const AuthModal = ({ isOpen, onClose }) => {
  const { view } = useAuthView();

  if (!isOpen) return null; // hide modal when not open

  return (
    <div className="arcade-modal-overlay" onClick={onClose}>
      <div
        className="arcade-card modal-card"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside card
      >
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        {view === "signup" ? <Signup inline /> : <Login inline />}
      </div>
    </div>
  );
};

export default AuthModal;
