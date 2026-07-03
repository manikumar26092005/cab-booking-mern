import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const Addcar = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    driverName: "",
    email: "",
    phone: "",
    carModel: "",
    carType: "",
    carNo: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .get("/cars/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (imageFile) {
        data.append("carImage", imageFile);
      }

      await api.post("/cars", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Car and Driver added successfully");

      setTimeout(() => {
        navigate("/admin/cabs");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add car");
    }
  };

  return (
    <div>
      <AdminNavbar />

      <div className="page">
        <h1 className="page-title">Add Car</h1>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="driverName"
                placeholder="Driver Name"
                value={form.driverName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Driver Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="phone"
                placeholder="Driver Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="carModel"
                placeholder="Car Model"
                value={form.carModel}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="carType"
                placeholder="Car Type (Mini, Sedan, SUV)"
                value={form.carType}
                onChange={handleChange}
                list="carTypeOptions"
                required
              />

              <datalist id="carTypeOptions">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="carNo"
                placeholder="Car Number"
                value={form.carNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                name="price"
                placeholder="Price per Km"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Car Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            <button type="submit" className="btn-secondary">
              Submit
            </button>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addcar;