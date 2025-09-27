import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import AuthCard from "../../components/AuthCard";
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
  const [isSubmitted, setIsSubmitted] = useState(false); // waiting for OTP
  const [showRegister, setShowRegister] = useState(false); // toggle register
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <div className="text-center mb-6">
        <img
          src="/nith_logo.jpg"
          alt="NITH logo"
          className="mx-auto w-28 mb-4"
        />
        <h1 className="text-3xl font-bold">NITH Outpass Portal</h1>
        <h2 className="text-lg text-gray-300">
          Please login using your webkiosk credentials
        </h2>
      </div>

      <AuthCard>
        <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-6">
          {isSubmitted ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">
                Email Verification
              </h2>
              <p className="text-sm text-gray-300 mb-3 text-center">
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
                  className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <div className="flex gap-3">
                  <button type="submit" className="btn btn-md btn-blue w-full">
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
                <div className="mb-8">
                  <p className="text-sm mb-3">Already Registered? Login Now</p>
                  <form
                    onSubmit={handleWardenLogin}
                    className="flex flex-col gap-4"
                  >
                    <input
                      type="text"
                      placeholder="Employee Number"
                      className="w-full p-2 rounded-md bg-gray-700 text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) =>
                        setEmployee(e.target.value.toUpperCase())
                      }
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="text-blue-400 hover:underline text-sm"
                      onClick={() => setShowRegister(true)}
                    >
                      Don't have an account? Sign up
                    </button>
                    <button
                      className="text-blue-400 hover:underline text-sm"
                      onClick={() => navigate("/WardenForgotPassword")}
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm mb-3">Create a warden account</p>
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleWardenRegister}
                  >
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full p-2 rounded-md bg-gray-700 text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setName(e.target.value.toUpperCase())}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Employee Number"
                      className="w-full p-2 rounded-md bg-gray-700 text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) =>
                        setEmployee(e.target.value.toUpperCase())
                      }
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address (@nith.ac.in)"
                      className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </AuthCard>
    </div>
  );
};

export default Warden;
