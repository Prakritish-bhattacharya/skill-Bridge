import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import AuthProvider from "./components/AuthProvider.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicOnlyRoute>
        <Register />
      </PublicOnlyRoute>
    ),
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  </StrictMode>,
);
