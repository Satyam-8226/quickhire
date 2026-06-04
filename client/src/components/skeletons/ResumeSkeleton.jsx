import { Skeleton } from "../ui/Skeleton";

const ResumeSkeleton = () => (
  <div className="mx-auto max-w-5xl animate-pulse space-y-8">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </div>
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-8">
        <Skeleton className="mx-auto h-20 w-20 rounded-3xl" />
        <Skeleton className="mx-auto mt-6 h-5 w-48" />
        <Skeleton className="mx-auto mt-3 h-4 w-64" />
        <Skeleton className="mx-auto mt-8 h-11 w-32 rounded-xl" />
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);

export default ResumeSkeleton;
