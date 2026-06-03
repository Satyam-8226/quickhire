import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMyJobs,
  getRecruiterStats,
} from "../../api/jobApi";
import StatsCard from "../../components/dashboard/StatsCard";
import ErrorState from "../../components/common/ErrorState";
import { Briefcase, Plus, Users, Clock, CheckCircle2, Eye, XCircle } from "lucide-react";
import DashboardSkeleton from "../../components/skeletons/DashboardSkeleton";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorMessage";

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
      <ErrorState
        title="Failed to load dashboard"
        message={error}
      />
    );
  }

  const statusData = [
    {
      name: "Pending",
      count: stats.pending,
      fill: "#f59e0b",
    },
    {
      name: "Reviewed",
      count: stats.reviewed,
      fill: "#2563eb",
    },
    {
      name: "Accepted",
      count: stats.accepted,
      fill: "#10b981",
    },
    {
      name: "Rejected",
      count: stats.rejected,
      fill: "#ef4444",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Monitor your jobs, track candidate interest, and manage applicant progress in one place.
          </p>
        </div>
        <Link
          to="/recruiter/create-job"
          className="inline-flex items-center gap-2 rounded-3xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
        >
          <Plus className="h-4 w-4" />
          Post New Job
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 mb-10">
        <StatsCard
          title="Jobs Posted"
          value={stats.totalJobs}
          icon={<Briefcase className="h-6 w-6" />}
        />
        <StatsCard
          title="Applicants"
          value={stats.totalApplicants}
          icon={<Users className="h-6 w-6" />}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatsCard
          title="Reviewed"
          value={stats.reviewed}
          icon={<Eye className="h-6 w-6" />}
        />
        <StatsCard
          title="Accepted"
          value={stats.accepted}
          icon={<CheckCircle2 className="h-6 w-6" />}
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="h-6 w-6" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Hiring Analytics</p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">Application Status Overview</h2>
            </div>
            <span className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">Live recruiter stats</span>
          </div>
            <div className="bg-white rounded-xl border p-8 mb-12">
              <h2 className="text-2xl font-bold mb-2">
                Application Analytics
              </h2>

              <p className="text-gray-500">
                Analytics charts coming soon.
              </p>
            </div>
          </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Recent Postings</p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">Latest Jobs</h2>
            </div>
            <Link
              to="/recruiter/jobs"
              className="text-sm font-semibold text-black hover:underline"
            >
              View All Jobs
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 p-8 text-center text-gray-600">
              <p className="text-lg font-semibold text-gray-900 mb-3">No job postings yet</p>
              <p className="mb-5 text-sm leading-6">Create your first opening and start attracting top candidates.</p>
              <Link
                to="/recruiter/create-job"
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
              >
                Create Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  className="rounded-3xl border border-gray-200 p-5 transition hover:border-black"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{job.company}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                        <Users className="h-4 w-4" />
                        {job.applicantCount || 0} applicants
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600 line-clamp-2">{job.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;

