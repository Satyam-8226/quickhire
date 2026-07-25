import { cn } from "../../utils/cn";

const AppCard = ({
  children,
  className = "",
  hover = true,
  padding = true,
  as: Component = "div",
  ...props
}) => {
  return (
    <Component
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/60",
        hover &&
          "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-md hover:shadow-brand/10",
        padding && "p-5 sm:p-6",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default AppCard;
