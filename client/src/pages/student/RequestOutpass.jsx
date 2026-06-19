import React, { useState } from "react";
import { useRequests } from "../../context/RequestContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function OutpassForm() {
  const { authUser } = useAuth();
  const { requestOutpass, loading } = useRequests();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(authUser?.name || "");
  const [enrollment, setEnrollment] = useState(authUser?.enrollmentNo || "");
  const [room, setRoom] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [addressOnLeave, setAddressOnLeave] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purpose || !fromDate || !toDate) {
      toast.error("Please fill required fields (dates & purpose).");
      return;
    }

    try {
      const data = await requestOutpass({
        reason: purpose,
        fromDate,
        toDate,
        roomNumber: room,
        addressOnLeave,
      });
      if (data) {
        toast.success("Outpass requested successfully!");
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while applying.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#F5F7FA] py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Apply for Outpass
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to submit an outpass request for review.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <form onSubmit={handleSubmit}>
              {/* Section: Personal Information */}
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-500 mt-0.5">Your basic details</p>
              </div>
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] bg-white"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Enrollment No.
                    </label>
                    <input
                      value={enrollment}
                      onChange={(e) =>
                        setEnrollment(e.target.value.toUpperCase())
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 uppercase placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] bg-gray-50"
                      placeholder="23BCSxxx"
                      required
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Room Number
                    </label>
                    <input
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] bg-white"
                      placeholder="Room No"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Leave Details */}
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Leave Details</h2>
                <p className="text-sm text-gray-500 mt-0.5">Duration and address while on leave</p>
              </div>
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Address on Leave
                    </label>
                    <input
                      value={addressOnLeave}
                      onChange={(e) => setAddressOnLeave(e.target.value)}
                      placeholder="Address while on leave"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Purpose */}
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Purpose of Leave</h2>
                <p className="text-sm text-gray-500 mt-0.5">Briefly describe the reason for your leave</p>
              </div>
              <div className="px-6 py-5">
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={4}
                  placeholder="Reason / purpose (eg. medical, personal, family function, etc.)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] bg-white resize-none"
                  required
                />
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Submitting as <span className="font-medium text-gray-700">{authUser?.name || "Student"}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/student/dashboard")}
                    className="btn btn-neutral"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
