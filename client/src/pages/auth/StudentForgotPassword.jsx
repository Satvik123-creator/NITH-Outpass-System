import React, { useState } from "react";
import { forgotPassword } from "../../api/authAPI";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

export default function StudentForgotPassword() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await forgotPassword(email);
      toast.success("Password reset email sent. Check your inbox.");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Forgot Password</h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter your registered email and we'll send a password reset link.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="your.email@nith.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
            />
            <button className="btn btn-primary w-full" disabled={sending}>
              {sending ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
