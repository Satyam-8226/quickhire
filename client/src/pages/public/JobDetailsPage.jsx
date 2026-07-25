import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
  ArrowLeft,
} from "lucide-react";

import { getSingleJob } from "../../api/jobApi";
import { applyToJob } from "../../api/applicationApi";
import { Skeleton } from "../../components/ui/Skeleton";
import AppCard from "../../components/ui/AppCard";
import ErrorState from "../../components/common/ErrorState";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/errorMessage";
import AppButton from "../../components/ui/AppButton";

function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getSingleJob(id);
        setJob(data.job);
      } catch (err) {
        const message = getErrorMessage(err, "Failed to load job");
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user || user.role !== "candidate") {
      toast.error("Only candidates can apply for jobs");
      navigate("/login");
      return;
    }

    try {
      setApplying(true);
      const data = await applyToJob(id);
      toast.success(data.message || "Application submitted successfully");
      navigate("/candidate/applications");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to apply for job"));
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:py-8 animate-pulse">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-2/3 max-w-md" />
        <AppCard hover={false} className="space-y-4 !p-5 sm:!p-7">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-11 w-36 rounded-xl mt-4" />
        </AppCard>
      </div>
    );
  }

  if (error || !job) {
    return (
      <ErrorState
        title="Job not found"
        message={error || "This job posting may have been removed."}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
      <AppButton
        variant="ghost"
        size="md"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2 !px-0"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </AppButton>

      <AppCard className="mb-6 p-5 sm:p-7">
        <div className="mb-5">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{job.title}</h1>
          <div className="flex items-center gap-2 text-base text-slate-500">
            <Building2 className="h-5 w-5 text-brand" />
            <span>{job.company}</span>
          </div>
        </div>

        <div className="mb-6 grid gap-5 border-y border-slate-100 py-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Location
            </p>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="h-5 w-5 text-brand" />
              <span className="font-medium">{job.location}</span>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Job Type
            </p>
            <div className="flex items-center gap-2 text-slate-700">
              <Briefcase className="h-5 w-5 text-brand" />
              <span className="font-medium">{job.jobType}</span>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Salary
            </p>
            <div className="flex items-center gap-2 text-slate-700">
              <DollarSign className="h-5 w-5 text-brand" />
              <span className="font-medium">{job.salary || "Not listed"}</span>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Posted
            </p>
            <span className="font-medium text-slate-700">
              {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {user?.role === "candidate" && (
          <AppButton onClick={handleApply} disabled={applying} fullWidth>
            {applying ? "Applying..." : "Apply Now"}
          </AppButton>
        )}

        {!token && (
          <AppButton onClick={() => navigate("/login")} fullWidth>
            Login to Apply
          </AppButton>
        )}

        {user?.role === "recruiter" && (
          <div className="rounded-xl border border-brand/20 bg-brand-light p-4">
            <p className="text-center text-sm font-medium text-brand">
              Recruiters cannot apply to jobs
            </p>
          </div>
        )}
      </AppCard>

      <AppCard className="p-5 sm:p-7">
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-slate-900">
          About this job
        </h2>
        <p className="mb-7 whitespace-pre-wrap text-sm leading-7 text-slate-600 sm:text-base">
          {job.description}
        </p>

        {job.requirements?.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Requirements
            </h3>
            <ul className="space-y-3">
              {job.requirements.map((requirement, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm leading-6 text-slate-600 sm:text-base"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </AppCard>
    </div>
  );
}

export default JobDetailsPage;
