import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Student = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [name, setName] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hostel, setHostel] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ enrollmentNo: enrollment, password, role: "student" });
      toast.success("Login successful");
      navigate("/student/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleStudentRegister = async (e) => {
    e.preventDefault();
    if (!email.endsWith("@nith.ac.in")) {
      toast.error("Invalid email, please enter NITH email Id");
      return;
    }

    try {
      await signup({
        name,
        enrollmentNo: enrollment,
        email,
        password,
        hostelName: hostel,
        role: "student",
      });
      toast.success("Signup successful");
      navigate("/student/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  const handleHostelChange = (opt) => {
    setSelectedOption(opt);
    setHostel(opt?.value || "");
  };

  const hostelOptions = [
    { value: "Kailash Boys Hostel", label: "Kailash Boys Hostel" },
    { value: "Shivalik Boys Hostel", label: "Shivalik Boys Hostel" },
    { value: "Dhauladhar Boys Hostel", label: "Dhauladhar Boys Hostel" },
    { value: "Vindhyachal Boys Hostel", label: "Vindhyachal Boys Hostel" },
    { value: "Neelkanth Boys Hostel", label: "Neelkanth Boys Hostel" },
    { value: "Himadri Hostel", label: "Himadri Hostel" },
    { value: "Himgiri Hostel", label: "Himgiri Hostel" },
    { value: "Udaygiri Hostel", label: "Udaygiri Hostel" },
    { value: "Parvati Girls Hostel", label: "Parvati Girls Hostel" },
    { value: "Ambika Girls Hostel", label: "Ambika Girls Hostel" },
    { value: "Aravali Hostel (Girls)", label: "Aravali Hostel (Girls)" },
    { value: "Manimahesh Girls Hostel", label: "Manimahesh Girls Hostel" },
    { value: "Satpura Hostel", label: "Satpura Hostel" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-gray-50">
      {/* Sidebar background gradient & blur blobs */}
      <div className="w-full md:w-[40%] bg-gradient-to-br from-[#003366] to-[#00152c] text-white flex flex-col items-center md:items-start justify-center p-10 md:pl-16 relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#00509E,transparent_60%)] opacity-45 pointer-events-none" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-widest uppercase mb-2">
          Computer Center
        </h1>
        <h3 className="text-lg md:text-xl font-medium text-blue-200/90 tracking-wide">
          NIT Hamirpur
        </h3>
        
        {/* NITH Logo on dividing boundary */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 md:bottom-auto md:left-auto md:right-0 md:top-1/2 md:translate-x-1/2 md:-translate-y-1/2 z-20">
          <img
            src="/nith_logo.jpg"
            alt="NITH Logo"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg bg-white"
          />
        </div>
      </div>

      <div className="w-full md:w-[60%] flex items-center justify-center min-h-screen p-6 sm:p-10 relative z-10">
        <main className="max-w-md w-full px-4 animate-slide-up">
          <div className="bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/40 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                NITH Outpass Portal
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Student Access Point
              </p>
            </div>

            {!showRegister ? (
              <div className="mb-2">
                <p className="text-sm font-semibold mb-4 text-gray-600">
                  Login to your account
                </p>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleStudentLogin}
                >
                  <input
                    type="text"
                    placeholder="Enrollment Number"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 uppercase focus-ring placeholder-gray-400"
                    onChange={(e) =>
                      setEnrollment(e.target.value.toUpperCase())
                    }
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus-ring placeholder-gray-400"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-md btn-primary w-full shadow-md mt-2"
                  >
                    Login
                  </button>
                </form>
                <div className="mt-5 flex justify-between items-center text-xs sm:text-sm">
                  <button
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
                    onClick={() => setShowRegister(true)}
                  >
                    Don't have an account? Sign up
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
                    onClick={() => navigate("/StudentForgotPassword")}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold mb-4 text-gray-600">
                  Create a student account
                </p>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleStudentRegister}
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 uppercase focus-ring placeholder-gray-400"
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Enrollment Number"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 uppercase focus-ring placeholder-gray-400"
                    onChange={(e) =>
                      setEnrollment(e.target.value.toUpperCase())
                    }
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address (@nith.ac.in)"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus-ring placeholder-gray-400"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus-ring placeholder-gray-400"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="hostel" className="text-sm font-semibold text-gray-600">
                      Hostel No.
                    </label>
                    <Select
                      value={selectedOption}
                      onChange={handleHostelChange}
                      options={hostelOptions}
                      placeholder="Select your hostel.."
                      className="text-sm"
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 12,
                        colors: {
                          ...theme.colors,
                          primary: "#003366",
                        }
                      })}
                      required
                    />
                  </div>
                  <div className="flex gap-3 mt-3">
                    <button
                      type="submit"
                      className="btn btn-md btn-primary w-full shadow-sm"
                    >
                      Register
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRegister(false)}
                      className="btn btn-md btn-neutral w-full"
                    >
                      Back
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Student;
