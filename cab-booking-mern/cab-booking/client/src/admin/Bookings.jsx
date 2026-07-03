import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
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

const STATUS_OPTIONS = ["Pending", "On the Way", "Completed", "Cancelled"];

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get("/bookings"), api.get("/drivers")])
      .then(([bookingsRes, driversRes]) => {
        setBookings(bookingsRes.data);
        setDrivers(driversRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignDriver = async (id, driverId) => {
    if (!driverId) return;
    try {
      await api.put(`/bookings/${id}/assign-driver`, { driverId });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="page">
        <h1 className="page-title">My Booking</h1>
        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="empty-state">No bookings yet.</p>
        ) : (
          <div className="panel" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Trip</th>
                  <th>Pickup</th>
                  <th>Drop</th>
                  <th>User</th>
                  <th>Driver</th>
                  <th>Car</th>
                  <th>Car No</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>
                      {b.pickupCity} → {b.dropCity}
                    </td>
                    <td>
                      {b.pickupTime}, {new Date(b.pickupDate).toLocaleDateString()}
                    </td>
                    <td>
                      {b.dropTime}, {b.dropDate ? new Date(b.dropDate).toLocaleDateString() : "-"}
                    </td>
                    <td>{b.user?.name}</td>
                    <td>
                      {b.driver?.name || (
                        <select
                          defaultValue=""
                          onChange={(e) => handleAssignDriver(b._id, e.target.value)}
                          style={{ width: "auto", padding: "4px 6px", fontSize: "0.8rem" }}
                        >
                          <option value="">Assign driver…</option>
                          {drivers.map((d) => (
                            <option key={d._id} value={d._id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>{b.car?.carModel}</td>
                    <td>{b.car?.carNo}</td>
                    <td>₹{b.fare}</td>
                    <td>
                      <select
                        className={statusClass(b.status)}
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        style={{ width: "auto", padding: "4px 8px" }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {b.status !== "Cancelled" && b.status !== "Completed" && (
                        <button
                          className="btn-delete"
                          style={{ flex: "none", padding: "6px 10px" }}
                          onClick={() => handleCancel(b._id)}
                        >
                          Cancel
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

export default Bookings;
