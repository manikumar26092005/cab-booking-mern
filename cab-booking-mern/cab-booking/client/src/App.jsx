import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// User pages
import Home from "./user/Home";
import Login from "./user/Login";
import Register from "./user/Register";
import Uhome from "./user/Uhome";
import Cabs from "./user/Cabs";
import BookCab from "./user/BookCab";
import MyBookings from "./user/MyBookings";

// Admin pages
import Alogin from "./admin/Alogin";
import Ahome from "./admin/Ahome";
import Users from "./admin/Users";
import UserEdit from "./admin/UserEdit";
import Acabs from "./admin/Acabs";
import Acabedit from "./admin/Acabedit";
import Addcar from "./admin/Addcar";
import Bookings from "./admin/Bookings";
import Drivers from "./admin/Drivers";
import Reports from "./admin/Reports";

// Driver pages
import Dlogin from "./driver/Dlogin";
import Dregister from "./driver/Dregister";
import Dhome from "./driver/Dhome";
import DriverEarnings from "./driver/DriverEarnings";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<Alogin />} />
          <Route path="/driver/login" element={<Dlogin />} />
          <Route path="/driver/register" element={<Dregister />} />

          {/* User protected */}
          <Route
            path="/home"
            element={
              <ProtectedRoute requiredRole="user">
                <Uhome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cabs"
            element={
              <ProtectedRoute requiredRole="user">
                <Cabs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookcab/:id"
            element={
              <ProtectedRoute requiredRole="user">
                <BookCab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute requiredRole="user">
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Admin protected */}
          <Route
            path="/admin/home"
            element={
              <ProtectedRoute requiredRole="admin">
                <Ahome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id/edit"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/drivers"
            element={
              <ProtectedRoute requiredRole="admin">
                <Drivers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cabs"
            element={
              <ProtectedRoute requiredRole="admin">
                <Acabs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cabs/:id/edit"
            element={
              <ProtectedRoute requiredRole="admin">
                <Acabedit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-cab"
            element={
              <ProtectedRoute requiredRole="admin">
                <Addcar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requiredRole="admin">
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute requiredRole="admin">
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Driver protected */}
          <Route
            path="/driver/home"
            element={
              <ProtectedRoute requiredRole="driver">
                <Dhome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/earnings"
            element={
              <ProtectedRoute requiredRole="driver">
                <DriverEarnings />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
