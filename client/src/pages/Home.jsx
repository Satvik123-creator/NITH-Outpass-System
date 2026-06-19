import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-gradient-to-b from-[#003366] to-[#001a33] text-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/nith_logo.jpg"
              alt="NITH"
              className="w-10 h-10 rounded-full border-2 border-white/30"
            />
            <div>
              <div className="text-lg font-bold tracking-tight">NITH Outpass</div>
              <div className="text-xs text-blue-200">Student & Warden Portal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center bg-[#F5F7FA]">
        <div className="max-w-2xl w-full mx-auto px-6 py-12">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/nith_logo.jpg"
              alt="NITH Logo"
              className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-lg mb-6"
            />
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#003366] tracking-tight">
              NIT Hamirpur
            </h1>
            <h2 className="text-lg md:text-xl font-medium text-[#00509E] mt-1">
              Outpass Management System
            </h2>
            <p className="mt-4 text-gray-500 max-w-md mx-auto leading-relaxed">
              Submit and manage outpass requests online. Select your role below to get started.
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
            <button
              onClick={() => navigate("/login/student")}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#003366]/30 p-8 text-center transition-all duration-200 cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EBF5FF] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#003366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#003366] transition-colors">
                Student
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Apply for outpass, track request status, and view your outpass history.
              </p>
            </button>

            <button
              onClick={() => navigate("/login/warden")}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#003366]/30 p-8 text-center transition-all duration-200 cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EBF5FF] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#003366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#003366] transition-colors">
                Warden
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Review and manage outpass requests from students in your hostel.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
