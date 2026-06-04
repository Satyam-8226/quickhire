import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  DollarSign,
  ArrowUpRight,
  Clock,
  GraduationCap,
} from "lucide-react";
import AppCard from "../ui/AppCard";
import { AppButtonLink } from "../ui/AppButton";
import AppButton from "../ui/AppButton";
import { cn } from "../../utils/cn";

const getCompanyInitial = (company) => {
  if (!company) return "?";
  return company.trim().charAt(0).toUpperCase();
};

const formatPostedDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getSkillsList = (job) => {
  if (Array.isArray(job.skills) && job.skills.length > 0) {
    return job.skills;
  }
  if (Array.isArray(job.requirements)) {
    return job.requirements;
  }
  return [];
};

const getExperienceLabel = (job) => {
  if (job.experience) return job.experience;
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];
  const expItem = requirements.find((r) =>
    /year|experience|exp\.|senior|junior|mid/i.test(String(r))
  );
  if (expItem) return expItem;
  if (requirements[0]) return requirements[0];
  return job.jobType || null;
};

const SkillBadge = ({ label }) => (
  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
    {label}
  </span>
);

const MetaBadge = ({ icon: Icon, children, variant = "default" }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
      variant === "brand"
        ? "bg-brand-light text-brand"
        : "bg-slate-100 text-slate-600"
    )}
  >
    {Icon && <Icon className="h-3 w-3 shrink-0 opacity-70" />}
    {children}
  </span>
);

const JobCard = ({
  job,
  showActions = false,
  onEdit = null,
  onDelete = null,
  onViewApplicants = null,
  variant = "default",
}) => {
  const isBrowse = variant === "browse";
  const skills = getSkillsList(job);
  const visibleSkills = skills.slice(0, 4);
  const extraSkills = skills.length - visibleSkills.length;
  const experience = getExperienceLabel(job);
  const posted = formatPostedDate(job.createdAt);

  if (isBrowse) {
    return (
      <Link to={`/jobs/${job._id}`} className="block min-w-0">
        <AppCard
          hover
          className="group !p-5 transition-all duration-200 hover:border-brand/20 hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white text-base font-semibold text-slate-700 shadow-sm"
              aria-hidden
            >
              {getCompanyInitial(job.company)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {job.company}
              </p>
              <h2 className="mt-0.5 text-lg font-semibold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-brand">
                {job.title}
              </h2>
            </div>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
              aria-hidden
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.location && (
              <MetaBadge icon={MapPin}>{job.location}</MetaBadge>
            )}
            {job.salary && (
              <MetaBadge icon={DollarSign}>{job.salary}</MetaBadge>
            )}
            {experience && (
              <MetaBadge icon={GraduationCap}>{experience}</MetaBadge>
            )}
            {job.jobType && (
              <MetaBadge icon={Briefcase} variant="brand">
                {job.jobType}
              </MetaBadge>
            )}
          </div>

          {visibleSkills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {visibleSkills.map((skill) => (
                <SkillBadge key={skill} label={skill} />
              ))}
              {extraSkills > 0 && (
                <SkillBadge label={`+${extraSkills} more`} />
              )}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            {posted ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                Posted {posted}
              </span>
            ) : (
              <span />
            )}
            <span className="text-sm font-semibold text-brand transition-colors group-hover:text-brand-hover">
              View role
            </span>
          </div>
        </AppCard>
      </Link>
    );
  }

  return (
    <AppCard>
      <div className="mb-4">
        <h2 className="mb-1 text-xl font-semibold text-slate-900">{job.title}</h2>
        <p className="font-medium text-slate-500">{job.company}</p>
      </div>

      <div className="mb-6 space-y-2 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{job.jobType}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 shrink-0 text-slate-400" />
            <span>{job.salary}</span>
          </div>
        )}
        {posted && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-slate-400" />
            <span>Posted {posted}</span>
          </div>
        )}
      </div>

      {visibleSkills.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {visibleSkills.map((skill) => (
            <SkillBadge key={skill} label={skill} />
          ))}
        </div>
      )}

      <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-slate-600">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-3">
        <AppButtonLink to={`/jobs/${job._id}`} className="flex-1 min-w-[140px]">
          View Details
        </AppButtonLink>
        {showActions && (
          <>
            {onViewApplicants && (
              <AppButton
                variant="secondary"
                size="md"
                onClick={() => onViewApplicants(job._id)}
                aria-label={`View applicants for ${job.title}`}
              >
                Applicants
              </AppButton>
            )}
            {onEdit && (
              <AppButton
                variant="secondary"
                size="md"
                onClick={() => onEdit(job._id)}
                aria-label={`Edit ${job.title}`}
              >
                Edit
              </AppButton>
            )}
            {onDelete && (
              <AppButton
                variant="danger"
                size="md"
                onClick={() => onDelete(job._id)}
                aria-label={`Delete ${job.title}`}
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
