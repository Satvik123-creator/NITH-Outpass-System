import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F8FAFC]">
      {/* Glow blobs */}
      <div className="bg-blob bg-blob-primary -top-20 -left-20" />
      <div className="bg-blob bg-blob-secondary -bottom-20 -right-20" />

      {/* Top bar */}
      <div className="bg-gradient-to-r from-[#003366] to-[#001a33] text-white relative z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/nith_logo.jpg"
              alt="NITH"
              className="w-10 h-10 rounded-full border-2 border-white/20"
            />
            <div>
              <div className="text-lg font-bold tracking-tight">NITH Outpass</div>
              <div className="text-xs text-blue-200/80">Student & Warden Portal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 sm:px-6">
        <div className="max-w-2xl w-full py-12 animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-block relative">
              <img
                src="/nith_logo.jpg"
                alt="NITH Logo"
                className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-xl mb-6 relative z-10"
              />
              <div className="absolute inset-0 bg-[#003366] rounded-full blur-md opacity-25 -z-10 transform scale-90" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#003366] tracking-tight">
              NIT Hamirpur
            </h1>
            <h2 className="text-lg md:text-xl font-semibold text-[#00509E] mt-1.5">
              Outpass Management System
            </h2>
            <p className="mt-4 text-gray-500 max-w-md mx-auto leading-relaxed text-sm sm:text-base">
              Submit and manage outpass requests online. Select your portal role below to get started.
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <button
              onClick={() => navigate("/login/student")}
              className="group bg-white rounded-2xl border border-gray-100 shadow-md shadow-gray-200/50 hover:shadow-xl hover:border-[#003366]/20 p-8 text-center transition-all duration-300 hover-lift cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-blue-50/80 group-hover:bg-blue-100/50 transition-colors flex items-center justify-center shadow-inner">
                <svg className="w-8 h-8 text-[#003366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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
              className="group bg-white rounded-2xl border border-gray-100 shadow-md shadow-gray-200/50 hover:shadow-xl hover:border-[#003366]/20 p-8 text-center transition-all duration-300 hover-lift cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-blue-50/80 group-hover:bg-blue-100/50 transition-colors flex items-center justify-center shadow-inner">
                <svg className="w-8 h-8 text-[#003366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
