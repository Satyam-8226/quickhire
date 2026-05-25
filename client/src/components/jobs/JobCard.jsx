import { Link } from "react-router-dom";
import { MapPin, Briefcase, DollarSign } from "lucide-react";

const JobCard = ({ job, showActions = false, onEdit = null, onDelete = null }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {job.title}
        </h2>
        <p className="text-gray-600 font-medium">
          {job.company}
        </p>
      </div>

      {/* Job details */}
      <div className="space-y-2 mb-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          <span>{job.jobType}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
        )}
      </div>

      {/* Description preview */}
      <p className="text-gray-600 text-sm mb-6 line-clamp-2">
        {job.description}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          to={`/jobs/${job._id}`}
          className="flex-1 bg-black text-white px-4 py-2 rounded-lg text-center font-medium hover:opacity-90 transition"
        >
          View Details
        </Link>
        {showActions && (
          <>
            {onEdit && (
              <button
                onClick={() => onEdit(job._id)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(job._id)}
                className="px-4 py-2 border border-red-300 rounded-lg text-red-600 font-medium hover:bg-red-50 transition"
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobCard;