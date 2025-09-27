import React, { useState } from "react";
import { useRequests } from "../../context/RequestContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function OutpassForm() {
  const { authUser } = useAuth();
  const { requestOutpass, loading } = useRequests();
  const navigate = useNavigate();

  // form fields
  const [fullName, setFullName] = useState(authUser?.name || "");
  const [enrollment, setEnrollment] = useState(authUser?.enrollmentNo || "");
  const [room, setRoom] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [addressOnLeave, setAddressOnLeave] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purpose || !fromDate || !toDate) {
      toast.error("Please fill required fields (dates & purpose).");
      return;
    }

    try {
      const data = await requestOutpass({
        reason: purpose,
        fromDate,
        toDate,
        roomNumber: room,
        addressOnLeave,
      });
      if (data) {
        toast.success("Outpass requested successfully!");
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while applying.");
    }
  };

  return (
    <div
      className=" min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/nith_bg-img.jpg')" }}
    >
      <div className="w-full max-w-5xl">
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-sm bg-white/20 border border-white/70 rounded-2xl p-8 shadow-lg"
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            Fill out this form to apply for outpass
          </h1>

          {/* top row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="text-sm text-white/90 mb-2 block">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent border-b border-white/60 text-white placeholder-white/60 py-2 outline-none"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="text-sm text-white/90 mb-2 block">
                Enrollment No.
              </label>
              <input
                value={enrollment}
                onChange={(e) => setEnrollment(e.target.value.toUpperCase())}
                className="w-full bg-transparent border-b border-white/60 text-white placeholder-white/60 py-2 outline-none uppercase"
                placeholder="23BCSxxx"
                required
              />
            </div>

            <div>
              <label className="text-sm text-white/90 mb-2 block">
                Room Number
              </label>
              <input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full bg-transparent border-b border-white/60 text-white placeholder-white/60 py-2 outline-none"
                placeholder="B-315"
              />
            </div>
          </div>

          {/* dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-end">
            <div>
              <label className="text-sm text-white/90 mb-2 block">
                Duration
              </label>
              <div className="flex gap-3 items-center">
                <div className="flex-1">
                  <label className="text-xs text-white/80">From</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full bg-transparent border-b border-white/60 text-white py-2 outline-none"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-white/80">To</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full bg-transparent border-b border-white/60 text-white py-2 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-white/90 mb-2 block">
                Address on Leave
              </label>
              <input
                value={addressOnLeave}
                onChange={(e) => setAddressOnLeave(e.target.value)}
                placeholder="Address where you will stay while on leave"
                className="w-full bg-transparent border-b border-white/60 text-white placeholder-white/60 py-2 outline-none"
              />
            </div>
          </div>

          {/* purpose */}
          <div className="mb-6">
            <label className="text-sm text-white/90 mb-2 block">
              Purpose of Leave
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={4}
              placeholder="Reason / purpose (eg. medical, personal, family function, etc.)"
              className="w-full bg-transparent border border-white/30 rounded-md p-3 text-white placeholder-white/60 outline-none"
              required
            />
          </div>

          {/* actions */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-md btn-neutral rounded-full"
            >
              {loading ? "Submitting..." : "Apply"}
            </button>

            <div className="text-sm text-white/80">
              <div>
                Submitted as:{" "}
                <span className="font-medium">
                  {authUser?.name || "Student"}
                </span>
              </div>
              <div className="text-xs mt-1">
                Status will be visible in your dashboard
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
