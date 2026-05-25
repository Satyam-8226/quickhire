import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../api/applicationApi";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import {
  ClipboardList,
  Briefcase,
  FileText,
  CheckCircle2,
} from "lucide-react";

function CandidateDashboard() {
  const [applications, setApplications] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getMyApplications();

        setApplications(
          data.applications || []
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Failed to fetch applications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalApplications =
    applications.length;
  const acceptedApplications =
    applications.filter(
      (app) => app.status === "accepted"
    ).length;
  const pendingApplications =
    applications.filter(
      (app) => app.status === "pending"
    ).length;

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
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-600">
          Track your job applications and progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {/* Total Applications */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase mb-2">
                Total Applications
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {totalApplications}
              </p>
            </div>
            <ClipboardList className="w-10 h-10 text-gray-300" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase mb-2">
                Pending Review
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {pendingApplications}
              </p>
            </div>
            <FileText className="w-10 h-10 text-gray-300" />
          </div>
        </div>

        {/* Accepted */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase mb-2">
                Accepted Offers
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {acceptedApplications}
              </p>
            </div>
            <CheckCircle2 className="w-10 h-10 text-gray-300" />
          </div>
        </div>

        {/* Browse Jobs */}
        <Link
          to="/jobs"
          className="bg-black text-white rounded-lg shadow-sm p-6 flex items-center justify-between hover:opacity-90 transition"
        >
          <div>
            <p className="text-white/80 text-sm font-semibold uppercase mb-2">
              Find More
            </p>
            <p className="text-xl font-bold">
              Browse Jobs
            </p>
          </div>
          <Briefcase className="w-10 h-10 text-white/50" />
        </Link>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Recent Applications
          </h2>
          <Link
            to="/candidate/applications"
            className="text-black font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              You haven't applied to any jobs yet
            </p>
            <Link
              to="/jobs"
              className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
            >
              Start Exploring Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications
              .slice(0, 5)
              .map((application) => (
                <div
                  key={application._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {
                          application.job
                            ?.title
                        }
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {
                          application.job
                            ?.company
                        }
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold uppercase px-3 py-1 rounded ${
                        application.status ===
                        "accepted"
                          ? "bg-green-100 text-green-700"
                          : application.status ===
                            "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Applied on{" "}
                    {new Date(
                      application.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateDashboard;