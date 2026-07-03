import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const Reports = () => {
  const [data, setData] = useState({ statusBreakdown: [], totalRevenue: 0, topCars: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/reports")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="page">
        <h1 className="page-title">Reports & Analytics</h1>
        {loading ? (
          <p className="empty-state">Loading reports...</p>
        ) : (
          <>
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">TOTAL REVENUE</div>
                <div className="stat-value">₹{data.totalRevenue}</div>
              </div>
              {data.statusBreakdown.map((s) => (
                <div className="stat-card" key={s._id}>
                  <div className="stat-label">{(s._id || "Unknown").toUpperCase()}</div>
                  <div className="stat-value">{s.count}</div>
                </div>
              ))}
            </div>

            <div className="panel" style={{ marginTop: 10 }}>
              <h3 style={{ marginTop: 0 }}>Top Performing Cars</h3>
              {data.topCars.length === 0 ? (
                <p className="empty-state">No booking data yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Car Model</th>
                      <th>Car No</th>
                      <th>Rides</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topCars.map((c, idx) => (
                      <tr key={idx}>
                        <td>{c.carModel}</td>
                        <td>{c.carNo}</td>
                        <td>{c.rides}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
