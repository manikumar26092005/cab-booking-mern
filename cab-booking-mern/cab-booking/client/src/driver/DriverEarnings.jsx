import React, { useEffect, useState } from "react";
import DriverNavbar from "../components/DriverNavbar";
import api from "../api";

const DriverEarnings = () => {
  const [data, setData] = useState({ totalEarnings: 0, ridesCompleted: 0, history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/drivers/earnings")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <DriverNavbar />
      <div className="page">
        <h1 className="page-title">My Earnings</h1>
        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : (
          <>
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">TOTAL EARNINGS</div>
                <div className="stat-value">₹{data.totalEarnings}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">RIDES COMPLETED</div>
                <div className="stat-value">{data.ridesCompleted}</div>
              </div>
            </div>

            {data.history.length === 0 ? (
              <p className="empty-state">No completed rides yet.</p>
            ) : (
              <div className="panel" style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Rider</th>
                      <th>Car</th>
                      <th>Fare Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.history.map((h) => (
                      <tr key={h._id}>
                        <td>{new Date(h.updatedAt).toLocaleDateString()}</td>
                        <td>{h.user?.name}</td>
                        <td>{h.car?.carModel} ({h.car?.carNo})</td>
                        <td>₹{h.fare}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DriverEarnings;
