import AppCard from "./AppCard";
import { cn } from "../../utils/cn";

const StatCard = ({ title, value, icon, description, compact = false }) => {
  return (
    <AppCard
      hover
      className={cn(
        "flex h-full flex-col justify-between",
        compact ? "min-h-[112px] !p-4" : "min-h-[128px] !p-5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            {title}
          </p>
          <p
            className={cn(
              "mt-1.5 font-semibold tracking-tight text-slate-900 tabular-nums",
              compact ? "text-2xl" : "text-[1.75rem] leading-none"
            )}
          >
            {value}
          </p>
        </div>
        {icon && (
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-xl border border-brand/10 bg-brand-light/80 text-brand",
              compact ? "h-9 w-9" : "h-10 w-10"
            )}
          >
            <span className="[&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:stroke-[1.75]">
              {icon}
            </span>
          </div>
        )}
      </div>
      {description && (
        <p className="mt-3 text-xs leading-relaxed text-slate-400">{description}</p>
      )}
    </AppCard>
  );
};

export default StatCard;
