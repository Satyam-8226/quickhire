import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-brand text-white hover:bg-brand-hover shadow-sm shadow-brand/20",
  secondary:
    "bg-white text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-600 hover:bg-brand-light hover:text-brand",
  danger:
    "bg-white text-danger border border-red-200 hover:bg-red-50",
};

const sizes = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
};

export const buttonClassName = ({
  variant = "primary",
  size = "lg",
  className = "",
  fullWidth = false,
} = {}) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

const AppButton = forwardRef(function AppButton(
  {
    children,
    variant = "primary",
    size = "lg",
    className = "",
    fullWidth = false,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClassName({ variant, size, className, fullWidth })}
      {...props}
    >
      {children}
    </button>
  );
});

export function AppButtonLink({
  to,
  children,
  variant = "primary",
  size = "lg",
  className = "",
  fullWidth = false,
  ...props
}) {
  return (
    <Link
      to={to}
      className={buttonClassName({ variant, size, className, fullWidth })}
      {...props}
    >
      {children}
    </Link>
  );
}

export default AppButton;
