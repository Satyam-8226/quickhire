import { cn } from "../../utils/cn";
import AppCard from "./AppCard";

export function AppTable({ children, className = "" }) {
  return (
    <AppCard hover={false} padding={false} className={cn("overflow-hidden", className)}>
      <div className="overflow-x-auto">{children}</div>
    </AppCard>
  );
}

export function AppTableElement({ children, className = "" }) {
  return (
    <table className={cn("min-w-full border-collapse text-left", className)}>
      {children}
    </table>
  );
}

export function AppTableHead({ children }) {
  return (
    <thead className="border-b border-slate-200 bg-slate-50/80">
      {children}
    </thead>
  );
}

export function AppTableBody({ children }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>;
}

export function AppTableRow({ children, className = "" }) {
  return (
    <tr
      className={cn(
        "transition-colors duration-150 hover:bg-brand-light/40",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function AppTableHeaderCell({ children, className = "" }) {
  return (
    <th
      className={cn(
        "px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500",
        className
      )}
    >
      {children}
    </th>
  );
}

export function AppTableCell({ children, className = "" }) {
  return (
    <td className={cn("px-6 py-4 text-sm text-slate-700", className)}>
      {children}
    </td>
  );
}
