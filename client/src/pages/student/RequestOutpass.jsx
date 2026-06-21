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

      <div className="min-h-screen bg-[#F8FAFC] py-10 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Official Portal Header */}
          <div className="text-center mb-8 border-b-2 border-[#003366] pb-4">
            <h1 className="text-2xl font-bold text-[#003366] tracking-wide uppercase">
              National Institute of Technology Hamirpur
            </h1>
            <h2 className="text-lg font-semibold text-gray-700 mt-1">
              Outpass Request Application Portal
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Please fill all fields accurately. Submissions are routed to your hostel warden for official clearance.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
            <form onSubmit={handleSubmit}>
              
              {/* Section 1: Candidate Particulars */}
              <div className="bg-[#003366]/5 px-6 py-3 border-b border-gray-200">
                <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wider">
                  1. Candidate Particulars
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 border-b border-gray-150">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] bg-white"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Enrollment No.
                  </label>
                  <input
                    type="text"
                    value={enrollment}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-gray-100 cursor-not-allowed font-semibold uppercase"
                    required
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Room No. & Hostel
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] bg-white"
                    placeholder="e.g. 214"
                  />
                </div>
              </div>

              {/* Section 2: Journey & Duration Details */}
              <div className="bg-[#003366]/5 px-6 py-3 border-b border-gray-200">
                <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wider">
                  2. Journey & Duration Details
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 border-b border-gray-150">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Leave Commences From
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Leave Concludes On
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Address on Leave
                  </label>
                  <input
                    type="text"
                    value={addressOnLeave}
                    onChange={(e) => setAddressOnLeave(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] bg-white"
                    placeholder="Enter complete address"
                  />
                </div>
              </div>

              {/* Section 3: Statement of Purpose */}
              <div className="bg-[#003366]/5 px-6 py-3 border-b border-gray-200">
                <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wider">
                  3. Statement of Purpose
                </h3>
              </div>
              <div className="p-6 border-b border-gray-150">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Detailed Reason for Requesting Leave
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={4}
                  placeholder="Provide brief details regarding the urgency or purpose of outpass request..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] bg-white resize-none"
                  required
                />
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-200">
                <div className="text-[11px] text-gray-500 font-medium">
                  Logged User: {authUser?.name} ({authUser?.role?.toUpperCase()})
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/student/dashboard")}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-[#003366] text-white rounded-md text-sm font-semibold hover:bg-[#002244] focus:outline-none focus:ring-2 focus:ring-[#003366]/20 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
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
