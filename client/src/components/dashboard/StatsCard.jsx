const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            {title}
          </p>
          <p className="mt-3 text-3xl font-semibold text-gray-900">
            {value}
          </p>
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center shadow-sm">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;