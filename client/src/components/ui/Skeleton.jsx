import { cn } from "../../utils/cn";

export const Skeleton = ({ className = "" }) => (
  <div
    className={cn("animate-pulse rounded-md bg-slate-100", className)}
    aria-hidden="true"
  />
);

export default Skeleton;
