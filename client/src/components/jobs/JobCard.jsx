import { Link } from "react-router-dom";
import { MapPin, Briefcase, DollarSign, ArrowUpRight } from "lucide-react";
import AppCard from "../ui/AppCard";
import { AppButtonLink } from "../ui/AppButton";
import AppButton from "../ui/AppButton";
const getCompanyInitial = (company) => {
  if (!company) return "?";
  return company.trim().charAt(0).toUpperCase();
};

const JobCard = ({
  job,
  showActions = false,
  onEdit = null,
  onDelete = null,
  onViewApplicants = null,
  variant = "default",
}) => {
  const isBrowse = variant === "browse";

  if (isBrowse) {
    return (
      <AppCard className="group !p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-sm font-semibold text-slate-700">
            {getCompanyInitial(job.company)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-500">{job.company}</p>
            <h2 className="mt-0.5 text-lg font-semibold leading-snug tracking-tight text-slate-900 group-hover:text-brand transition-colors">
              {job.title}
            </h2>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-brand" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              <MapPin className="h-3 w-3 text-slate-400" />
              {job.location}
            </span>
          )}
          {job.jobType && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2.5 py-1 text-xs font-medium text-brand">
              <Briefcase className="h-3 w-3" />
              {job.jobType}
            </span>
          )}
          {job.salary && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              <DollarSign className="h-3 w-3 text-slate-400" />
              {job.salary}
            </span>
          )}
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {job.description}
        </p>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <Link
            to={`/jobs/${job._id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
          >
            View role
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </AppCard>
    );
  }

  return (
    <AppCard>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900 mb-1">
          {job.title}
        </h2>
        <p className="font-medium text-slate-500">{job.company}</p>
      </div>

      <div className="mb-6 space-y-2 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-slate-400" />
          <span>{job.jobType}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-slate-400" />
            <span>{job.salary}</span>
          </div>
        )}
      </div>

      <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-slate-600">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-3">
        <AppButtonLink to={`/jobs/${job._id}`} className="flex-1">
          View Details
        </AppButtonLink>
        {showActions && (
          <>
            {onViewApplicants && (
              <AppButton
                variant="secondary"
                size="md"
                onClick={() => onViewApplicants(job._id)}
              >
                Applicants
              </AppButton>
            )}
            {onEdit && (
              <AppButton
                variant="secondary"
                size="md"
                onClick={() => onEdit(job._id)}
              >
                Edit
              </AppButton>
            )}
            {onDelete && (
              <AppButton
                variant="danger"
                size="md"
                onClick={() => onDelete(job._id)}
              >
                Delete
              </AppButton>
            )}
          </>
        )}
      </div>
    </AppCard>
  );
};

export default JobCard;
