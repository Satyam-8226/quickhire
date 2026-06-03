const StatCardSkeleton = () => (
  <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 space-y-2">
        <div className="h-2.5 w-20 rounded bg-slate-100" />
        <div className="h-7 w-12 rounded bg-slate-100" />
      </div>
      <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-100" />
    </div>
    <div className="mt-3 h-2.5 w-28 rounded bg-slate-100" />
  </div>
);

export const DashboardHeroSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
    <div className="h-2.5 w-36 rounded bg-slate-100" />
    <div className="mt-4 h-9 w-72 max-w-full rounded-lg bg-slate-100" />
    <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-100" />
  </div>
);

export const DashboardContentSkeleton = () => (
  <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <StatCardSkeleton key={item} />
        ))}
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 h-5 w-40 rounded bg-slate-100" />
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-slate-100" />
                <div className="h-3 w-24 rounded bg-slate-100" />
              </div>
              <div className="h-6 w-16 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="hidden space-y-4 xl:block">
      <div className="h-48 rounded-3xl border border-slate-200 bg-white" />
      <div className="h-40 rounded-3xl border border-slate-200 bg-white" />
    </div>
  </div>
);

const DashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <StatCardSkeleton key={item} />
      ))}
    </div>
  );
};

export default DashboardSkeleton;
