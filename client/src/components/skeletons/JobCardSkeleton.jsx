const JobCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse">
      {/* Company */}
      <div className="h-4 w-32 bg-gray-200 rounded mb-3"></div>

      {/* Job Title */}
      <div className="h-7 w-3/4 bg-gray-200 rounded mb-4"></div>

      {/* Location + Type */}
      <div className="flex gap-3 mb-5">
        <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
      </div>

      {/* Description */}
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        <div className="h-4 bg-gray-200 rounded w-8/12"></div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
        </div>

        <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default JobCardSkeleton;