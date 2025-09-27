import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StudentNavbar() {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-[#071133] text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/nith_logo.jpg"
            alt="NITH"
            className="w-10 h-10 rounded-md"
          />
          <div>
            <div className="text-lg font-semibold">NITH Outpass</div>
            <div className="text-sm muted">Student & Warden Portal</div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {authUser ? (
            <>
              <div className="text-sm">
                <div className="font-medium">{authUser.name}</div>
                <div className="text-xs muted">{authUser.role}</div>
              </div>
              <button onClick={handleLogout} className="btn btn-sm btn-accent">
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
