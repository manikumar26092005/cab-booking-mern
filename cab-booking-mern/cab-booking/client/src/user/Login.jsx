import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/users/login", form);
      login(res.data.token, "user", res.data.user);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <span className="brand">Cab Booking App</span>
        <div className="nav-links">
          <Link to="/admin/login">Admin Login</Link>
        </div>
      </nav>
      <div className="page">
        <div className="form-card">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn-secondary">
              Login
            </button>
            {error && <p className="error-text">{error}</p>}
            <p className="switch-text">Don't have an account?</p>
            <Link to="/register">
              <button type="button" className="btn-primary">
                Signup
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
