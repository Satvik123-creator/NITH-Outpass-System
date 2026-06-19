import React from "react";
import { useNavigate } from "react-router-dom";
import { useRequests } from "../../context/RequestContext";
import StatusBadge from "../../components/StatusBadge";
import Navbar from "../../components/Navbar";

function formatRange(outpass) {
  const from = new Date(outpass.fromDate || outpass.from);
  const to = new Date(outpass.toDate || outpass.to);
  const opts = { year: "numeric", month: "short", day: "numeric" };
  return `${from.toLocaleDateString(undefined, opts)} - ${to.toLocaleDateString(
    undefined,
    opts
  )}`;
}

function formatDateTime(dt) {
  try {
    return new Date(dt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch (e) {
    return dt;
  }
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
  const approved = Array.isArray(requests)
    ? requests.filter((r) => r.status === "approved")
    : [];
  const rejected = Array.isArray(requests)
    ? requests.filter((r) => r.status === "rejected")
    : [];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Student Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View your outpass requests, status and history.
            </p>
          </div>
          <button
            onClick={() => navigate("/student/request")}
            className="btn btn-primary shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Apply for Outpass
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="text-2xl font-bold text-gray-900">{requests?.length || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Total Requests</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="text-2xl font-bold text-amber-600">{pending.length}</div>
            <div className="text-sm text-gray-500 mt-1">Pending</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="text-2xl font-bold text-emerald-600">{approved.length}</div>
            <div className="text-sm text-gray-500 mt-1">Approved</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="text-2xl font-bold text-red-600">{rejected.length}</div>
            <div className="text-sm text-gray-500 mt-1">Rejected</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <section className="lg:col-span-2 space-y-6">
            {/* Pending Outpasses */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">
                  Pending Outpasses
                </h2>
                <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  {pending.length} pending
                </span>
              </div>

              <div className="p-6">
                {pending.length === 0 ? (
                  <div className="py-10 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-400 font-medium">No pending outpasses</p>
                    <p className="text-gray-400 text-sm mt-1">Apply for a new outpass to get started.</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {pending.map((r) => (
                      <li
                        key={r._id}
                        className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="min-w-0 flex-1 mr-4">
                          <div className="font-medium text-gray-900 truncate">
                            {r.reason}
                          </div>
                          <div className="text-sm text-gray-500 mt-0.5">
                            {formatRange(r)}
                          </div>
                        </div>
                        <StatusBadge status={r.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Previous Outpasses */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">
                  Previous Outpasses
                </h2>
                <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  {previous.length} total
                </span>
              </div>

              <div className="p-6">
                {previous.length === 0 ? (
                  <div className="py-10 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <p className="text-gray-400 font-medium">No previous outpasses</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {previous.map((r) => (
                      <li
                        key={r._id}
                        className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() =>
                          navigate(`/student/outpass/${r._id}`, {
                            state: { outpass: r },
                          })
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            navigate(`/student/outpass/${r._id}`, {
                              state: { outpass: r },
                            });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1 mr-4">
                            <div className="font-medium text-gray-900 truncate">
                              {r.reason}
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">
                              {formatRange(r)}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <StatusBadge status={r.status} />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/student/outpass/${r._id}`, {
                                  state: { outpass: r },
                                });
                              }}
                              className="btn btn-sm btn-outline"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Right column */}
          <aside className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Summary</h3>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="font-semibold text-gray-900">{requests?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Pending</span>
                  <span className="font-semibold text-amber-600">{pending.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Approved</span>
                  <span className="font-semibold text-emerald-600">{approved.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Rejected</span>
                  <span className="font-semibold text-red-600">{rejected.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Need Help?</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Contact the wardens office for queries about approvals.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile floating button */}
      <button
        onClick={() => navigate("/student/request")}
        className="fixed bottom-6 right-6 sm:hidden btn btn-primary rounded-full shadow-lg p-4"
        aria-label="Apply for outpass"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
