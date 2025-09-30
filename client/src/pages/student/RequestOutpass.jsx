import React, { useState } from "react";
import { useRequests } from "../../context/RequestContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function OutpassForm() {
  const { authUser } = useAuth();
  const { requestOutpass, loading } = useRequests();
  const navigate = useNavigate();

  // form fields
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-3xl w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-100 rounded-2xl shadow p-6 md:p-10">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Apply for Outpass
            </h1>
            <p className="text-sm text-gray-500">
              Fill the form below to request an outpass
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Full Name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Enrollment No.
                </label>
                <input
                  value={enrollment}
                  onChange={(e) => setEnrollment(e.target.value.toUpperCase())}
                  className="w-full p-2 border border-gray-200 rounded-md text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="23BCSxxx"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Room Number
                </label>
                <input
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Room No"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-sm text-gray-700 mb-1 block">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Address on Leave
                </label>
                <input
                  value={addressOnLeave}
                  onChange={(e) => setAddressOnLeave(e.target.value)}
                  placeholder="Address where you will stay while on leave"
                  className="w-full p-2 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-1 block">
                Purpose of Leave
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={4}
                placeholder="Reason / purpose (eg. medical, personal, family function, etc.)"
                className="w-full p-3 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-md btn-blue w-auto"
              >
                {loading ? "Submitting..." : "Apply"}
              </button>

              <div className="text-sm text-gray-600">
                <div>
                  Submitted as:{" "}
                  <span className="font-medium">
                    {authUser?.name || "Student"}
                  </span>
                </div>
                <div className="text-xs mt-1">
                  Status will be visible in your dashboard
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
