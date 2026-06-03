const SectionCard = ({ title, subtitle, children, actions }) => {
  return (
    <section className="min-w-0 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      {children}
    </section>
  );
};

export default SectionCard;
