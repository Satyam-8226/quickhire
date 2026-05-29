const DashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse"
        >
          <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>

          <div className="h-10 w-16 bg-gray-200 rounded mb-4"></div>

          <div className="h-3 w-20 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSkeleton;