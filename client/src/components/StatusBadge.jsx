import React from "react";

export default function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-300 text-black",
    approved: "bg-green-500 text-white",
    rejected: "bg-red-500 text-white",
  };
  return (
    <span className={`px-2 py-1 rounded ${colors[status] || "bg-gray-200"}`}>
      {status}
    </span>
  );
}
