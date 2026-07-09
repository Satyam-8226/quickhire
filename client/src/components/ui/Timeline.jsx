const Timeline = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
        No timeline events available yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <div key={event.id || `${event.title}-${index}`} className="flex gap-4">
          <div className="relative flex flex-col items-center">
            <span className="mt-1 h-3 w-3 rounded-full bg-brand" />
            {index !== events.length - 1 && (
              <span className="mt-2 block h-full w-px bg-slate-200" />
            )}
          </div>

          <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                {event.description && (
                  <p className="mt-1 text-sm text-slate-500">{event.description}</p>
                )}
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                {new Date(event.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            {event.extra && (
              <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                {event.extra}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
