import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getMyApplications } from "../../api/applicationApi";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import {
  ClipboardList,
  Briefcase,
  FileText,
  CheckCircle2,
} from "lucide-react";

const CandidateDashboard = () => {
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getMyApplications();

      setApplications(
        data?.applications || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const totalApplications =
    applications.length;

  const acceptedApplications =
    applications.filter(
      (application) =>
        application.status ===
        "accepted"
    ).length;

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status ===
        "pending"
    ).length;

  const recentApplications =
    applications.slice(0, 5);

  const getStatusStyles = (
    status
  ) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "reviewed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

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
        onRetry={fetchApplications}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Candidate Dashboard
        </h1>

        <p className="text-gray-600">
          Track your applications and monitor
          your hiring progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Applications */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-gray-500 mb-2">
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
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-gray-500 mb-2">
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
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-gray-500 mb-2">
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
          className="bg-black text-white rounded-xl shadow-sm p-6 flex items-center justify-between hover:opacity-90 transition"
        >
          <div>
            <p className="text-sm font-semibold uppercase text-white/70 mb-2">
              Explore
            </p>

            <p className="text-xl font-bold">
              Browse Jobs
            </p>
          </div>

          <Briefcase className="w-10 h-10 text-white/40" />
        </Link>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-sm p-8">
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

        {recentApplications.length ===
        0 ? (
          <EmptyState
            title="No applications yet"
            message="You haven't applied to any jobs yet. Start exploring opportunities now."
          />
        ) : (
          <div className="space-y-4">
            {recentApplications.map(
              (application) => (
                <div
                  key={application._id}
                  className="border rounded-xl p-5 hover:shadow-sm transition"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.job
                          ?.title ||
                          "Untitled Job"}
                      </h3>

                      <p className="text-gray-600 text-sm">
                        {application.job
                          ?.company ||
                          "Unknown Company"}
                      </p>
                    </div>

                    <span
                      className={`w-fit text-xs font-semibold uppercase px-3 py-1 rounded-full ${getStatusStyles(
                        application.status
                      )}`}
                    >
                      {
                        application.status
                      }
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
                    <p>
                      Applied on{" "}
                      {new Date(
                        application.createdAt
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      {application.job
                        ?.location ||
                        "Location not specified"}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;