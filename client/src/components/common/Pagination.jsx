import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";
import AppButton from "../ui/AppButton";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <AppButton
        variant="secondary"
        size="md"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="!h-10 !w-10 !px-0"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </AppButton>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              "h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition-all duration-200",
              page === currentPage
                ? "bg-brand text-white shadow-sm shadow-brand/20"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      <AppButton
        variant="secondary"
        size="md"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="!h-10 !w-10 !px-0"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </AppButton>
    </div>
  );
};

export default Pagination;
