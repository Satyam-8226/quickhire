import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "No items found",
  message = "There's nothing to display right now",
  icon: Icon = Inbox,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Icon className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 text-center max-w-sm">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
