import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RequestProvider } from "./context/RequestContext";

import Home from "./pages/Home";
import Warden from "./pages/auth/warden";
import Student from "./pages/auth/student";
import StudentDashboard from "./pages/student/StudentDashboard";
import WardenDashboard from "./pages/warden/WardenDashboard";
import RequestOutpass from "./pages/student/RequestOutpass";
import RequestDetails from "./pages/warden/RequestDetails";
import StudentRequestDetails from "./pages/student/StudentRequestDetails";
import StudentForgotPassword from "./pages/auth/StudentForgotPassword";
import WardenForgotPassword from "./pages/auth/WardenForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";


import "./App.css"; // Tailwind CSS import
function App() {
  return (
    <AuthProvider>
      <RequestProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login/warden" element={<Warden />} />
            <Route path="/login/student" element={<Student />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/warden/dashboard" element={<WardenDashboard />} />
            <Route path="/warden/request/:id" element={<RequestDetails />} />
            <Route
              path="/student/outpass/:id"
              element={<StudentRequestDetails />}
            />
            <Route path="/student/request" element={<RequestOutpass />} />
            <Route
              path="/StudentForgotPassword"
              element={<StudentForgotPassword />}
            />
            <Route
              path="/WardenForgotPassword"
              element={<WardenForgotPassword />}
            />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </Router>
      </RequestProvider>
    </AuthProvider>
  );
}

export default App;
