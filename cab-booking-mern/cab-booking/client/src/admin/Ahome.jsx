import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const Ahome = () => {
  const [stats, setStats] = useState({ users: 0, cabs: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const maxVal = Math.max(stats.users, stats.cabs, stats.bookings, 1);
  const barHeight = (val) => `${(val / maxVal) * 100}px`;

  return (
    <div>
      <AdminNavbar />
      <div className="page">
        <h1 className="page-title">Dashboard</h1>
        {loading ? (
          <p className="empty-state">Loading dashboard...</p>
        ) : (
          <div className="panel">
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">USERS</div>
                <div className="stat-value">{stats.users}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">CABS</div>
                <div className="stat-value">{stats.cabs}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">BOOKINGS</div>
                <div className="stat-value">{stats.bookings}</div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 30,
                justifyContent: "center",
                height: 130,
                background: "#fff",
                borderRadius: 8,
                padding: "16px 20px",
              }}
            >
              {["users", "cabs", "bookings"].map((key) => (
                <div key={key} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 36,
                      height: barHeight(stats[key]),
                      background: "#f5a623",
                      borderRadius: "4px 4px 0 0",
                      margin: "0 auto",
                    }}
                  />
                  <div style={{ fontSize: "0.75rem", marginTop: 4, textTransform: "capitalize" }}>
                    {key}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ahome;
