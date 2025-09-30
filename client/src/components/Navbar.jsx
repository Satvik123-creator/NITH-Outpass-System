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
    <nav className="bg-gradient-to-b from-[#0b5fff] to-[#071133] text-white shadow-md w-full py-4">
      <div className="flex items-center justify-between px-6 sm:px-8 lg:px-24 w-full">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/nith_logo.jpg"
            alt="NITH"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="text-xl md:text-2xl font-semibold">
              NITH Outpass
            </div>
            <div className="text-sm md:text-base muted">
              Student & Warden Portal
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {authUser ? (
            <>
              <div className="text-base mr-4">
                <div className="font-medium truncate max-w-xs">
                  {authUser.name}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-md btn-accent"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="btn btn-sm btn-primary">
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
