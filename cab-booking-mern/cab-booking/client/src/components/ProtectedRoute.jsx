import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, role } = useAuth();

  const loginPathFor = (r) => {
    if (r === "admin") return "/admin/login";
    if (r === "driver") return "/driver/login";
    return "/login";
  };

  if (!token) {
    return <Navigate to={loginPathFor(requiredRole)} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
