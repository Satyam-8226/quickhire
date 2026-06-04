import { Skeleton } from "../ui/Skeleton";

const JobCardSkeleton = () => (
  <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start gap-4">
      <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4 max-w-xs" />
      </div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
    <div className="mt-4 flex flex-wrap gap-1.5">
      <Skeleton className="h-6 w-14 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
    <div className="mt-5 flex justify-between border-t border-slate-100 pt-4">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const JobsPageSkeleton = () => (
  <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
    <div className="mb-10 animate-pulse space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-9 w-80 max-w-full" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </div>
    <div className="mb-8 animate-pulse rounded-3xl border border-slate-200 bg-white p-6">
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-11 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
    <div className="grid gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

export default JobCardSkeleton;
