import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";
import { inputClassName } from "./AppInput";

const labelClassName = "mb-2 block text-sm font-medium text-slate-900";

const AppSelect = forwardRef(function AppSelect(
  { label, id, className = "", wrapperClassName = "", children, ...props },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={selectId} className={labelClassName}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(inputClassName, "appearance-none pr-10", className)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
});

export default AppSelect;
