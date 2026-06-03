import { AlertCircle } from "lucide-react";
import AppButton from "../ui/AppButton";
import AppCard from "../ui/AppCard";

const ErrorState = ({
  title = "Something went wrong",
  message = "An error occurred while loading the page",
  onRetry = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <AppCard hover={false} className="max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-14 w-14 text-danger" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        {onRetry && (
          <AppButton onClick={onRetry} size="md">
            Try Again
          </AppButton>
        )}
      </AppCard>
    </div>
  );
};

export default ErrorState;
