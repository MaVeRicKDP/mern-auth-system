import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token found, redirect to login page
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user session data (token/user info)
    localStorage.removeItem("token"); // key must match what you saved in Login.jsx
    localStorage.removeItem("user");

    // Redirect user to login page
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">Welcome to your Dashboard!</h1>
      <button
        onClick={handleLogout}
        className="px-8 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition text-lg font-semibold"
      >
        Logout
      </button>
    </div>
  );
}
