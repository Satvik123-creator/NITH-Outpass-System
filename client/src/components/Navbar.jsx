import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StudentNavbar() {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // redirect to login after logout
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo / Title */}
        <Link to="/" className="text-2xl font-bold hover:text-gray-300">
          NITH Outpass Portal
        </Link>

        {/* Navigation / User Info */}
        <div className="flex items-center gap-6">
          {authUser ? (
            <>
              <span className="font-medium">Welcome, {authUser.name}</span>
             
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/"
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 transition"
            >
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
