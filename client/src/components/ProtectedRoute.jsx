import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // ==========================================
  // Authentication Check In Progress
  // ==========================================
  // Do not redirect while AuthProvider is still
  // checking the JWT cookie with the backend.
  //
  // Otherwise, a valid user could briefly be
  // redirected to /login during page refresh.
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
  // User Is Not Authenticated
  // ==========================================
  // Protected pages must not be accessible
  // without a valid authenticated session.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // User Is Authenticated
  // ==========================================
  // Allow access to the protected route.
  return children;
};

export default ProtectedRoute;