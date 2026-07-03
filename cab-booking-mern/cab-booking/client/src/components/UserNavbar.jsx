import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const UserNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="brand">
        Ucab App
      </Link>
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/cabs">Book Cab</Link>
        <Link to="/my-bookings">My Booking</Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        {user?.name && <span>({user.name})</span>}
      </div>
    </nav>
  );
};

export default UserNavbar;
