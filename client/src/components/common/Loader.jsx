import { Loader2 } from "lucide-react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="mb-4 h-10 w-10 animate-spin text-brand" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};

export default Loader;
