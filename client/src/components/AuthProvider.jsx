import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// ======================================================
// Authentication Context
// ======================================================
// This context stores authentication-related information
// that needs to be available throughout the application.
//
// It will provide:
// 1. user              -> currently logged-in user
// 2. isAuthenticated   -> whether the user is authenticated
// 3. loading           -> whether authentication is being checked
const AuthContext = createContext();

// ======================================================
// Auth Provider
// ======================================================
// AuthProvider wraps the entire React application.
//
// This allows any component inside the application to
// access authentication state using useAuth().
const AuthProvider = ({ children }) => {
  // ====================================================
  // Current User
  // ====================================================
  // Stores the authenticated user's profile data.
  //
  // Initially null because we don't know whether the
  // browser currently has a valid authentication session.
  const [user, setUser] = useState(null);

  // ====================================================
  // Authentication State
  // ====================================================
  // false initially.
  //
  // IMPORTANT:
  // This does NOT immediately mean the user is logged out.
  // We still need to ask the backend.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ====================================================
  // Loading State
  // ====================================================
  // While this is true, React is checking the current
  // authentication status with the backend.
  //
  // This prevents premature redirects.
  const [loading, setLoading] = useState(true);
  // ====================================================
  // Login
  // ====================================================
  // This function updates React's authentication state
  // immediately after the backend successfully logs in
  // the user.
  //
  // IMPORTANT:
  // The JWT itself is NOT stored here.
  //
  // The backend stores the JWT inside an HttpOnly cookie.
  // We only store the user's public profile data in React
  // state.

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };
  // ====================================================
  // Check Authentication
  // ====================================================
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // ==============================================
        // Ask Backend For Current User
        // ==============================================
        // The browser automatically sends the HttpOnly
        // "token" cookie because withCredentials is true.
        //
        // React never reads the JWT directly.
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/profile/view`,
          {
            withCredentials: true,
          },
        );

        // ==============================================
        // Authentication Successful
        // ==============================================
        if (response.data.success) {
          setUser(response.data.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // ==============================================
        // Authentication Failed
        // ==============================================
        // A 401 normally means:
        //
        // - No JWT cookie
        // - Invalid JWT
        // - Expired JWT
        //
        // In all these cases, the user is treated as
        // unauthenticated.
        if (error.response?.status === 401) {
          setUser(null);
          setIsAuthenticated(false);
        } else {
          // Unexpected server/network error.
          console.error("Authentication check failed:", error);

          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        // ==============================================
        // Authentication Check Completed
        // ==============================================
        // Whether authentication succeeded or failed,
        // the initial authentication check is now complete.
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // ====================================================
  // Context Value
  // ====================================================
  // These values will be available to every component
  // wrapped by AuthProvider.
  const value = {
    user,
    isAuthenticated,
    loading,
    login
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ======================================================
// useAuth Custom Hook
// ======================================================
// Components can use:
//
// const { user, isAuthenticated, loading } = useAuth();
//
// instead of directly accessing AuthContext.
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
