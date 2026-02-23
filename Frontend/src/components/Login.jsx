import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { loginUser } from "../redux/usersSlice";
import { useAuthView } from "../context/AuthViewContext";
import AuthTransition from "./AuthTransition";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setView } = useAuthView(); // 👈 ONLY for switching Login/Signup UI

  const [showTransition, setShowTransition] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", formData);

    setView(null);                 // 👈 hide login/signup modal
    setShowTransition(true);

      // ✅ Navigate after 2 seconds
      setTimeout(() => {
        dispatch(loginUser(res.data));
        navigate("/dashboard");
      }, 2000);
  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  }
};

  if (showTransition) {
    return <AuthTransition text="POWERING UP..." />;
  }


  return (
    <div>
      <h2 className="arcade-card-title">Login</h2>

      <form className="arcade-form" onSubmit={handleSubmit}>
        <input
          className="arcade-input"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />

        <input
          className="arcade-input"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <button type="submit" className="arcade-nav-btn">
          Login
        </button>

        <p>
          Don't have an account?{" "}
          <button
            type="button"
            className="arcade-nav-link"
            onClick={() => setView("signup")}
          >
            Signup
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
