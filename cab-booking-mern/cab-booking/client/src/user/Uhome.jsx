import React from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { useAuth } from "../AuthContext";

const Uhome = () => {
  const { user } = useAuth();

  return (
    <div>
      <UserNavbar />
      <div className="page">
        <h1 className="page-title">Welcome{user?.name ? `, ${user.name}` : ""}!</h1>
        <div className="stats-row">
          <Link to="/cabs" style={{ textDecoration: "none" }}>
            <div className="stat-card">
              <div className="stat-label">Browse Cabs</div>
              <div className="stat-value">🚖</div>
            </div>
          </Link>
          <Link to="/my-bookings" style={{ textDecoration: "none" }}>
            <div className="stat-card">
              <div className="stat-label">My Bookings</div>
              <div className="stat-value">📋</div>
            </div>
          </Link>
        </div>
        <div className="panel">
          <p>
            Ready for your next ride? Head to <strong>Book Cab</strong> to see available cabs
            near you, or check <strong>My Booking</strong> to track your current rides.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Uhome;
