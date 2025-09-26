import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const Student = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [name, setName] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hostel, setHostel] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // whether OTP sent and waiting for code
  const [showRegister, setShowRegister] = useState(false); // toggle between login and register
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
      await axios.post(`${API_URL}/auth/send-otp`, { email });
      toast.success("OTP sent to your email");
      setIsSubmitted(true);
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  const handleOtpSubmitted = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
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
      toast.error(err.response?.data?.message || "OTP verification failed");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
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

      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-6">
        {isSubmitted ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Email Verification
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Please check your email id and enter the OTP
            </p>
            <form onSubmit={handleOtpSubmitted} className="flex flex-col gap-4">
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
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded-md font-medium"
                >
                  Verify
                </button>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-gray-600 hover:bg-gray-700 transition-colors py-2 rounded-md"
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
                <p className="text-sm mb-3">Registered Student? Login Now</p>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleStudentLogin}
                >
                  <input
                    type="text"
                    placeholder="Enrollment Number"
                    className="w-full p-2 rounded-md bg-gray-700 text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) =>
                      setEnrollment(e.target.value.toUpperCase())
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
                    className="w-full bg-green-600 hover:bg-green-700 transition-colors py-2 rounded-md font-medium"
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
                    onClick={() => navigate("/StudentForgotPassword")}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm mb-3">Create a student account</p>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleStudentRegister}
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
                    placeholder="Enrollment Number"
                    className="w-full p-2 rounded-md bg-gray-700 text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) =>
                      setEnrollment(e.target.value.toUpperCase())
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
                  <label htmlFor="hostel" className="text-sm font-medium">
                    Hostel No.
                  </label>
                  <Select
                    value={selectedOption}
                    onChange={handleHostelChange}
                    options={hostelOptions}
                    placeholder="Select your hostel.."
                    required
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 transition-colors py-2 rounded-md font-medium"
                    >
                      Register
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRegister(false)}
                      className="w-full bg-gray-600 hover:bg-gray-700 transition-colors py-2 rounded-md"
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
    </div>
  );
};

export default Student;
