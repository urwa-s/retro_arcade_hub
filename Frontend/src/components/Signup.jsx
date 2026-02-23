import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthView } from "../context/AuthViewContext";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/usersSlice";
import api from "../api/axios";
import AuthTransition from "./AuthTransition";
import "../style/arcade.css";

const Signup = () => {
  const { setView } = useAuthView();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showTransition, setShowTransition] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill all fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await api.post(
        "/auth/signup",
        { username, email, password },
        { withCredentials: true }
      );

      // ✅ Show arcade transition
      setShowTransition(true);

      // ✅ Navigate after 2 seconds
      setTimeout(() => {
        dispatch(loginUser(res.data));
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed, try again");
    }
  };

  // ✅ Transition screen (renders before navigation)
  if (showTransition) {
    return <AuthTransition text="POWERING UP..." />;
  }

  return (
    <div>
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="arcade-input"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="arcade-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="arcade-input"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="arcade-input"
        />

        <button type="submit" className="arcade-nav-btn">
          Create Account
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <button
          type="button"
          className="arcade-nav-link"
          onClick={() => setView("login")}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;
