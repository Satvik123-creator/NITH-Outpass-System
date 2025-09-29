import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleWardenClick = () => navigate("/login/warden");
  const handleStudentClick = () => navigate("/login/student");

  return (
   <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200">
  {/* Main Content */}
  <div className="relative z-10 text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl max-w-lg w-11/12">
    <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
      WELCOME TO NITH OUTPASS PORTAL
    </h1>
    <h2 className="text-lg md:text-xl font-medium mb-8 text-gray-700">
      Who are you?
    </h2>

    <div className="flex flex-col md:flex-row justify-center gap-6">
      <div
        onClick={handleWardenClick}
        className="w-full md:w-40 px-6 py-4 bg-blue-600 text-white rounded-lg shadow-md cursor-pointer hover:scale-105 hover:shadow-lg transform transition duration-300"
      >
        <p className="font-semibold">WARDEN</p>
      </div>
      <div
        onClick={handleStudentClick}
        className="w-full md:w-40 px-6 py-4 bg-green-600 text-white rounded-lg shadow-md cursor-pointer hover:scale-105 hover:shadow-lg transform transition duration-300"
      >
        <p className="font-semibold">STUDENT</p>
      </div>
    </div>
  </div>
</div>

  );
}
