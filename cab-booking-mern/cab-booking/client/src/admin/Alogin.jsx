import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

const Alogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/admin/login", form);
      login(res.data.token, "admin", res.data.admin);
      navigate("/admin/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <span className="brand">UCab App — Admin</span>
        <div className="nav-links">
          <Link to="/login">User Login</Link>
        </div>
      </nav>
      <div className="page">
        <div className="form-card">
          <h2>Admin Login</h2>
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default Alogin;
