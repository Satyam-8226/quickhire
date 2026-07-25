import AppCard from "./AppCard";
import { cn } from "../../utils/cn";

const SectionCard = ({
  title,
  subtitle,
  children,
  actions,
  className = "",
  hover = true,
}) => {
  return (
    <AppCard hover={hover} className={cn("min-w-0", className)}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
          {subtitle && (
            <p className="mt-1.5 text-sm leading-6 text-slate-500">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-3">{actions}</div>
        )}
      </div>
      {children}
    </AppCard>
  );
};

export default SectionCard;
