import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const labelClassName = "mb-1.5 block text-sm font-medium text-slate-700";

const textareaClassName =
  "min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-brand focus:ring-4 focus:ring-brand/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60";

const AppTextarea = forwardRef(function AppTextarea(
  { label, id, className = "", wrapperClassName = "", ...props },
  ref
) {
  const textareaId = id || props.name;

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={textareaId} className={labelClassName}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(textareaClassName, className)}
        {...props}
      />
    </div>
  );
});

export default AppTextarea;
