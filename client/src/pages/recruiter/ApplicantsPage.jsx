import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getJobApplicants,
  updateApplicationStatus,
} from "../../api/applicationApi";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import toast from "react-hot-toast";

import {
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Mail,
  User,
} from "lucide-react";

const ApplicantsPage = () => {
  const { id } = useParams();

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getJobApplicants(id);

      setApplications(
        data.applications || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch applicants"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate =
    async (
      applicationId,
      status
    ) => {
      try {
        await updateApplicationStatus(
          applicationId,
          status
        );

        toast.success(
          "Status updated successfully"
        );

        setApplications((prev) =>
          prev.map((app) =>
            app._id ===
            applicationId
              ? {
                  ...app,
                  status,
                }
              : app
          )
        );
      } catch (err) {
        toast.error(
          err.response?.data
            ?.message ||
            "Failed to update status"
        );
      }
    };

  const getStatusIcon = (status) => {
    const iconClass = "w-5 h-5";

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

  const getStatusStyles = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-50 border-green-200";
      case "rejected":
        return "bg-red-50 border-red-200";
      case "reviewed":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-yellow-50 border-yellow-200";
    }
  };

  const getStatusBadgeColor = (status) => {
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

  const handleRetry = () => {
    fetchApplicants();
  };

  if (loading) {
    return (
      <Loader message="Loading applicants..." />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load applicants"
        message={error}
        onRetry={handleRetry}
      />
    );
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        title="No applicants yet"
        message="No one has applied to this job posting yet"
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Job Applicants
        </h1>
        <p className="text-gray-600">
          {applications.length} candidate
          {applications.length !== 1
            ? "s"
            : ""}{" "}
          applied for this position
        </p>
      </div>

      {/* Applicants List */}
      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application._id}
            className={`rounded-lg border-2 p-6 transition ${getStatusStyles(
              application.status
            )}`}
          >
            {/* Applicant Info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="shrink-0">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {
                        application
                          .applicant
                          ?.name ||
                          "Unknown Candidate"
                      }
                    </h2>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>
                        {
                          application
                            .applicant
                            ?.email ||
                            "No email"
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Cover Letter
                    </p>
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {
                        application
                          .coverLetter
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${getStatusBadgeColor(
                  application.status
                )}`}
              >
                {getStatusIcon(
                  application.status
                )}
                <span className="capitalize">
                  {application.status}
                </span>
              </div>
            </div>

            {/* Resume Link */}
            {application.resume && (
              <div className="mb-4">
                <a
                  href={application.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-black font-medium hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  View Resume
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() =>
                  handleStatusUpdate(
                    application._id,
                    "reviewed"
                  )
                }
                disabled={
                  application.status ===
                  "reviewed"
                }
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {application.status ===
                "reviewed"
                  ? "Reviewed"
                  : "Mark Reviewed"}
              </button>

              <button
                onClick={() =>
                  handleStatusUpdate(
                    application._id,
                    "accepted"
                  )
                }
                disabled={
                  application.status ===
                  "accepted"
                }
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {application.status ===
                "accepted"
                  ? "Accepted"
                  : "Accept"}
              </button>

              <button
                onClick={() =>
                  handleStatusUpdate(
                    application._id,
                    "rejected"
                  )
                }
                disabled={
                  application.status ===
                  "rejected"
                }
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {application.status ===
                "rejected"
                  ? "Rejected"
                  : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicantsPage;