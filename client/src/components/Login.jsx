import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Login = () => {
    const {login} = useAuth()
  // ======================================
  // Login Form State
  // ======================================

  // Stores the email entered by the user
  const [emailId, setEmailId] = useState("piku@gmail.com");

  // Stores the password entered by the user
  const [password, setPassword] = useState("Piku@123");

  // ======================================
  // Request State
  // ======================================

  // Tracks whether the login API request is currently running
  // Used to disable the form/button and show a loading message
  const [loading, setLoading] = useState(false);

  // Stores an error message returned by the backend
  // or a frontend/network error
  const [error, setError] = useState("");

  // ======================================
  // Navigation
  // ======================================
  // useNavigate allows us to redirect the user
  // programmatically after successful login
  const navigate = useNavigate();
  
  // ======================================
  // Handle Login Form Submission
  // ======================================
  const handleSubmit = async (event) => {
    
    // Prevent the browser's default form submission behaviour
    // which would reload the entire React application
    event.preventDefault();
    // Clear any previous error before starting a new login attempt
    setError("");
    try {
      // ======================================
      // Start Loading State
      // ======================================
      // Indicates that the login request is in progress
      // The UI can use this to disable inputs/button
      // and display "Logging in..."
      setLoading(true);
      // ======================================
      // Send Login Request to Backend
      // ======================================
      const response = await axios.post(
        // Backend login endpoint
        // VITE_API_BASE_URL comes from the frontend .env file
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        // ======================================
        // Request Body--> These fields must match the backend API contract
        // ======================================
        {
          emailId,
          password,
        },
        // ======================================
        // Axios Configuration
        // ======================================
        {
          // Required because our backend authentication
          // uses an HTTP-only JWT cookie.
          //
          // This allows the browser to receive the authentication
          // cookie from the backend and send it with future requests.
          withCredentials: true,
        },
      );
      // ======================================
      // Debug Successful Response
      // ======================================
      // Displays the backend response in the browser console
      // Useful during development and API integration testing
      console.log("Login response:", response.data);
      // ======================================
      // Handle Successful Login
      // ======================================
      if (response.data.success) {
        // Login was successful.
        //
        // The backend has already created the JWT and
        // stored it in an HTTP-only cookie.
        //
        // We do NOT store the JWT in localStorage or
        // manually access the cookie from JavaScript.

        // Redirect the authenticated user to the home page
        login(response.data.data)
        navigate("/");
      }
    } catch (error) {
      // ======================================
      // Handle Login Error
      // ======================================
      console.error("Login failed:", error);
      // ======================================
      // Backend Error
      // ======================================
      // If the backend returned an error response,
      // display the backend's message to the user.
      // Example:
      // "Invalid email or password."
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        // ======================================
        // Network / Unknown Error
        // ======================================
        // This usually means the frontend could not
        // communicate with the backend server.
        setError("Unable to connect to the server.");
      }
    } finally {
      // ======================================
      // Stop Loading State
      // ======================================
      // This executes whether the request succeeds
      // or fails, so the loading state is always reset.
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            SkillBridge
          </h1>

          <p className="text-sm sm:text-base text-gray-400 mt-2">
            Exchange skills. Grow together.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-7 md:p-8 shadow-xl">
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              Welcome back
            </h2>

            <p className="text-sm sm:text-base text-gray-400 mt-2">
              Login to continue to SkillBridge
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="emailId"
                className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>

              <input
                id="emailId"
                type="email"
                value={emailId}
                onChange={(event) => setEmailId(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition disabled:opacity-50"
              />
            </div>
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition disabled:opacity-50"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-400 transition">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
