import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const DriverNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/driver/login");
  };

  return (
    <nav className="navbar">
      <Link to="/driver/home" className="brand">
        UCab App — Driver
      </Link>
      <div className="nav-links">
        <Link to="/driver/home">Rides</Link>
        <Link to="/driver/earnings">Earnings</Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        {user?.name && <span>({user.name})</span>}
      </div>
    </nav>
  );
};

export default DriverNavbar;
