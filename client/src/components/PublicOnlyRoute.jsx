import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // ==========================================
  // Authentication Check In Progress
  // ==========================================
  // Wait until AuthProvider knows whether the
  // user has a valid authentication session.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-white text-lg">
          Checking authentication...
        </p>
      </div>
    );
  }

  // ==========================================
  // User Is Already Authenticated
  // ==========================================
  // Login and Register pages are only for
  // unauthenticated users.
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ==========================================
  // User Is Not Authenticated
  // ==========================================
  // Allow access to Login/Register.
  return children;
};

export default PublicOnlyRoute;