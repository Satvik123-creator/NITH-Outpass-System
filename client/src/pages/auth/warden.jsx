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
      await login({ employeeNo: employee, password, role: "warden" });
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
    try {
      await axios.post(`${API_URL}/auth/send-otp`, { email });
      toast.success("OTP sent to your email");
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
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  const handleHostelChange = (opt) => {
    setSelectedOption(opt);
    setHostelName(opt?.value || "");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      <div className="w-full md:w-[40%] bg-gradient-to-b from-[#0b5fff] to-[#071133] text-white flex flex-col items-center md:items-start justify-center p-8 md:p-10 md:pl-12">
        <h1 className="text-4xl md:text-4xl font-bold text-white tracking-widest uppercase mb-2">
          Computer Center
        </h1>

        <h3 className="text-xl md:text-2xl font-medium text-white tracking-wide">
          NIT Hamirpur
        </h3>
      </div>

      <div className="w-full md:w-[60%] flex items-center justify-center min-h-screen p-8 md:p-10 bg-gradient-to-b from-gray-50 to-white">
        {/* centered logo overlapping the split - responsive placement */}
        <img
          src="/nith_logo.jpg"
          alt="NITH Logo"
          className="absolute left-4 top-4 md:left-[40%] md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-20 md:w-32 lg:w-40 h-20 md:h-32 lg:h-40 rounded-full border-4 border-white shadow-lg z-20"
        />

        <main className="max-w-md w-full px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="bg-white border border-gray-100 rounded-2xl shadow p-6  ">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                NITH Outpass Portal
              </h1>
              <p className="text-sm text-gray-500">
                Please login using your webkiosk credentials
              </p>
            </div>

            {isSubmitted ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Email Verification
                </h2>
                <p className="text-sm text-gray-600 mb-3 text-center">
                  Please check your email id and enter the OTP
                </p>
                <form
                  onSubmit={handleOtpSubmitted}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="number"
                    name="otp"
                    placeholder="Enter the OTP"
                    className="w-full p-2 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="btn btn-md btn-blue w-full"
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
                  <div className="mb-6">
                    <p className="text-sm mb-3 text-gray-600">
                      Already Registered? Login Now
                    </p>
                    <form
                      onSubmit={handleWardenLogin}
                      className="flex flex-col gap-4"
                    >
                      <input
                        type="text"
                        placeholder="Employee Number"
                        className="w-full p-2 border border-gray-200 rounded-md text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) =>
                          setEmployee(e.target.value.toUpperCase())
                        }
                        required
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="submit"
                        className="btn btn-md btn-green w-full"
                      >
                        Login
                      </button>
                    </form>
                    <div className="mt-3 flex justify-between items-center">
                      <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => setShowRegister(true)}
                      >
                        Don't have an account? Sign up
                      </button>
                      <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => navigate("/WardenForgotPassword")}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm mb-3 text-gray-600">
                      Create a warden account
                    </p>
                    <form
                      className="flex flex-col gap-4"
                      onSubmit={handleWardenRegister}
                    >
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-2 border border-gray-200 rounded-md text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setName(e.target.value.toUpperCase())}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Employee Number"
                        className="w-full p-2 border border-gray-200 rounded-md text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) =>
                          setEmployee(e.target.value.toUpperCase())
                        }
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email Address (@nith.ac.in)"
                        className="w-full p-2 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <label className="text-sm font-medium">Hostel No.</label>
                      <Select
                        value={selectedOption}
                        onChange={handleHostelChange}
                        options={hostelOptions}
                        isSearchable
                        placeholder="Select your hostel..."
                        className="text-black"
                      />
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="btn btn-md btn-accent w-full"
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
