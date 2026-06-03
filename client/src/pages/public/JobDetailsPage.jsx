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
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/errorMessage";
import AppCard from "../../components/ui/AppCard";
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
    return <Loader message="Loading job details..." />;
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
    <div className="mx-auto max-w-4xl px-6 py-8">
      <AppButton
        variant="ghost"
        size="md"
        onClick={() => navigate(-1)}
        className="mb-8 gap-2 !px-0"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </AppButton>

      <AppCard className="mb-8 p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{job.title}</h1>
          <div className="flex items-center gap-2 text-lg text-slate-500">
            <Building2 className="h-5 w-5 text-brand" />
            <span>{job.company}</span>
          </div>
        </div>

        <div className="mb-8 grid gap-6 border-y border-slate-100 py-6 md:grid-cols-4">
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

      <AppCard className="p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          About this job
        </h2>
        <p className="mb-8 whitespace-pre-wrap leading-relaxed text-slate-600">
          {job.description}
        </p>

        {job.requirements?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Requirements
            </h3>
            <ul className="space-y-3">
              {job.requirements.map((requirement, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-slate-600"
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
