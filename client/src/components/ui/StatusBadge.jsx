import { cn } from "../../utils/cn";

const statusMap = {
  pending: {
    label: "Applied",
    styles: "bg-blue-100 text-blue-700",
  },
  applied: {
    label: "Applied",
    styles: "bg-blue-100 text-blue-700",
  },
  reviewed: {
    label: "Reviewed",
    styles: "bg-purple-100 text-purple-700",
  },
  interview: {
    label: "Interview",
    styles: "bg-amber-100 text-amber-700",
  },
  accepted: {
    label: "Accepted",
    styles: "bg-green-100 text-green-700",
  },
  rejected: {
    label: "Rejected",
    styles: "bg-red-100 text-red-700",
  },
};

const StatusBadge = ({ status, className = "" }) => {
  const normalized = String(status || "pending").toLowerCase();
  const config = statusMap[normalized] || statusMap.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
        config.styles,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
