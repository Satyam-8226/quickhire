import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  FileText,
  CheckCircle2,
  Sparkles,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { getMyApplications } from "../../api/applicationApi";
import { getErrorMessage } from "../../utils/errorMessage";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import SectionCard from "../../components/ui/SectionCard";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { AppButtonLink } from "../../components/ui/AppButton";
import { buttonClassName } from "../../components/ui/AppButton";
import {
  DashboardContentSkeleton,
  DashboardHeroSkeleton,
} from "../../components/skeletons/DashboardSkeleton";

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const candidateName = user?.name?.split(" ")[0] || "there";
  const hasResume = Boolean(user?.currentResume?.resumeUrl || user?.resume);
  const resumeVersion = user?.currentResume?.version ?? 1;
  const resumeUpdatedAt = user?.currentResume?.uploadedAt;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyApplications();
      setApplications(data?.applications || []);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to load your dashboard data");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const applicationCounts = useMemo(
    () =>
      applications.reduce(
        (counts, application) => {
          const key = application.status || "pending";
          counts[key] = (counts[key] || 0) + 1;
          return counts;
        },
        { pending: 0, reviewed: 0, accepted: 0, rejected: 0 }
      ),
    [applications]
  );

  const recentApplications = useMemo(
    () => applications.slice(0, 5),
    [applications]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHeroSkeleton />
        <DashboardContentSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Dashboard error"
        message={error}
        onRetry={fetchApplications}
      />
    );
  }

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
              Candidate dashboard
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-[2rem] md:leading-tight">
              Welcome back, {candidateName} 👋
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
              Track applications, manage resumes, and discover opportunities.
            </p>
            <p className="mt-3 text-xs font-medium text-slate-400">
              {applications.length} application{applications.length !== 1 ? "s" : ""}{" "}
              · {hasResume ? "Resume ready" : "Resume needed"} ·{" "}
              {applicationCounts.pending} pending review
            </p>
          </div>
          <AppButtonLink to="/jobs" size="md" className="shrink-0 shadow-sm">
            Browse Jobs
          </AppButtonLink>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              compact
              title="Total applications"
              value={applications.length}
              icon={<ClipboardList />}
              description="Sent so far"
            />
            <StatCard
              compact
              title="Pending review"
              value={applicationCounts.pending}
              icon={<FileText />}
              description="Awaiting feedback"
            />
            <StatCard
              compact
              title="Accepted offers"
              value={applicationCounts.accepted}
              icon={<CheckCircle2 />}
              description="Offers received"
            />
            <StatCard
              compact
              title="Resume status"
              value={hasResume ? "Uploaded" : "Missing"}
              icon={<Sparkles />}
              description={hasResume ? "Ready to apply" : "Upload required"}
            />
          </div>

          <SectionCard
            title="Recent Applications"
            subtitle="Your latest activity and application progress."
            actions={
              <Link
                to="/candidate/applications"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-brand-hover"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            {recentApplications.length === 0 ? (
              <EmptyState
                embedded
                title="No applications yet"
                message="Start applying to opportunities and track your progress here."
                buttonText="Browse Jobs"
                buttonLink="/jobs"
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {recentApplications.map((application) => (
                  <div
                    key={application._id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {application.job?.company || "Unknown Company"}
                      </p>
                      <p className="truncate text-sm text-slate-500">
                        {application.job?.title || "Untitled Job"}
                      </p>
                      <p className="text-xs text-slate-400">
                        Applied{" "}
                        {new Date(application.createdAt).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                        {application.job?.location && (
                          <span> · {application.job.location}</span>
                        )}
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <aside className="min-w-0 space-y-5">
          <SectionCard title="Profile Summary" subtitle="Your account at a glance" hover={false}>
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-base font-semibold text-white shadow-sm shadow-brand/25">
                {getInitials(user?.name)}
              </div>
              <p className="mt-4 text-base font-semibold text-slate-900">
                {user?.name || "Candidate"}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">
                {user?.email || "No email available"}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <Link
                to="/candidate/resume"
                className={buttonClassName({ variant: "secondary", size: "md", fullWidth: true })}
              >
                Manage Resume
              </Link>
              <Link
                to="/candidate/applications"
                className={buttonClassName({ size: "md", fullWidth: true })}
              >
                View Applications
              </Link>
            </div>
          </SectionCard>

          <SectionCard title="Resume Status" subtitle="Your latest resume details" hover={false}>
            <dl className="space-y-3.5">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-xs font-medium text-slate-500">Resume Status</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      hasResume
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {hasResume ? "Active" : "Action needed"}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3.5">
                <dt className="text-xs font-medium text-slate-500">Latest Version</dt>
                <dd className="text-sm font-medium text-slate-900 tabular-nums">
                  {hasResume ? `v${resumeVersion}` : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3.5">
                <dt className="text-xs font-medium text-slate-500">Last Updated</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {resumeUpdatedAt
                    ? new Date(resumeUpdatedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
            </dl>
          </SectionCard>

          <SectionCard title="Quick Actions" subtitle="Shortcuts for your search" hover={false}>
            <div className="flex flex-col gap-2.5">
              <Link
                to="/jobs"
                className={buttonClassName({ variant: "secondary", size: "md", fullWidth: true, className: "gap-2" })}
              >
                <Briefcase className="h-4 w-4" />
                Browse Jobs
              </Link>
              <Link
                to="/candidate/resume"
                className={buttonClassName({ variant: "secondary", size: "md", fullWidth: true, className: "gap-2" })}
              >
                <FileText className="h-4 w-4" />
                Manage Resume
              </Link>
              <Link
                to="/candidate/applications"
                className={buttonClassName({ size: "md", fullWidth: true, className: "gap-2" })}
              >
                <ClipboardList className="h-4 w-4" />
                View Applications
              </Link>
            </div>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
};

export default CandidateDashboard;
