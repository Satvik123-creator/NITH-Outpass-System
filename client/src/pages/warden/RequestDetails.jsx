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

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Outpass Request Details
            </h2>
            <StatusBadge status={outpass.status} />
          </div>

          {/* Student Details */}
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Student Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Name</span>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{outpass.student?.name}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Enrollment</span>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{outpass.student?.enrollmentNo}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Email</span>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{outpass.student?.email}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Hostel</span>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{outpass.student?.hostelName}</p>
              </div>
            </div>
          </div>

          {/* Outpass Details */}
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Leave Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">From</span>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{fmt(outpass.fromDate || outpass.from)}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">To</span>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{fmt(outpass.toDate || outpass.to)}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Purpose</span>
              <p className="text-sm text-gray-900 mt-0.5">{outpass.reason || outpass.purpose}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 flex gap-3">
            <button
              onClick={() => handleDecision("approved")}
              className="btn btn-green"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <button
              onClick={() => handleDecision("rejected")}
              className="btn btn-red"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-neutral"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
