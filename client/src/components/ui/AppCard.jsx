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
        "bg-white rounded-3xl border border-slate-200 shadow-sm",
        hover &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        padding && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default AppCard;
