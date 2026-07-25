import { Inbox } from "lucide-react";
import { AppButtonLink } from "./AppButton";
import AppCard from "./AppCard";
import { cn } from "../../utils/cn";

const EmptyState = ({
  title = "No content available",
  message = "There's nothing to show right now.",
  buttonText = "Browse Jobs",
  buttonLink = "/jobs",
  icon: Icon = Inbox,
  embedded = false,
  className = "",
  hideAction = false,
}) => {
  const showAction = !hideAction && buttonText && buttonLink;

  const content = (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center text-center",
        embedded ? "px-4 py-9" : "px-5 py-12 sm:px-6",
        className
      )}
    >
      <div
        className={cn(
          "mb-4 flex items-center justify-center rounded-2xl border border-brand/10 bg-brand-light/70 text-brand shadow-sm shadow-brand/5",
          embedded ? "h-12 w-12" : "h-14 w-14"
        )}
      >
        <Icon
          className={cn(embedded ? "h-5 w-5" : "h-6 w-6")}
          strokeWidth={1.75}
        />
      </div>
      <h3
        className={cn(
          "font-semibold text-slate-900",
          embedded ? "text-base" : "text-lg"
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-2 max-w-sm leading-6 text-slate-500",
          embedded ? "text-xs" : "text-sm"
        )}
      >
        {message}
      </p>
      {showAction && (
        <AppButtonLink
          to={buttonLink}
          size="md"
          className={cn(embedded ? "mt-6" : "mt-8")}
          aria-label={buttonText}
        >
          {buttonText}
        </AppButtonLink>
      )}
    </div>
  );

  if (embedded) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70">
        {content}
      </div>
    );
  }

  return (
    <AppCard hover={false} padding={false} className="overflow-hidden">
      {content}
    </AppCard>
  );
};

export default EmptyState;
