const PageHeader = ({ title, description, cta }) => {
  return (
    <div className="mb-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
              {description}
            </p>
          )}
        </div>
        {cta && <div className="shrink-0">{cta}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
