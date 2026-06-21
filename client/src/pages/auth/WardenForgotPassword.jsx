import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/authAPI";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

export default function WardenForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setResetUrl("");
    try {
      const data = await forgotPassword(email);
      if (data?.resetUrl) {
        setResetUrl(data.resetUrl);
        toast.success("Password reset link generated!");
      } else {
        toast.success("Password reset email sent. Check your inbox.");
      }
      setEmail("");
    } catch (err) {
      const errMsg = err.response?.data?.errors
        ? err.response.data.errors.map((e) => e.msg).join(", ")
        : err.response?.data?.message || "Failed to send email";
      toast.error(errMsg);
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

          {resetUrl && (
            <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
              <p className="font-semibold mb-1">Development Reset Link:</p>
              <a
                href={resetUrl}
                target="_blank"
                rel="noreferrer"
                className="underline break-all font-mono hover:text-blue-900"
              >
                {resetUrl}
              </a>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login/warden")}
              className="text-[#003366] hover:underline text-sm font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
