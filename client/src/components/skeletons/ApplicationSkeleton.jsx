const ApplicantSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-pulse">
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 w-56 bg-gray-200 rounded"></div>
        </div>

        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
      </div>

      <div className="space-y-3 mb-5">
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div className="flex gap-3">
        <div className="h-9 w-24 bg-gray-200 rounded"></div>
        <div className="h-9 w-28 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default ApplicantSkeleton;