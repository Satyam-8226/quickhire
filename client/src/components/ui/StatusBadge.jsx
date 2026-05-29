const statusMap = {
  pending: {
    label: "Pending",
    styles: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  reviewed: {
    label: "Reviewed",
    styles: "bg-blue-100 text-blue-800 border-blue-200",
  },
  accepted: {
    label: "Accepted",
    styles: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    styles: "bg-red-100 text-red-800 border-red-200",
  },
};

const StatusBadge = ({ status }) => {
  const normalized = String(status || "pending").toLowerCase();
  const config = statusMap[normalized] || statusMap.pending;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase ${config.styles}`}>
      <span className="h-2.5 w-2.5 rounded-full bg-current inline-block"></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
