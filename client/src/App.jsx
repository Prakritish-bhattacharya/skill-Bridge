import React from "react";
import { useAuth } from "./components/AuthProvider";

const App = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-white text-lg">
          Checking authentication...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950">
      <h1 className="text-5xl font-bold text-white">
        SkillBridge
      </h1>

      <p className="text-gray-400 mt-4">
        Authenticated: {isAuthenticated ? "Yes" : "No"}
      </p>

      {user && (
        <p className="text-gray-400 mt-2">
          Welcome, {user.firstName}!
        </p>
      )}
    </div>
  );
};

export default App;