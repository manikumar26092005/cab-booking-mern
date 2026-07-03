import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then((res) => setForm({ name: res.data.name, email: res.data.email, phone: res.data.phone || "" }))
      .catch(() => setError("Could not load user"));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.put(`/users/${id}`, form);
      setSuccess("User updated successfully");
      setTimeout(() => navigate("/admin/users"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="page">
        <h1 className="page-title">Edit User</h1>
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
