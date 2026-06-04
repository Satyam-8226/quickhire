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
import EmptyState from "../../components/ui/EmptyState";
import {
  DashboardContentSkeleton,
  DashboardHeroSkeleton,
} from "../../components/skeletons/DashboardSkeleton";
import { getErrorMessage } from "../../utils/errorMessage";
import { AppButtonLink } from "../../components/ui/AppButton";

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
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHeroSkeleton />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5"
            >
              <div className="h-2.5 w-20 rounded bg-slate-100" />
              <div className="mt-3 h-8 w-12 rounded bg-slate-100" />
            </div>
          ))}
        </div>
        <DashboardContentSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState title="Failed to load dashboard" message={error} />
    );
  }

  const reviewRate =
    stats.totalApplicants > 0
      ? Math.round(
          ((stats.reviewed + stats.accepted + stats.rejected) /
            stats.totalApplicants) *
            100
        )
      : 0;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(243,240,255,0.9),transparent_55%),linear-gradient(to_bottom_right,#ffffff,#f8fafc)]"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="min-w-0 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
              Recruiter dashboard
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-[2rem] md:leading-tight">
              Hiring overview
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
              Monitor job postings, review applicants, and manage your hiring
              pipeline from one place.
            </p>
            <p className="mt-3 text-xs font-medium text-slate-400">
              {stats.totalJobs} active job{stats.totalJobs !== 1 ? "s" : ""} ·{" "}
              {stats.totalApplicants} applicant
              {stats.totalApplicants !== 1 ? "s" : ""} · {reviewRate}% reviewed
            </p>
          </div>
          <AppButtonLink
            to="/recruiter/create-job"
            size="md"
            className="shrink-0 gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Post New Job
          </AppButtonLink>
        </div>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          compact
          title="Jobs posted"
          value={stats.totalJobs}
          icon={<Briefcase />}
          description="Active listings"
        />
        <StatCard
          compact
          title="Applicants"
          value={stats.totalApplicants}
          icon={<Users />}
          description="Total applications"
        />
        <StatCard
          compact
          title="Pending"
          value={stats.pending}
          icon={<Clock />}
          description="Awaiting review"
        />
        <StatCard
          compact
          title="Reviewed"
          value={stats.reviewed}
          icon={<Eye />}
          description="In progress"
        />
        <StatCard
          compact
          title="Accepted"
          value={stats.accepted}
          icon={<CheckCircle2 />}
          description="Offers extended"
        />
        <StatCard
          compact
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle />}
          description="Closed applications"
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Applicant insights"
          subtitle="Pipeline breakdown by application status."
          hover={false}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Pending", value: stats.pending, color: "bg-amber-500" },
              { label: "Reviewed", value: stats.reviewed, color: "bg-brand" },
              { label: "Accepted", value: stats.accepted, color: "bg-green-500" },
              { label: "Rejected", value: stats.rejected, color: "bg-slate-400" },
            ].map((item) => {
              const pct =
                stats.totalApplicants > 0
                  ? Math.round((item.value / stats.totalApplicants) * 100)
                  : 0;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-600">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-slate-900">
                      {item.value}
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{pct}% of total</p>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Latest jobs"
          subtitle="Your most recent postings"
          actions={
            <Link
              to="/recruiter/jobs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-hover"
            >
              View all
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        >
          {jobs.length === 0 ? (
            <EmptyState
              embedded
              title="No job postings yet"
              message="Create your first opening and start attracting top candidates."
              buttonText="Create Job"
              buttonLink="/recruiter/create-job"
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {job.title}
                    </p>
                    <p className="truncate text-sm text-slate-500">{job.company}</p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand">
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    {job.applicantCount || 0} applicants
                  </span>
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
