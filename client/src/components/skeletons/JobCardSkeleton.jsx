const JobCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-100" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-slate-100" />
          <div className="h-5 w-3/4 max-w-xs rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="h-6 w-20 rounded-full bg-slate-100" />
        <div className="h-6 w-16 rounded-full bg-slate-100" />
        <div className="h-6 w-14 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 rounded bg-slate-100" />
        <div className="h-3 w-10/12 rounded bg-slate-100" />
      </div>
      <div className="mt-5 h-4 w-24 rounded bg-slate-100" />
    </div>
  );
};

export const JobsPageSkeleton = () => (
  <div className="mx-auto max-w-6xl px-6 py-8">
    <div className="mb-10 animate-pulse space-y-3">
      <div className="h-9 w-80 max-w-full rounded-lg bg-slate-200/80" />
      <div className="h-4 w-96 max-w-full rounded bg-slate-100" />
    </div>
    <div className="mb-8 animate-pulse rounded-3xl border border-slate-200 bg-white p-6">
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="space-y-2">
            <div className="h-3 w-16 rounded bg-slate-100" />
            <div className="h-12 rounded-xl bg-slate-100" />
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
