import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get("/drivers"), api.get("/cars")])
      .then(([driversRes, carsRes]) => {
        setDrivers(driversRes.data);
        setCars(carsRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignCar = async (driverId, carId) => {
    if (!carId) return;
    try {
      await api.put(`/drivers/${driverId}/assign-car`, { carId });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this driver?")) return;
    try {
      await api.delete(`/drivers/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="page">
        <h1 className="page-title">Drivers</h1>
        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : drivers.length === 0 ? (
          <p className="empty-state">No drivers registered yet.</p>
        ) : (
          <div className="panel" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Sl/No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Assigned Car</th>
                  <th>Total Earnings</th>
                  <th>Operation</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((d, idx) => (
                  <tr key={d._id}>
                    <td>{idx + 1}</td>
                    <td>{d.name}</td>
                    <td>{d.email}</td>
                    <td>{d.phone || "-"}</td>
                    <td>
                      {d.car ? (
                        `${d.car.carModel} (${d.car.carNo})`
                      ) : (
                        <select
                          defaultValue=""
                          onChange={(e) => handleAssignCar(d._id, e.target.value)}
                          style={{ width: "auto", padding: "4px 6px", fontSize: "0.8rem" }}
                        >
                          <option value="">Assign car…</option>
                          {cars.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.carModel} ({c.carNo})
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>₹{d.totalEarnings}</td>
                    <td>
                      <button
                        className="btn-delete"
                        style={{ flex: "none", padding: "6px 10px" }}
                        onClick={() => handleDelete(d._id)}
                      >
                        Remove
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

export default Drivers;
