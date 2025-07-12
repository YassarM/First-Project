import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn }) => {
  
  return isLoggedIn === true ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;