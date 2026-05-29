import { Inbox } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyState = ({
  title = "No content available",
  message = "There's nothing to show right now.",
  buttonText = "Browse Jobs",
  buttonLink = "/jobs",
  icon: Icon = Inbox,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-sm">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 text-gray-400">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{message}</p>
      <Link
        to={buttonLink}
        className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default EmptyState;
