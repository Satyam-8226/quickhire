import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Users,
  Clock,
  CheckCircle2,
  Eye,
  XCircle,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

import { getMyJobs, getRecruiterStats } from "../../api/jobApi";
import StatCard from "../../components/ui/StatCard";
import SectionCard from "../../components/ui/SectionCard";
import ErrorState from "../../components/common/ErrorState";
import DashboardSkeleton from "../../components/skeletons/DashboardSkeleton";
import { getErrorMessage } from "../../utils/errorMessage";
import { AppButtonLink } from "../../components/ui/AppButton";
import AppCard from "../../components/ui/AppCard";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [jobsResponse, statsResponse] = await Promise.all([
          getMyJobs(),
          getRecruiterStats(),
        ]);

        setJobs(jobsResponse.jobs || []);
        setStats(
          statsResponse.stats || {
            totalJobs: 0,
            totalApplicants: 0,
            pending: 0,
            reviewed: 0,
            accepted: 0,
            rejected: 0,
          }
        );
      } catch (err) {
        const message = getErrorMessage(err, "Failed to load recruiter dashboard");
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorState title="Failed to load dashboard" message={error} />
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Recruiter Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Monitor your jobs, track candidate interest, and manage applicant
            progress in one place.
          </p>
        </div>
        <AppButtonLink to="/recruiter/create-job" className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          Post New Job
        </AppButtonLink>
      </header>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Jobs Posted"
          value={stats.totalJobs}
          icon={<Briefcase className="h-5 w-5" />}
          description="Active listings"
        />
        <StatCard
          title="Applicants"
          value={stats.totalApplicants}
          icon={<Users className="h-5 w-5" />}
          description="Total applications"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<Clock className="h-5 w-5" />}
          description="Awaiting review"
        />
        <StatCard
          title="Reviewed"
          value={stats.reviewed}
          icon={<Eye className="h-5 w-5" />}
          description="In progress"
        />
        <StatCard
          title="Accepted"
          value={stats.accepted}
          icon={<CheckCircle2 className="h-5 w-5" />}
          description="Offers extended"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="h-5 w-5" />}
          description="Closed applications"
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Application Analytics"
          subtitle="Analytics charts coming soon."
          hover={false}
        >
          <AppCard hover={false} className="border-dashed bg-slate-50/50 !p-8 text-center">
            <p className="text-sm text-slate-500">
              Visual insights for your hiring pipeline will appear here.
            </p>
          </AppCard>
        </SectionCard>

        <SectionCard
          title="Latest Jobs"
          subtitle="Your most recent postings"
          actions={
            <Link
              to="/recruiter/jobs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-hover"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          {jobs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-lg font-semibold text-slate-900 mb-2">
                No job postings yet
              </p>
              <p className="mb-6 text-sm text-slate-500">
                Create your first opening and start attracting top candidates.
              </p>
              <AppButtonLink to="/recruiter/create-job">Create Job</AppButtonLink>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  className="rounded-2xl border border-slate-100 p-5 transition-colors hover:bg-brand-light/30"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-500">{job.company}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand">
                      <Users className="h-3.5 w-3.5" />
                      {job.applicantCount || 0} applicants
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
