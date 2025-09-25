import React from "react";
import { useNavigate } from "react-router-dom";
export default function Home() {

  const navigate = useNavigate();

  const handleWardenClick = () => {
    navigate("/login/warden");
  };
  const handleStudentClick = () => {
    navigate("/login/student");
  };  
  return (
   <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-30"
    style={{ backgroundImage: "url('/nith_bg-img.jpg')" }}
  ></div>

  {/* Main Content */}
  <div className="relative z-10 text-center p-6 bg-white/70 rounded-lg shadow-lg max-w-lg">
    <h1 className="text-3xl font-bold mb-4 text-gray-800">WELCOME TO NITH OUT PASS PORTAL</h1>
    <h2 className="text-xl font-semibold mb-6 text-gray-700">Who are you?</h2>

    <div className="flex justify-center gap-8">
      {/* Warden */}
      <div
        className="flex flex-col items-center cursor-pointer hover:scale-105 transform transition duration-300"
        onClick={handleWardenClick}
      >
        {/* <FontAwesomeIcon icon={faUser} size="3x" className="text-gray-800" /> */}
        <p className="mt-2 font-medium text-gray-700">WARDEN</p>
      </div>

      {/* Student */}
      <div
        className="flex flex-col items-center cursor-pointer hover:scale-105 transform transition duration-300"
        onClick={handleStudentClick}
      >
        {/* <FontAwesomeIcon icon={faUser} size="3x" className="text-gray-800" /> */}
        <p className="mt-2 font-medium text-gray-700">STUDENT</p>
      </div>
    </div>
  </div>
</div>

  );
}
