import { Skeleton } from "../ui/Skeleton";
import AppCard from "../ui/AppCard";
import { cn } from "../../utils/cn";

const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <AppCard hover={false} padding={false} className="overflow-hidden">
    <div className="overflow-x-auto">
      <div className="border-b border-slate-100 bg-slate-50/90 px-4 py-3 sm:px-5">
        <div className="flex gap-5">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-20" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            className="flex items-center gap-5 px-4 py-3.5 sm:px-5"
          >
            {Array.from({ length: columns }).map((_, col) => (
              <Skeleton
                key={col}
                className={cn(
                  "h-4",
                  col === 0 ? "w-28" : col === columns - 1 ? "w-16 rounded-full" : "w-24"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  </AppCard>
);

export default TableSkeleton;
