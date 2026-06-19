import React from "react";

export default function StatusBadge({ status }) {
  const colors = {
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    rejected: "bg-red-50 text-red-700 border border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${colors[status] || "bg-gray-50 text-gray-600 border border-gray-200"}`}>
      {status}
    </span>
  );
}
