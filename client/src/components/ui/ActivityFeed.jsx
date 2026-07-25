const ActivityFeed = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
        No recent activity yet. Add applications or interviews to populate your feed.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 transition-colors duration-150 hover:border-brand/20 hover:bg-brand-light/20">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <span className="text-xs text-slate-400">{item.timestamp}</span>
          </div>
          {item.description && (
            <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
          )}
          {item.badge && (
            <span className="mt-3 inline-flex rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand">
              {item.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
