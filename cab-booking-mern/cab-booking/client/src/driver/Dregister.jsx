import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const Dregister = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/drivers/register", form);
      setSuccess("Registered! An admin will assign you a vehicle. Redirecting to login...");
      setTimeout(() => navigate("/driver/login"), 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <span className="brand">UCab App — Driver</span>
        <div className="nav-links">
          <Link to="/driver/login">Login</Link>
        </div>
      </nav>
      <div className="page">
        <div className="form-card">
          <h2>Driver Signup</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            </div>
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
              <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
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
              Signup
            </button>
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
            <p className="switch-text">Already have an account?</p>
            <Link to="/driver/login">
              <button type="button" className="btn-primary">
                Login
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dregister;
