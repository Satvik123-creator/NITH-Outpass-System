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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-gray-100 rounded-2xl shadow p-6">
          <div className="text-center mb-4">
            <img
              src="/nith_logo.jpg"
              alt="NITH logo"
              className="mx-auto w-20 mb-3"
            />
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
              <p className="text-sm text-gray-600 mb-3">
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
                <div className="mb-6">
                  <p className="text-sm mb-3 text-gray-600">
                    Registered Student? Login Now
                  </p>
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleStudentLogin}
                  >
                    <input
                      type="text"
                      placeholder="Enrollment Number"
                      className="w-full p-2 border border-gray-200 rounded-md text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) =>
                        setEnrollment(e.target.value.toUpperCase())
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
                      className="text-blue-600 hover:underline text-sm cursor-pointer"
                      onClick={() => setShowRegister(true)}
                    >
                      Don't have an account? Sign up
                    </button>
                    <button
                      className="text-blue-600 hover:underline text-sm cursor-pointer"
                      onClick={() => navigate("/StudentForgotPassword")}
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm mb-3 text-gray-600">
                    Create a student account
                  </p>
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleStudentRegister}
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
                      placeholder="Enrollment Number"
                      className="w-full p-2 border border-gray-200 rounded-md text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) =>
                        setEnrollment(e.target.value.toUpperCase())
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
  );
};

export default Student;
