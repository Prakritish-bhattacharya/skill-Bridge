import React from "react";
import { useAuth } from "./components/AuthProvider";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950">
      <Dashboard/>
    </div>
  );
};

export default App;
