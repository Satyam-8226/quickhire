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
}) => {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        embedded ? "py-10 px-4" : "py-14 px-6",
        className
      )}
    >
      <div
        className={cn(
          "mb-5 flex items-center justify-center rounded-2xl border border-brand/10 bg-brand-light/60 text-brand",
          embedded ? "h-14 w-14" : "h-16 w-16"
        )}
      >
        <Icon
          className={cn(embedded ? "h-6 w-6" : "h-7 w-7")}
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
          "mt-2 max-w-sm text-slate-500 leading-relaxed",
          embedded ? "text-xs" : "text-sm"
        )}
      >
        {message}
      </p>
      {buttonText && buttonLink && (
        <AppButtonLink
          to={buttonLink}
          size="md"
          className={cn(embedded ? "mt-6" : "mt-8")}
        >
          {buttonText}
        </AppButtonLink>
      )}
    </div>
  );

  if (embedded) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60">
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
