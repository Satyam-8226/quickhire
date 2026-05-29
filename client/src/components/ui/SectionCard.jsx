const SectionCard = ({ title, subtitle, children, actions }) => {
  return (
    <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
            {title}
          </p>
          {subtitle && <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            {subtitle}
          </h2>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      {children}
    </section>
  );
};

export default SectionCard;
