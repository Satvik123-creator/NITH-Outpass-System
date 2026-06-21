import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Warden = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [name, setName] = useState("");
  const [employee, setEmployee] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hostelName, setHostelName] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

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

  const handleWardenLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login({
        employeeNo: employee,
        password,
        role: "warden",
      });

      // Defensive check: ensure the returned user is actually a warden
      if (!user || user.role !== "warden") {
        toast.error(
          "You do not have permission to access the warden dashboard"
        );
        return;
      }

      toast.success("Login successful");
      navigate("/warden/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleWardenRegister = async (e) => {
    e.preventDefault();
    if (!email.endsWith("@nith.ac.in")) {
      toast.error("Invalid email, please enter NITH email Id");
      return;
    }
    setDevOtp("");
    try {
      const res = await axios.post(`${API_URL}/auth/send-otp`, { email });
      if (res.data?.otp) {
        setDevOtp(res.data.otp);
        toast.success("OTP generated (development mode)!");
      } else {
        toast.success("OTP sent to your email");
      }
      setIsSubmitted(true);
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  const handleOtpSubmitted = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
      await signup({
        name,
        employeeNo: employee,
        email,
        password,
        hostelName,
        role: "warden",
      });
      toast.success("Signup successful");
      navigate("/warden/dashboard");
    } catch (error) {
      console.error("Warden signup failed:", error);
      const errMsg = error.response?.data?.errors
        ? error.response.data.errors.map((err) => err.msg).join(", ")
        : error.response?.data?.message || "Signup failed";
      toast.error(errMsg);
    }
  };

  const handleHostelChange = (opt) => {
    setSelectedOption(opt);
    setHostelName(opt?.value || "");
  };

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
                Warden Access Point
              </p>
            </div>

            {isSubmitted ? (
              <div>
                <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
                  Email Verification
                </h2>
                <p className="text-sm text-gray-500 mb-5 text-center">
                  Please check your NITH email and enter the verification code.
                </p>
                <form
                  onSubmit={handleOtpSubmitted}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="number"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus-ring placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  {devOtp && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 text-center font-mono">
                      Development OTP: <span className="font-bold">{devOtp}</span>
                    </div>
                  )}
                  <div className="flex gap-3 mt-2">
                    <button
                      type="submit"
                      className="btn btn-md btn-primary w-full shadow-sm"
                    >
                      Verify
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="btn btn-md btn-neutral w-full"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {!showRegister ? (
                  <div className="mb-2">
                    <p className="text-sm font-semibold mb-4 text-gray-600">
                      Login to your account
                    </p>
                    <form
                      onSubmit={handleWardenLogin}
                      className="flex flex-col gap-4"
                    >
                      <input
                        type="text"
                        placeholder="Employee Number"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 uppercase focus-ring placeholder-gray-400"
                        onChange={(e) =>
                          setEmployee(e.target.value.toUpperCase())
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
                        onClick={() => navigate("/WardenForgotPassword")}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold mb-4 text-gray-600">
                      Create a warden account
                    </p>
                    <form
                      className="flex flex-col gap-4"
                      onSubmit={handleWardenRegister}
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
                        placeholder="Employee Number"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 uppercase focus-ring placeholder-gray-400"
                        onChange={(e) =>
                          setEmployee(e.target.value.toUpperCase())
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
                        <label className="text-sm font-semibold text-gray-600">Hostel No.</label>
                        <Select
                          value={selectedOption}
                          onChange={handleHostelChange}
                          options={hostelOptions}
                          isSearchable
                          placeholder="Select your hostel..."
                          className="text-sm"
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 12,
                            colors: {
                              ...theme.colors,
                              primary: "#003366",
                            }
                          })}
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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Warden;
