import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { getOutpassById, updateOutpass } from "../../api/wardenAPI";
import Navbar from "../../components/Navbar";
import StatusBadge from "../../components/StatusBadge";

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [outpass, setOutpass] = useState(location.state?.outpass || null);

  useEffect(() => {
    if (!id) return;
    if (outpass && outpass.student && outpass.student.email) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getOutpassById(id, token);
        setOutpass(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load outpass");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, token]);

  const handleDecision = async (status) => {
    if (!id) return;
    try {
      await updateOutpass(id, status, token);
      toast.success(`Outpass ${status}`);
      navigate("/warden/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update outpass");
    }
  };

  if (!outpass && !loading) return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Outpass not found</p>
      </div>
    </div>
  );

  const fmt = (d) => {
    try {
      return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    } catch (e) {
      return d;
    }
  };

  const steps = [
    { label: "Request Submitted", done: true, current: false },
    { label: "Pending Approval", done: outpass.status !== "pending", current: outpass.status === "pending" },
    {
      label: outpass.status === "rejected" ? "Request Rejected" : "Request Approved",
      done: outpass.status === "approved" || outpass.status === "rejected",
      current: false,
      isRejected: outpass.status === "rejected"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md overflow-hidden animate-slide-up">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Outpass Request Details
            </h2>
            <StatusBadge status={outpass.status} />
          </div>

          {/* Timeline Stepper */}
          <div className="px-6 py-6 border-b border-gray-100 bg-gray-50/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {steps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${
                      step.isRejected
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : step.done
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : step.current
                        ? "bg-amber-50 text-amber-700 border-amber-300 animate-pulse"
                        : "bg-gray-50 text-gray-400 border-gray-200"
                    }`}>
                      {step.isRejected ? "✕" : idx + 1}
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${
                        step.isRejected
                          ? "text-rose-700"
                          : step.done
                          ? "text-emerald-700"
                          : step.current
                          ? "text-amber-700"
                          : "text-gray-400"
                      }`}>{step.label}</p>
                    </div>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block flex-1 h-0.5 bg-gray-200/80 mx-2" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Student Details */}
          <div className="px-6 py-6 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Student Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">{outpass.student?.name}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Enrollment</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">{outpass.student?.enrollmentNo}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</span>
                <p className="text-sm font-semibold text-gray-900 mt-1 truncate">{outpass.student?.email}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hostel</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">{outpass.student?.hostelName}</p>
              </div>
            </div>
          </div>

          {/* Outpass Details */}
          <div className="px-6 py-6 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Leave Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">From Date</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">{fmt(outpass.fromDate || outpass.from)}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">To Date</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">{fmt(outpass.toDate || outpass.to)}</p>
              </div>
            </div>
            <div className="mt-5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Purpose of Leave</span>
              <p className="text-sm text-gray-900 mt-1.5 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{outpass.reason || outpass.purpose}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-5 bg-gray-50/80 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-neutral rounded-xl px-5 font-bold"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>

            {outpass.status === "pending" && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleDecision("rejected")}
                  className="btn btn-red rounded-xl px-5 font-bold flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
                <button
                  onClick={() => handleDecision("approved")}
                  className="btn btn-green rounded-xl px-5 font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
