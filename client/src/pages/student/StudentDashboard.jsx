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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Student Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! View your outpass requests, check status, and history.
            </p>
          </div>
          <button
            onClick={() => navigate("/student/request")}
            className="btn btn-primary shadow-md hover:shadow-lg transition-shadow py-3 px-5 text-sm rounded-xl font-bold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
            </svg>
            Apply for Outpass
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 hover-lift flex items-center gap-4">
            <div className="p-3.5 bg-blue-50 text-[#003366] rounded-2xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{requests?.length || 0}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-0.5">Total Requests</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 hover-lift flex items-center gap-4">
            <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
              <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-amber-600">{pending.length}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-0.5">Pending</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 hover-lift flex items-center gap-4">
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-600">{approved.length}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-0.5">Approved</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 hover-lift flex items-center gap-4">
            <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-rose-600">{rejected.length}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-0.5">Rejected</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <section className="lg:col-span-2 space-y-6">
            {/* Pending Outpasses */}
            <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-base font-bold text-gray-900">
                  Pending Outpasses
                </h2>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full uppercase">
                  {pending.length} pending
                </span>
              </div>

              <div className="p-6">
                {pending.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-semibold text-sm">No pending outpasses</p>
                    <p className="text-gray-400 text-xs mt-1">Apply for a new outpass to get started.</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {pending.map((r) => (
                      <li
                        key={r._id}
                        onClick={() =>
                          navigate(`/student/outpass/${r._id}`, {
                            state: { outpass: r },
                          })
                        }
                        className="bg-amber-50/40 border border-amber-100/70 hover:border-amber-200 rounded-xl p-4 flex items-center justify-between hover-lift cursor-pointer"
                      >
                        <div className="min-w-0 flex-1 mr-4">
                          <div className="font-bold text-gray-800 text-sm md:text-base truncate">
                            {r.reason}
                          </div>
                          <div className="text-xs font-medium text-gray-500 mt-1 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
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
            <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-base font-bold text-gray-900">
                  Previous Outpasses
                </h2>
                <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full uppercase">
                  {previous.length} total
                </span>
              </div>

              <div className="p-6">
                {previous.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-semibold text-sm">No previous outpasses</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {previous.map((r) => (
                      <li
                        key={r._id}
                        className="border border-gray-100 rounded-xl p-4 hover:border-gray-200/80 hover:bg-gray-50/60 transition-all cursor-pointer hover-lift"
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
                            <div className="font-bold text-gray-800 text-sm md:text-base truncate">
                              {r.reason}
                            </div>
                            <div className="text-xs font-medium text-gray-500 mt-1 flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
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
                              className="btn btn-sm btn-outline rounded-lg text-xs"
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
          <aside className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Summary</h3>
              <div className="mt-4 space-y-3.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Total Applications</span>
                  <span className="font-bold text-gray-900">{requests?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-gray-50 pt-3">
                  <span className="text-gray-500 font-medium">Pending Review</span>
                  <span className="font-bold text-amber-600">{pending.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-gray-50 pt-3">
                  <span className="text-gray-500 font-medium">Approved Outpasses</span>
                  <span className="font-bold text-emerald-600">{approved.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-gray-50 pt-3">
                  <span className="text-gray-500 font-medium">Rejected Outpasses</span>
                  <span className="font-bold text-rose-600">{rejected.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-blue-50/50 pointer-events-none -z-10">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Need Help?</h3>
              <p className="text-xs text-gray-500 mt-2.5 leading-relaxed">
                If your outpass status is pending for a long time, please reach out to your Hostel Warden's office with your enrollment details.
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
