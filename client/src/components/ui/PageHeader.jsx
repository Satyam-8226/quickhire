const PageHeader = ({ title, description, cta }) => {
  return (
    <div className="mb-7 sm:mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2.5 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>
        {cta && <div className="shrink-0 sm:pb-0.5">{cta}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
