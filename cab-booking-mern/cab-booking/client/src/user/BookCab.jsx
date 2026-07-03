import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import api from "../api";

const BookCab = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    pickupState: "",
    pickupCity: "",
    dropState: "",
    dropCity: "",
    pickupDate: "",
    pickupTime: "",
    dropDate: "",
    dropTime: "",
    estimatedKm: 10,
    isScheduled: false,
  });

  useEffect(() => {
    api
      .get(`/cars/${id}`)
      .then((res) => setCar(res.data))
      .catch(() => setError("Could not load cab details"));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleCalculateFare = () => {
    if (!car) return;
    const km = Number(form.estimatedKm) || 10;
    setEstimatedFare(Math.round(car.price * km));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/bookings", { carId: id, ...form });
      setSuccess("Ride booked successfully!");
      setTimeout(() => navigate("/my-bookings"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="page">
        <h1 className="page-title">Book a Ride</h1>
        {car && (
          <p style={{ textAlign: "center", marginBottom: 18 }}>
            {car.carModel} ({car.carType}) — Driver: {car.driverName} — ₹{car.price}/Km
          </p>
        )}
        <div className="form-card" style={{ maxWidth: 480 }}>
          <form onSubmit={handleSubmit}>
            <h3>Pickup Location</h3>
            <div className="form-group" style={{ display: "flex", gap: 8 }}>
              <input
                name="pickupState"
                placeholder="Select State"
                value={form.pickupState}
                onChange={handleChange}
                required
              />
              <input
                name="pickupCity"
                placeholder="Select City"
                value={form.pickupCity}
                onChange={handleChange}
                required
              />
            </div>

            <h3>Drop Location</h3>
            <div className="form-group" style={{ display: "flex", gap: 8 }}>
              <input
                name="dropState"
                placeholder="Select State"
                value={form.dropState}
                onChange={handleChange}
                required
              />
              <input
                name="dropCity"
                placeholder="Select City"
                value={form.dropCity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Pickup Date</label>
              <input type="date" name="pickupDate" value={form.pickupDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Pickup Time</label>
              <input type="time" name="pickupTime" value={form.pickupTime} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Drop Date</label>
              <input type="date" name="dropDate" value={form.dropDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Drop Time</label>
              <input type="time" name="dropTime" value={form.dropTime} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Estimated Distance (Km)</label>
              <input
                type="number"
                name="estimatedKm"
                value={form.estimatedKm}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                id="isScheduled"
                name="isScheduled"
                checked={form.isScheduled}
                onChange={handleChange}
                style={{ width: "auto" }}
              />
              <label htmlFor="isScheduled" style={{ margin: 0 }}>
                Schedule this ride for later (instead of booking now)
              </label>
            </div>

            <button type="button" className="btn-secondary" onClick={handleCalculateFare}>
              Calculate Fare
            </button>
            {estimatedFare !== null && (
              <p className="success-text">Estimated Fare: ₹{estimatedFare}</p>
            )}

            <button type="submit" className="btn-primary">
              Book Ride
            </button>
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookCab;
