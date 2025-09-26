import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { getOutpassById } from "../../api/studentAPI";

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

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Outpass Request Details</h2>

        <div className="mb-4">
          <h3 className="text-lg font-medium">Student</h3>
          <p className="text-sm text-gray-300">Name: {outpass.student?.name}</p>
          <p className="text-sm text-gray-300">
            Enrollment: {outpass.student?.enrollmentNo}
          </p>
          <p className="text-sm text-gray-300">
            Email: {outpass.student?.email}
          </p>
          <p className="text-sm text-gray-300">
            Hostel: {outpass.student?.hostelName}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium">Outpass Info</h3>
          <p className="text-sm text-gray-300">
            From: {new Date(outpass.fromDate || outpass.from).toLocaleString()}
          </p>
          <p className="text-sm text-gray-300">
            To: {new Date(outpass.toDate || outpass.to).toLocaleString()}
          </p>
          <p className="text-sm text-gray-300">
            Purpose: {outpass.reason || outpass.purpose}
          </p>
          <p className="text-sm text-gray-300">Status: {outpass.status}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
