import { AlertCircle } from "lucide-react";
import AppButton from "../ui/AppButton";
import AppCard from "../ui/AppCard";

const ErrorState = ({
  title = "Something went wrong",
  message = "An error occurred while loading the page",
  onRetry = null,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-16"
      role="alert"
      aria-live="assertive"
    >
      <AppCard hover={false} className="max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-14 w-14 text-danger" aria-hidden />
        <h3 className="mb-2 text-xl font-semibold text-slate-900">{title}</h3>
        <p className="mb-6 text-sm text-slate-500">{message}</p>
        {onRetry && (
          <AppButton onClick={onRetry} size="md" aria-label="Try again">
            Try Again
          </AppButton>
        )}
      </AppCard>
    </div>
  );
};

export default ErrorState;
