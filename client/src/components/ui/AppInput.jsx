import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const labelClassName = "mb-2 block text-sm font-medium text-slate-900";

export const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60";

const AppInput = forwardRef(function AppInput(
  { label, id, className = "", wrapperClassName = "", error, ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={inputId} className={labelClassName}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(inputClassName, className)}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
});

export default AppInput;
