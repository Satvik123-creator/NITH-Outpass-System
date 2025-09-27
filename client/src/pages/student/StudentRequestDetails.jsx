import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { getOutpassById } from "../../api/studentAPI";
import Navbar from "../../components/Navbar";
import StatusBadge from "../../components/StatusBadge";

export default function StudentRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [outpass, setOutpass] = useState(null);

  useEffect(() => {
    if (!id) return;
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (!outpass) return <div className="p-6">Outpass not found</div>;

  const fmt = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch (e) {
      return d;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border border-gray-100 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Outpass Request Details
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-medium">Student</h3>
            <p className="text-sm text-gray-700">
              Name: {outpass.student?.name}
            </p>
            <p className="text-sm text-gray-700">
              Enrollment: {outpass.student?.enrollmentNo}
            </p>
            <p className="text-sm text-gray-700">
              Email: {outpass.student?.email}
            </p>
            <p className="text-sm text-gray-700">
              Hostel: {outpass.student?.hostelName}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium">Outpass Info</h3>
            <p className="text-sm text-gray-700">
              From: {fmt(outpass.fromDate || outpass.from)}
            </p>
            <p className="text-sm text-gray-700">
              To: {fmt(outpass.toDate || outpass.to)}
            </p>
            <p className="text-sm text-gray-700">
              Purpose: {outpass.reason || outpass.purpose}
            </p>
            <div className="mt-2">
              <span className="text-sm text-gray-600 mr-3">Status:</span>
              <StatusBadge status={outpass.status} />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-md btn-neutral"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
