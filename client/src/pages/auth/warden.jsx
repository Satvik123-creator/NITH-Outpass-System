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
  const [otp, setOtp] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);

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
      toast.error("Invalid email, please enter NITH Hamirpur email Id");
      return;
    }
    try {
      //send otp
      await axios.post(`${API_URL}/auth/send-otp`, { email });
      toast.success("OTP sent to your email");
      setIsSubmitted(true); //show otp input
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  const handleOtpSubmitted = async (e) => {
    e.preventDefault();
    try {
      //verify otp
      await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });

      //call signup function after otp verification
      await signup({
        name,
        employeeNo: employee,
        email,
        password,
        hostelName: hostelName,
        role: "warden",
      });
      toast.success("Signup successful");
      navigate("/warden/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  const options = [
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Welcome</h1>
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
            <p className="text-sm text-gray-300 mb-3 text-center">
              Please check your email id and enter the OTP
            </p>
            <form onSubmit={handleOtpSubmitted} className="flex flex-col gap-4">
              <input
                type="number"
                name="otp"
                placeholder="Enter the OTP"
                className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded-md font-medium"
              >
                Verify
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Login */}
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
                  onChange={(e) => setEmployee(e.target.value.toUpperCase())}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="w-full bg-green-600 hover:bg-green-700 transition-colors py-2 rounded-md font-medium">
                  Login
                </button>
              </form>
              <p
                className="mt-3 text-blue-400 hover:underline cursor-pointer text-sm text-center"
                onClick={() => navigate("/WardenForgotPassword")}
              >
                Forgot Password?
              </p>
            </div>

            {/* Register */}
            <div>
              <p className="text-sm mb-3">
                Still didn't register? Register Here
              </p>
              <form
                onSubmit={handleWardenRegister}
                className="flex flex-col gap-4"
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
                  onChange={(e) => setEmployee(e.target.value.toUpperCase())}
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
                  value={
                    options.find((opt) => opt.value === hostelName) || null
                  }
                  onChange={(selectedOption) =>
                    setHostelName(selectedOption?.value || "")
                  }
                  options={options}
                  isSearchable
                  placeholder="Select your hostel..."
                  className="text-black"
                />
                <button className="w-full bg-purple-600 hover:bg-purple-700 transition-colors py-2 rounded-md font-medium mt-2">
                  Register
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Warden;
