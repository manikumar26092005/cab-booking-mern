import React, { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
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

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const fetchBookings = () => {
    setLoading(true);
    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const openReschedule = (id) => {
    setRescheduleId(id);
    setNewDate("");
    setNewTime("");
  };

  const submitReschedule = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/bookings/${rescheduleId}/reschedule`, {
        pickupDate: newDate,
        pickupTime: newTime,
      });
      setRescheduleId(null);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Reschedule failed");
    }
  };

  const downloadReceipt = async (id) => {
    try {
      const res = await api.get(`/bookings/${id}/receipt`);
      const r = res.data;
      const text = `UCab App — Ride Receipt
----------------------------------
Receipt ID: ${r.receiptId}
Issued: ${new Date(r.issuedAt).toLocaleString()}
Rider: ${r.rider}
Driver: ${r.driver}
Car: ${r.car}
Trip: ${r.trip}
Pickup: ${r.pickup}
Fare: ₹${r.fare}
Status: ${r.status}
----------------------------------
Thank you for riding with UCab App!`;
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${r.receiptId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.message || "Could not generate receipt");
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="page">
        <h1 className="page-title">My Bookings</h1>

        {rescheduleId && (
          <div className="form-card" style={{ marginBottom: 24 }}>
            <h3>Reschedule Ride</h3>
            <form onSubmit={submitReschedule}>
              <div className="form-group">
                <label>New Pickup Date</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>New Pickup Time</label>
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary">Confirm Reschedule</button>
              <button type="button" className="btn-secondary" onClick={() => setRescheduleId(null)}>
                Cancel
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="empty-state">You haven't booked any rides yet.</p>
        ) : (
          <div className="panel" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Cab Booked Date</th>
                  <th>Trip</th>
                  <th>Pickup</th>
                  <th>Drop</th>
                  <th>Driver</th>
                  <th>Car</th>
                  <th>Car No</th>
                  <th>Amount Paid</th>
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
                    <td>{b.driver?.name || "Unassigned"}</td>
                    <td>{b.car?.carModel}</td>
                    <td>{b.car?.carNo}</td>
                    <td>₹{b.fare}</td>
                    <td className={statusClass(b.status)}>{b.status}</td>
                    <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {b.status === "Pending" && (
                        <>
                          <button
                            className="btn-edit"
                            style={{ flex: "none", padding: "6px 10px" }}
                            onClick={() => openReschedule(b._id)}
                          >
                            Reschedule
                          </button>
                          <button
                            className="btn-delete"
                            style={{ flex: "none", padding: "6px 10px" }}
                            onClick={() => handleCancel(b._id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        className="btn-book"
                        style={{ flex: "none", padding: "6px 10px" }}
                        onClick={() => downloadReceipt(b._id)}
                      >
                        Receipt
                      </button>
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

export default MyBookings;
