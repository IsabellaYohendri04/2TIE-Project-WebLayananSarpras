import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../context/AuthContext";
import Loading from "./Loading";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] || "/login"} replace />;
  }

  return <Outlet />;
}
