import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  FileText,
  CheckCircle2,
  Briefcase,
  ArrowRight,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import {
  getInterviewRounds,
  getMyApplications,
  getMyExternalApplications,
} from "../../api/applicationApi";
import { getErrorMessage } from "../../utils/errorMessage";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import SectionCard from "../../components/ui/SectionCard";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import ActivityFeed from "../../components/ui/ActivityFeed";
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

const getDayLabel = (dateValue) => {
  if (!dateValue) return "Soon";

  const targetDate = new Date(dateValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 3) return `In ${diffDays} Days`;
  if (diffDays < 0) return "Overdue";
  return `In ${diffDays} Days`;
};

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [externalApplications, setExternalApplications] = useState([]);
  const [interviewsByApplication, setInterviewsByApplication] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const candidateName = user?.name?.split(" ")[0] || "there";
  const hasResume = Boolean(user?.currentResume?.resumeUrl || user?.resume);
  const resumeVersion = user?.currentResume?.version ?? 1;
  const resumeUpdatedAt = user?.currentResume?.uploadedAt;

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [quickHireData, externalData] = await Promise.all([
        getMyApplications(),
        getMyExternalApplications(),
      ]);

      const quickHireApplications = quickHireData?.applications || [];
      const externalApps = externalData?.externalApplications || [];
      const interviewLookups = {};

      await Promise.all(
        externalApps.map(async (application) => {
          try {
            const interviewData = await getInterviewRounds(application._id);
            interviewLookups[application._id] = interviewData?.interviewRounds || [];
          } catch {
            interviewLookups[application._id] = [];
          }
        })
      );

      setApplications(quickHireApplications);
      setExternalApplications(externalApps);
      setInterviewsByApplication(interviewLookups);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to load your dashboard data");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const recentApplications = useMemo(() => applications.slice(0, 5), [applications]);

  const stats = useMemo(() => {
    const activeExternalApplications = externalApplications.filter((app) => {
      const status = (app.status || "").toLowerCase();
      return !["rejected", "withdrawn", "ghosted", "offer"].includes(status);
    });

    const interviewScheduledCount = externalApplications.filter((app) => {
      const status = (app.status || "").toLowerCase();
      return ["interview scheduled", "interviewing", "hr round"].includes(status);
    }).length + applications.filter((app) => (app.status || "").toLowerCase() === "interview").length;

    const offers = externalApplications.filter((app) => (app.status || "").toLowerCase() === "offer").length + applications.filter((app) => (app.status || "").toLowerCase() === "accepted").length;
    const rejections = externalApplications.filter((app) => ["rejected", "ghosted"].includes((app.status || "").toLowerCase())).length + applications.filter((app) => (app.status || "").toLowerCase() === "rejected").length;

    return {
      total: applications.length + externalApplications.length,
      active: activeExternalApplications.length + applications.filter((app) => ["pending", "reviewed", "applied", "oa scheduled", "oa completed", "interview scheduled", "interviewing", "hr round"].includes((app.status || "").toLowerCase())).length,
      interviews: interviewScheduledCount,
      offers,
      rejections,
    };
  }, [applications, externalApplications]);

  const upcomingItems = useMemo(() => {
    const items = [];

    Object.entries(interviewsByApplication).forEach(([applicationId, rounds]) => {
      const application = externalApplications.find((entry) => entry._id === applicationId);
      if (!application || ["Rejected", "Withdrawn", "Ghosted"].includes(application.status)) {
        return;
      }

      rounds.forEach((round) => {
        if (!round?.scheduledAt) return;
        const scheduledAt = new Date(round.scheduledAt);
        if (Number.isNaN(scheduledAt.getTime())) return;

        items.push({
          id: round._id,
          type: "interview",
          title: `${round.roundName || "Interview"} for ${application.companyName}`,
          description: `${round.roundType || "Round"} • ${round.interviewer || "TBD"}`,
          date: scheduledAt,
          badge: getDayLabel(scheduledAt),
          status: round.status,
        });
      });
    });

    externalApplications.forEach((application) => {
      const status = application.status;
      if (["Rejected", "Withdrawn", "Ghosted"].includes(status)) return;

      if (application.followUpDate) {
        const followUpDate = new Date(application.followUpDate);
        if (!Number.isNaN(followUpDate.getTime())) {
          items.push({
            id: `${application._id}-followup`,
            type: "follow-up",
            title: `Follow up with ${application.companyName}`,
            description: application.role || "Keep the process moving",
            date: followUpDate,
            badge: getDayLabel(followUpDate),
            status,
          });
        }
      }

      if (status === "OA Scheduled") {
        const deadline = application.followUpDate ? new Date(application.followUpDate) : new Date(application.appliedDate);
        deadline.setDate(deadline.getDate() + 3);
        items.push({
          id: `${application._id}-assessment`,
          type: "assessment",
          title: `Complete OA for ${application.companyName}`,
          description: application.role || "Assessment deadline",
          date: deadline,
          badge: getDayLabel(deadline),
          status,
        });
      }

      if (status === "Offer") {
        const deadline = application.followUpDate ? new Date(application.followUpDate) : new Date();
        deadline.setDate(deadline.getDate() + 2);
        items.push({
          id: `${application._id}-offer`,
          type: "offer",
          title: `Respond to ${application.companyName}`,
          description: "Offer needs your attention",
          date: deadline,
          badge: getDayLabel(deadline),
          status,
        });
      }

      const updatedAt = application.updatedAt || application.createdAt;
      if (updatedAt) {
        const lastUpdated = new Date(updatedAt);
        const staleDate = new Date(lastUpdated);
        staleDate.setDate(staleDate.getDate() + 14);
        if (new Date() >= staleDate) {
          items.push({
            id: `${application._id}-idle`,
            type: "idle",
            title: `No update for ${application.companyName}`,
            description: "Follow up to keep momentum",
            date: staleDate,
            badge: getDayLabel(staleDate),
            status,
          });
        }
      }
    });

    return items.sort((a, b) => a.date - b.date);
  }, [externalApplications, interviewsByApplication]);

  const recentActivity = useMemo(() => {
    const items = [];

    applications.forEach((application) => {
      const createdAt = application.createdAt ? new Date(application.createdAt) : null;
      if (!createdAt || Number.isNaN(createdAt.getTime())) return;

      items.push({
        id: `quickhire-${application._id}`,
        title: `Applied to ${application.job?.company || "a company"}`,
        description: application.job?.title || "QuickHire application",
        timestamp: createdAt.toLocaleDateString(),
        sortDate: createdAt,
        badge: application.status || "Applied",
      });
    });

    externalApplications.forEach((application) => {
      const updatedAt = application.updatedAt ? new Date(application.updatedAt) : null;
      const createdAt = application.createdAt ? new Date(application.createdAt) : null;

      if (createdAt && !Number.isNaN(createdAt.getTime())) {
        items.push({
          id: `external-created-${application._id}`,
          title: `Added ${application.companyName}`,
          description: `${application.role} via ${application.platform}`,
          timestamp: createdAt.toLocaleDateString(),
          sortDate: createdAt,
          badge: application.status,
        });
      }

      if (updatedAt && !Number.isNaN(updatedAt.getTime())) {
        items.push({
          id: `external-updated-${application._id}`,
          title: `${application.companyName} status is ${application.status}`,
          description: application.favorite ? "Favorited application" : "Application updated",
          timestamp: updatedAt.toLocaleDateString(),
          sortDate: updatedAt,
          badge: application.priority,
        });
      }
    });

    Object.entries(interviewsByApplication).forEach(([applicationId, rounds]) => {
      const application = externalApplications.find((entry) => entry._id === applicationId);
      rounds.forEach((round) => {
        const scheduledAt = round.scheduledAt ? new Date(round.scheduledAt) : null;
        if (!scheduledAt || Number.isNaN(scheduledAt.getTime())) return;

        items.push({
          id: `interview-${round._id}`,
          title: `${round.status} interview at ${application?.companyName || "company"}`,
          description: `${round.roundName || "Interview"} - ${round.roundType || "Round"}`,
          timestamp: scheduledAt.toLocaleDateString(),
          sortDate: scheduledAt,
          badge: round.status,
        });
      });
    });

    return items
      .sort((a, b) => b.sortDate - a.sortDate)
      .slice(0, 8);
  }, [applications, externalApplications, interviewsByApplication]);

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
        onRetry={fetchDashboardData}
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
              {stats.total} total applications · {hasResume ? "Resume ready" : "Resume needed"} · {stats.active} active
            </p>
          </div>
          <AppButtonLink to="/jobs" size="md" className="shrink-0 shadow-sm">
            Browse Jobs
          </AppButtonLink>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              compact
              title="Total applications"
              value={stats.total}
              icon={<ClipboardList />}
              description="Across QuickHire and external sources"
            />
            <StatCard
              compact
              title="Active applications"
              value={stats.active}
              icon={<FileText />}
              description="Still in motion"
            />
            <StatCard
              compact
              title="Interviews scheduled"
              value={stats.interviews}
              icon={<CalendarDays />}
              description="Upcoming and active rounds"
            />
            <StatCard
              compact
              title="Offers"
              value={stats.offers}
              icon={<CheckCircle2 />}
              description="Needs your attention"
            />
            <StatCard
              compact
              title="Rejections"
              value={stats.rejections}
              icon={<AlertCircle />}
              description="Closed out"
            />
          </div>

          <SectionCard
            title="Upcoming"
            subtitle="Priority reminders and what needs attention next."
          >
            {upcomingItems.length === 0 ? (
              <EmptyState
                embedded
                title="No upcoming items"
                message="You’re all caught up for now."
                hideAction
              />
            ) : (
              <div className="space-y-3">
                {upcomingItems.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <span className="rounded-full bg-brand-light px-2.5 py-1 text-[11px] font-medium text-brand">
                          {item.badge}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                    </div>
                    <div className="text-sm text-slate-500">
                      {item.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

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

          <SectionCard
            title="Activity Feed"
            subtitle="Recent application, interview, and status activity."
          >
            <ActivityFeed items={recentActivity} />
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
