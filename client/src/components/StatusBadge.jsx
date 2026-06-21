import React from "react";

export default function StatusBadge({ status }) {
  const configs = {
    pending: {
      style: "bg-amber-50 text-amber-800 border border-amber-200/60",
      dot: "bg-amber-500 animate-pulse-dot",
    },
    approved: {
      style: "bg-emerald-50 text-emerald-800 border border-emerald-200/60",
      dot: "bg-emerald-500",
    },
    rejected: {
      style: "bg-rose-50 text-rose-800 border border-rose-200/60",
      dot: "bg-rose-500",
    },
  };

  const config = configs[status] || {
    style: "bg-gray-50 text-gray-700 border border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${config.style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
