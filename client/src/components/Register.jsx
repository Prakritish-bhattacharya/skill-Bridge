import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const Register = () => {
  // ==========================================
  // Form State
  // ==========================================
  // These states store the values entered by
  // the user in the registration form.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [gender, setGender] = useState("male");
  const [password, setPassword] = useState("");
  // ==========================================
  // UI State
  // ==========================================
  // loading -> prevents multiple submissions
  // error   -> stores backend/frontend error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // ==========================================
  // Navigation
  // ==========================================
  // Used to navigate the user to the login
  // page after successful registration.
  const navigate = useNavigate();
  // ==========================================
  // Handle Registration Form Submission
  // ==========================================
  const handleSubmit = async (event) => {
    // Prevent browser's default form submission
    // which would reload the page.
    event.preventDefault();

    // Remove any previous error message.
    setError("");

    // ==========================================
    // Basic Frontend Validation
    // ==========================================
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    if (!emailId.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      // ========================================
      // Start Loading State
      // ========================================
      setLoading(true);

      // ========================================
      // Send Registration Request
      // ========================================
      // Backend endpoint:
      // POST /register
      //
      // The backend contract expects:
      // firstName
      // lastName
      // emailId
      // password
      // gender
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/register`,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          emailId: emailId.trim(),
          password,
          gender,
        },
      );

      console.log("Registration response:", response.data);

      // ========================================
      // Registration Successful
      // ========================================
      if (response.data.success) {
        // Registration does NOT automatically log
        // the user in.
        //
        // Our intended flow is:
        //
        // Register
        //    ↓
        // Registration successful
        //    ↓
        // Login page
        //    ↓
        // Login
        //    ↓
        // JWT cookie
        //    ↓
        // Dashboard
        navigate("/login");
      }
    } catch (error) {
      // ========================================
      // Handle Registration Error
      // ========================================
      console.error("Registration failed:", error);

      // Backend sends useful error messages such as:
      //
      // "Email already exists..."
      // "Password must..."
      // "Invalid email..."
      //
      // Display the backend message when available.
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        // Network/server connection failure
        setError("Unable to connect to the server.");
      }
    } finally {
      // ========================================
      // Stop Loading State
      // ========================================
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-lg">

        {/* =====================================
            Brand
        ====================================== */}
        <div className="text-center mb-5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            SkillBridge
          </h1>

          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Exchange skills. Grow together.
          </p>
        </div>

        {/* =====================================
            Register Card
        ====================================== */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-7 shadow-xl">

          {/* Heading */}
          <div className="mb-5">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              Create your account
            </h2>

            <p className="text-sm sm:text-base text-gray-400 mt-1">
              Join SkillBridge and start exchanging skills.
            </p>
          </div>

          {/* =====================================
              Error Message
          ====================================== */}
          {error && (
            <div
              className="mb-4 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* =====================================
              Registration Form
          ====================================== */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* First Name + Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  First name
                </label>

                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition disabled:opacity-60"
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Last name
                </label>

                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition disabled:opacity-60"
                />
              </div>
            </div>

            {/* Email + Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Email */}
              <div>
                <label
                  htmlFor="emailId"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email
                </label>

                <input
                  id="emailId"
                  type="email"
                  value={emailId}
                  onChange={(event) => setEmailId(event.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition disabled:opacity-60"
                />
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white outline-none focus:border-blue-500 transition disabled:opacity-60"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition disabled:opacity-60"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* =====================================
              Login Navigation
          ====================================== */}
          <p className="text-center text-sm text-gray-400 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-400 transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};



export default Register;