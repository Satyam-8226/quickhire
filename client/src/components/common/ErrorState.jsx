import { AlertCircle } from "lucide-react";

const ErrorState = ({
  title = "Something went wrong",
  message = "An error occurred while loading the page",
  onRetry = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
