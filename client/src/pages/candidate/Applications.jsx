import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { getMyApplications } from "../../api/applicationApi";
import { getErrorMessage } from "../../utils/errorMessage";

import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

import {
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";

const Applications = () => {
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
      const message = getErrorMessage(err, "Failed to fetch applications");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const iconClass =
      "w-5 h-5";

    switch (status) {
      case "accepted":
        return (
          <CheckCircle2
            className={`${iconClass} text-green-500`}
          />
        );

      case "rejected":
        return (
          <XCircle
            className={`${iconClass} text-red-500`}
          />
        );

      case "reviewed":
        return (
          <FileText
            className={`${iconClass} text-blue-500`}
          />
        );

      default:
        return (
          <Clock
            className={`${iconClass} text-yellow-500`}
          />
        );
    }
  };

  const getStatusStyles = (
    status
  ) => {
    switch (status) {
      case "accepted":
        return {
          card: "bg-green-50 border-green-200",
          badge:
            "bg-green-100 text-green-700",
        };

      case "rejected":
        return {
          card: "bg-red-50 border-red-200",
          badge:
            "bg-red-100 text-red-700",
        };

      case "reviewed":
        return {
          card: "bg-blue-50 border-blue-200",
          badge:
            "bg-blue-100 text-blue-700",
        };

      default:
        return {
          card: "bg-yellow-50 border-yellow-200",
          badge:
            "bg-yellow-100 text-yellow-700",
        };
    }
  };

  if (loading) {
    return (
      <Loader message="Loading applications..." />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load applications"
        message={error}
        onRetry={fetchApplications}
      />
    );
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        title="No applications yet"
        message="You haven't applied to any jobs yet. Start exploring available opportunities."
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          My Applications
        </h1>

        <p className="text-gray-600">
          Track the status of all your job
          applications
        </p>
      </div>

      {/* Applications */}
      <div className="space-y-5">
        {applications.map(
          (application) => {
            const statusStyles =
              getStatusStyles(
                application.status
              );

            return (
              <div
                key={application._id}
                className={`border rounded-xl p-6 transition hover:shadow-md ${statusStyles.card}`}
              >
                {/* Top Section */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {application.job?.title ||
                        "Untitled Job"}
                    </h2>

                    <p className="text-gray-700 font-medium">
                      {application.job?.company ||
                        "Unknown Company"}
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold w-fit ${statusStyles.badge}`}
                  >
                    {getStatusIcon(
                      application.status
                    )}

                    <span className="capitalize">
                      {
                        application.status
                      }
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-5">
                  <div>
                    <p className="text-gray-500 uppercase text-xs mb-1">
                      Location
                    </p>

                    <p className="font-medium text-gray-800">
                      {application.job?.location ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 uppercase text-xs mb-1">
                      Job Type
                    </p>

                    <p className="font-medium text-gray-800">
                      {application.job?.type ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 uppercase text-xs mb-1">
                      Applied On
                    </p>

                    <p className="font-medium text-gray-800">
                      {new Date(
                        application.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-gray-500 uppercase text-xs mb-2">
                    Description
                  </p>

                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {application.job
                      ?.description ||
                      "No description available"}
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Applications;