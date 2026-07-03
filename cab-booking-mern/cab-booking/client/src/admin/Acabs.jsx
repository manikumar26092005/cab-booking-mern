import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const Acabs = () => {
  const [cabs, setCabs] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCabs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;
      if (sort) params.sort = sort;
      const res = await api.get("/cars", { params });
      setCabs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCabs();
  };

  const toggleSort = () => {
    const next = sort === "asc" ? "desc" : "asc";
    setSort(next);
    setTimeout(fetchCabs, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this car?")) return;
    try {
      await api.delete(`/cars/${id}`);
      fetchCabs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="page">
        <h1 className="page-title">Car List</h1>
        <form className="toolbar" onSubmit={handleSearchSubmit}>
          <input
            placeholder="Search by car name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            placeholder="Search by car type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
          <button type="submit" className="sort-btn">
            Search
          </button>
          <button type="button" className="sort-btn" onClick={toggleSort}>
            Sort Price {sort === "asc" ? "↓" : "↑"}
          </button>
        </form>

        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : cabs.length === 0 ? (
          <p className="empty-state">No cars found.</p>
        ) : (
          <div className="cab-grid">
            {cabs.map((cab) => (
              <div className="cab-card" key={cab._id}>
                <img
                  src={
                    cab.carImage
                      ? `http://localhost:8000${cab.carImage}`
                      : "https://placehold.co/300x150/f5a623/1a1300?text=Cab"
                  }
                  alt={cab.carModel}
                />
                <div className="cab-body">
                  <span className="cab-meta">Driver: {cab.driverName}</span>
                  <span className="cab-meta">Model: {cab.carModel}</span>
                  <span className="cab-meta">Type: {cab.carType}</span>
                  <span className="cab-meta">Number: {cab.carNo}</span>
                  <span className="cab-meta">Price: ₹{cab.price}/Km</span>
                </div>
                <div className="cab-actions">
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/admin/cabs/${cab._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(cab._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Acabs;
