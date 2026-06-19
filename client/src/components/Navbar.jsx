import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-b from-[#003366] to-[#001a33] text-white shadow-md w-full py-3">
      <div className="flex items-center justify-between px-6 sm:px-8 lg:px-24 w-full">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/nith_logo.jpg"
            alt="NITH"
            className="w-10 h-10 rounded-full border-2 border-white/30"
          />
          <div>
            <div className="text-lg md:text-xl font-bold tracking-tight">
              NITH Outpass
            </div>
            <div className="text-xs md:text-sm text-blue-200">
              Student & Warden Portal
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {authUser ? (
            <>
              <div className="text-sm md:text-base mr-2">
                <div className="font-medium truncate max-w-[160px] md:max-w-xs text-white/90">
                  {authUser.name || authUser.enrollmentNo || authUser.email}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-sm bg-white/15 text-white hover:bg-white/25 border border-white/20 rounded-lg"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="btn btn-sm bg-white/15 text-white hover:bg-white/25 border border-white/20 rounded-lg">
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
