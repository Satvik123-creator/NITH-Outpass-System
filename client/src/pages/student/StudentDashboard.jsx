import React from "react";
import { useNavigate } from "react-router-dom";
import { useRequests } from "../../context/RequestContext";
import StatusBadge from "../../components/StatusBadge";
import Navbar from "../../components/Navbar"
export default function StudentDashboard() {
  const { requests } = useRequests();
  const navigate = useNavigate();

  const pending = Array.isArray(requests)
    ? requests.filter((r) => r.status === "pending")
    : [];
  const previous = Array.isArray(requests)
    ? requests.filter((r) => r.status !== "pending")
    : [];

  return (
    <div className="min-h-screen bg-gray-50  relative">
      <Navbar/>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Student Dashboard
        </h2>

        {/* Pending Outpasses */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-yellow-600 mb-4">
            Pending Outpasses
          </h3>
          {pending.length === 0 ? (
            <p className="text-gray-500 italic">No pending outpasses.</p>
          ) : (
            <ul className="space-y-3">
              {pending.map((r) => (
                <li
                  key={r._id}
                  className="flex justify-between items-center bg-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <span className="text-gray-700 font-medium">{r.reason}</span>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Previous Outpasses */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Previous Outpasses
          </h3>
          {previous.length === 0 ? (
            <p className="text-gray-500 italic">No previous outpasses.</p>
          ) : (
            <ul className="space-y-3">
              {previous.map((r) => (
                <li
                  key={r._id}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <span className="text-gray-700 font-medium">{r.reason}</span>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Floating Apply Button */}
      <button
        onClick={() => navigate("/student/request")}
        className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        + Apply for Outpass
      </button>
    </div>
  );
}
