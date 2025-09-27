import React from "react";
import { useNavigate } from "react-router-dom";
import { useRequests } from "../../context/RequestContext";
import StatusBadge from "../../components/StatusBadge";
import Navbar from "../../components/Navbar";

function formatRange(outpass) {
  const from = new Date(outpass.fromDate || outpass.from);
  const to = new Date(outpass.toDate || outpass.to);
  const opts = { year: "numeric", month: "short", day: "numeric" };
  return `${from.toLocaleDateString(undefined, opts)} • ${to.toLocaleDateString(
    undefined,
    opts
  )}`;
}

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Student Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              View your outpass requests, status and history.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigate("/student/request")}
              className="inline-flex items-center gap-2 px-4 py-2 btn-primary text-white rounded-md shadow"
            >
              + Apply for Outpass
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Pending */}
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
                        className="group bg-yellow-50 hover:bg-yellow-100 border border-transparent hover:border-yellow-200 p-4 rounded-xl flex items-center justify-between transition cursor-default"
                      >
                        <div>
                          <div className="font-medium text-gray-800">
                            {r.reason}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {formatRange(r)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={r.status} />
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
                        onClick={() => navigate(`/student/outpass/${r._id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            navigate(`/student/outpass/${r._id}`);
                        }}
                        className="cursor-pointer group bg-white hover:bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between gap-4 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <div>
                          <div className="font-medium text-gray-800">
                            {r.reason}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {formatRange(r)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={r.status} />
                          <svg
                            className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            ></path>
                          </svg>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Right column: Summary / Quick info */}
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
                  Need help?
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Contact the wardens office for queries about approvals.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile floating apply button */}
      <button
        onClick={() => navigate("/student/request")}
        className="fixed bottom-6 right-6 sm:hidden bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        aria-label="Apply for outpass"
      >
        +
      </button>
    </div>
  );
}
