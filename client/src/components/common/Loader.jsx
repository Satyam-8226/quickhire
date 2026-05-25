import { Loader as LoaderIcon } from "lucide-react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoaderIcon className="w-12 h-12 animate-spin text-black mb-4" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default Loader;
