import React from "react";
import { Navigate } from "react-router-dom";

// This component checks if a user is an admin.
// If not, it redirects them to the main dashboard page '/'.
const AdminRoute = ({ children }) => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // First check if user is logged in AND is an admin
  if (user && user.role === "admin") {
    return children; // User is an admin, render the page
  }

  // If not an admin (or not logged in), redirect to the dashboard
  return <Navigate to="/" />;
};

export default AdminRoute;
