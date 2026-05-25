import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() =>
                onPageChange(page)
              }
              className={`px-3 py-2 rounded-lg font-medium transition ${
                page === currentPage
                  ? "bg-black text-white"
                  : "border hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
