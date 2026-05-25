import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyJobs } from "../../api/jobApi";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { BarChart3, Briefcase, Plus } from "lucide-react";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchDashboardData =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getMyJobs();

          setJobs(data.jobs || []);
        } catch (err) {
          setError(
            err.response?.data
              ?.message ||
              "Failed to fetch dashboard data"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchDashboardData();
  }, []);

  const totalJobs = jobs.length;

  const totalApplicants =
    jobs.reduce((acc, job) => {
      return (
        acc +
        (job.applicants?.length || 0)
      );
    }, 0);

  if (loading) {
    return (
      <Loader message="Loading dashboard..." />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message={error}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Recruiter Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your job postings and applicants
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Total Jobs Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase mb-2">
                Active Jobs
              </p>
              <p className="text-4xl font-bold text-gray-900">
                {totalJobs}
              </p>
            </div>
            <Briefcase className="w-12 h-12 text-gray-300" />
          </div>
        </div>

        {/* Total Applicants Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-gray-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase mb-2">
                Total Applicants
              </p>
              <p className="text-4xl font-bold text-gray-900">
                {totalApplicants}
              </p>
            </div>
            <BarChart3 className="w-12 h-12 text-gray-300" />
          </div>
        </div>

        {/* Create Job Card */}
        <Link
          to="/recruiter/create-job"
          className="bg-black text-white rounded-lg shadow-sm p-8 flex items-center justify-between hover:opacity-90 transition"
        >
          <div>
            <p className="text-white/80 text-sm font-semibold uppercase mb-2">
              Quick Action
            </p>
            <p className="text-2xl font-bold">
              Post a Job
            </p>
          </div>
          <Plus className="w-12 h-12 text-white/50" />
        </Link>
      </div>

      {/* Recent Jobs Section */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Recent Job Postings
          </h2>
          <Link
            to="/recruiter/jobs"
            className="text-black font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              You haven't posted any jobs yet
            </p>
            <Link
              to="/recruiter/create-job"
              className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
            >
              Create Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs
              .slice(0, 5)
              .map((job) => (
                <div
                  key={job._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {job.company}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      {new Date(
                        job.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-1">
                    {job.description}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;