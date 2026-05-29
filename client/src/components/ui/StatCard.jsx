const StatCard = ({ title, value, icon, description }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            {title}
          </p>
          <p className="mt-3 text-3xl font-semibold text-gray-900">
            {value}
          </p>
        </div>
        {icon && <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-700">
          {icon}
        </div>}
      </div>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
};

export default StatCard;
