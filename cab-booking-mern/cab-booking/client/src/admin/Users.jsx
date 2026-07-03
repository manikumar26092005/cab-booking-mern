import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = () => {
    setLoading(true);
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="page">
        <h1 className="page-title">Users</h1>
        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : users.length === 0 ? (
          <p className="empty-state">No users found.</p>
        ) : (
          <div className="panel" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Sl/No</th>
                  <th>UserId</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Operation</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u._id}>
                    <td>{idx + 1}</td>
                    <td>{u._id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn-edit"
                        style={{ flex: "none", padding: "6px 10px" }}
                        onClick={() => navigate(`/admin/users/${u._id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        style={{ flex: "none", padding: "6px 10px" }}
                        onClick={() => handleDelete(u._id)}
                      >
                        Delete
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

export default Users;
