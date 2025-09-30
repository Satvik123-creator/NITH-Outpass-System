import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { getAllOutpasses, updateOutpass } from "../../api/wardenAPI";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import Navbar from "../../components/Navbar";

function formatDateTime(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch (e) {
    return dt;
  }
}

export default function WardenDashboard() {
  const { token, authUser } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await getAllOutpasses();
      const outpasses = res?.data || res || [];
      setRequests(outpasses);
    } catch (err) {
      console.error("Warden fetch error:", err);
      // swallow and show friendly message
      setRequests([]);
    }
  };

  useEffect(() => {
    // Wait until auth state is ready. If there's no token or user, don't fetch.
    if (!token) return;
    if (!authUser) {
      // auth still initializing; do nothing yet
      return;
    }

    // Defensive: if user is not a warden, show message and redirect
    if (authUser.role !== "warden") {
      toast.error("You do not have permission to access the warden dashboard");
      navigate("/");
      return;
    }

    fetchRequests();
  }, [token, authUser]);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Warden Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage and review student outpass requests for your hostel.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl shadow p-6 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-yellow-600">
                  Pending Outpasses
                </h2>
                <div className="text-sm text-gray-500">
                  {pending.length} pending
                </div>
              </div>

              <div className="mt-4">
                {pending.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No pending outpasses
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {pending.map((r) => (
                      <li
                        key={r._id}
                        className="group bg-yellow-50 hover:bg-yellow-100 border border-transparent hover:border-yellow-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition"
                      >
                        <div>
                          <div className="font-medium text-gray-800">
                            {r.reason || r.purpose}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Applied on: {formatDateTime(r.createdAt)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Student: {r.student?.name} •{" "}
                            {r.student?.enrollmentNo}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-3 sm:mt-0">
                          <button
                            onClick={() =>
                              navigate(`/warden/request/${r._id}`, {
                                state: { outpass: r },
                              })
                            }
                            className="btn btn-md btn-blue"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleUpdate(r._id, "approved")}
                            className="btn btn-md btn-green"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdate(r._id, "rejected")}
                            className="btn btn-md btn-red"
                          >
                            Reject
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Previous Outpasses
                </h2>
                <div className="text-sm text-gray-500">
                  {previous.length} total
                </div>
              </div>

              <div className="mt-4">
                {previous.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No previous outpasses
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {previous.map((r) => (
                      <li
                        key={r._id}
                        className="bg-white hover:bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between gap-4 transition"
                      >
                        <div>
                          <div className="font-medium text-gray-800">
                            {r.reason || r.purpose}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Applied on: {formatDateTime(r.createdAt)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {r.student?.name} • {r.student?.enrollmentNo}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              navigate(`/warden/request/${r._id}`, {
                                state: { outpass: r },
                              })
                            }
                            className="btn btn-md btn-blue"
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
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow">
                <h3 className="text-sm font-medium text-gray-700">Summary</h3>
                <div className="mt-3 text-2xl font-bold text-gray-900">
                  {requests?.length || 0}
                </div>
                <div className="text-sm text-gray-500">Total requests</div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow">
                <h3 className="text-sm font-medium text-gray-700">
                  Quick Actions
                </h3>
                <div className="mt-2 flex flex-col gap-2">
                  <button
                    onClick={fetchRequests}
                    className="btn btn-md btn-neutral"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
