import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const Acabedit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    driverName: "",
    carModel: "",
    carType: "",
    carNo: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api
      .get(`/cars/${id}`)
      .then((res) => {
        const { driverName, carModel, carType, carNo, price } = res.data;
        setForm({ driverName, carModel, carType, carNo, price });
      })
      .catch(() => setError("Could not load car details"));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => data.append(key, val));
      if (imageFile) data.append("carImage", imageFile);

      await api.put(`/cars/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Car updated successfully");
      setTimeout(() => navigate("/admin/cabs"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="page">
        <h1 className="page-title">Edit Car Data</h1>
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                name="driverName"
                placeholder="Driver Name"
                value={form.driverName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                name="carModel"
                placeholder="Car Model"
                value={form.carModel}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                name="carType"
                placeholder="Car Type"
                value={form.carType}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                name="carNo"
                placeholder="Car No"
                value={form.carNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Car Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </div>
            <button type="submit" className="btn-secondary">
              Update
            </button>
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Acabedit;
