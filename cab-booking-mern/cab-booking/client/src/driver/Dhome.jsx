import React, { useEffect, useState } from "react";
import DriverNavbar from "../components/DriverNavbar";
import api from "../api";

const statusClass = (status) => {
  switch (status) {
    case "Pending":
      return "status-pending";
    case "On the Way":
      return "status-on-the-way";
    case "Completed":
      return "status-completed";
    case "Cancelled":
      return "status-cancelled";
    default:
      return "";
  }
};

const Dhome = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRides = () => {
    setLoading(true);
    api
      .get("/drivers/rides")
      .then((res) => setRides(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load rides"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleRespond = async (id, response) => {
    try {
      await api.put(`/drivers/rides/${id}/respond`, { response });
      fetchRides();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/drivers/rides/${id}/status`, { status });
      fetchRides();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <DriverNavbar />
      <div className="page">
        <h1 className="page-title">My Assigned Rides</h1>
        {error && <p className="error-text">{error}</p>}
        {loading ? (
          <p className="empty-state">Loading rides...</p>
        ) : rides.length === 0 ? (
          <p className="empty-state">No rides assigned yet. Check back soon!</p>
        ) : (
          <div className="panel" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Trip</th>
                  <th>Rider</th>
                  <th>Car</th>
                  <th>Fare</th>
                  <th>Status</th>
                  <th>Request</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rides.map((r) => (
                  <tr key={r._id}>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      {r.pickupCity} → {r.dropCity}
                    </td>
                    <td>{r.user?.name}</td>
                    <td>{r.car?.carModel} ({r.car?.carNo})</td>
                    <td>₹{r.fare}</td>
                    <td className={statusClass(r.status)}>{r.status}</td>
                    <td>{r.driverRequestStatus}</td>
                    <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {r.driverRequestStatus === "Awaiting" && (
                        <>
                          <button
                            className="btn-book"
                            style={{ flex: "none", padding: "6px 10px" }}
                            onClick={() => handleRespond(r._id, "Accepted")}
                          >
                            Accept
                          </button>
                          <button
                            className="btn-delete"
                            style={{ flex: "none", padding: "6px 10px" }}
                            onClick={() => handleRespond(r._id, "Rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {r.driverRequestStatus === "Accepted" && r.status !== "Completed" && (
                        <button
                          className="btn-edit"
                          style={{ flex: "none", padding: "6px 10px" }}
                          onClick={() => handleStatusUpdate(r._id, "Completed")}
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dhome;
