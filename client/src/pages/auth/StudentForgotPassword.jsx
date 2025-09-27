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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-gray-100 rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter your registered email and we'll send a password reset link.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="your.email@nith.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-200 rounded-md"
            />
            <button className="btn btn-md btn-blue" disabled={sending}>
              {sending ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
