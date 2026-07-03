import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const AdminNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <nav className="navbar">
      <Link to="/admin/home" className="brand">
        UCab App
      </Link>
      <div className="nav-links">
        <Link to="/admin/home">Home</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/drivers">Drivers</Link>
        <Link to="/admin/cabs">Cabs</Link>
        <Link to="/admin/add-cab">AddCab</Link>
        <Link to="/admin/bookings">Bookings</Link>
        <Link to="/admin/reports">Reports</Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
