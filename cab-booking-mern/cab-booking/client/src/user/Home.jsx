import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <nav className="navbar">
        <span className="brand">Cab Booking App</span>
        <div className="nav-links">
          <Link to="/login">User Login</Link>
          <Link to="/driver/login">Driver Login</Link>
          <Link to="/admin/login">Admin Login</Link>
        </div>
      </nav>
      <div className="page">
        <div className="hero">
          <h1>Your Ride, Your Way</h1>
          <p>Reliable. Fast. Affordable. Book cabs anytime, anywhere.</p>
          <Link to="/login">
            <button className="explore-btn">Explore Services</button>
          </Link>
          <div className="taxi-icon">🚕</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
