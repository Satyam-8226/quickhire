const JobCardSkeleton = () => {
  return (
    <div className="border rounded-xl p-6 animate-pulse bg-white">

      <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>

      <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>

      <div className="space-y-3 mb-6">
        <div className="h-4 bg-gray-200 rounded"></div>

        <div className="h-4 bg-gray-200 rounded w-5/6"></div>

        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      <div className="flex justify-between items-center">
        <div className="h-5 bg-gray-200 rounded w-24"></div>

        <div className="h-10 bg-gray-200 rounded w-28"></div>
      </div>
    </div>
  );
};

export default JobCardSkeleton;