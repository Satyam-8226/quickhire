import { useEffect, useState } from "react";
import { getMyApplications } from "../../api/applicationApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import { CheckCircle2, Clock, XCircle, FileText } from "lucide-react";

const Applications = () => {
  const [applications, setApplications] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications =
      async () => {
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

    fetchApplications();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        );
      case "rejected":
        return (
          <XCircle className="w-5 h-5 text-red-500" />
        );
      case "reviewed":
        return (
          <FileText className="w-5 h-5 text-blue-500" />
        );
      default:
        return (
          <Clock className="w-5 h-5 text-yellow-500" />
        );
    }
  };

  const getStatusColor = (status) => {
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
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          My Applications
        </h1>
        <p className="text-gray-600">
          Track all your job applications
        </p>
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map(
            (application) => (
              <div
                key={application._id}
                className={`border rounded-lg p-6 transition ${getStatusColor(
                  application.status
                )}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {
                        application.job
                          ?.title
                      }
                    </h2>

                    <p className="text-gray-600 font-medium">
                      {
                        application.job
                          ?.company
                      }
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(
                      application.status
                    )}
                    <span className="capitalize font-semibold text-gray-700">
                      {application.status}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase">
                      Location
                    </p>
                    <p className="font-medium">
                      {
                        application.job
                          ?.location
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs uppercase">
                      Job Type
                    </p>
                    <p className="font-medium">
                      {
                        application.job
                          ?.jobType
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs uppercase">
                      Applied On
                    </p>
                    <p className="font-medium">
                      {new Date(
                        application.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Description Preview */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {
                    application.job
                      ?.description
                  }
                </p>
              </div>
            )
          )}
        </div>
      ) : (
        <EmptyState
          title="No applications yet"
          message="You haven't applied to any jobs yet. Browse available jobs and start applying!"
        />
      )}
    </div>
  );
};

export default Applications;