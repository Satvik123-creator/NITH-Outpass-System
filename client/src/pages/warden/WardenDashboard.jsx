import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllOutpasses, updateOutpass } from "../../api/wardenAPI";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";

export default function WardenDashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const data = await getAllOutpasses(token);
    setRequests(data);
  };

  useEffect(() => {
    if (token) fetchRequests();
  }, [token]);

  const handleUpdate = async (id, status) => {
    await updateOutpass(id, status, token);
    fetchRequests();
  };

  const pending = Array.isArray(requests)
    ? requests.filter((r) => r.status === "pending")
    : [];
  const previous = Array.isArray(requests)
    ? requests.filter((r) => r.status !== "pending")
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Warden Dashboard
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
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="text-gray-700 font-medium">
                      {r.reason || r.purpose}
                    </p>
                    <p className="text-sm text-gray-500">
                      Applied on: {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0 flex gap-3">
                    <button
                      onClick={() => navigate(`/warden/request/${r._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleUpdate(r._id, "approved")}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdate(r._id, "rejected")}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      Reject
                    </button>
                  </div>
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
                  <div>
                    <p className="text-gray-700 font-medium">
                      {r.reason || r.purpose}
                    </p>
                    <p className="text-sm text-gray-500">
                      Applied on: {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/warden/request/${r._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      View
                    </button>
                    <StatusBadge status={r.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
