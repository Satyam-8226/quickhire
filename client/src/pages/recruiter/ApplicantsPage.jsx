import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getJobApplicants,
  updateApplicationStatus,
} from "../../api/applicationApi";

import toast from "react-hot-toast";

const ApplicantsPage = () => {
  const { id } = useParams();

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchApplicants =
      async () => {
        try {
          setLoading(true);

          const data =
            await getJobApplicants(id);

          setApplications(
            data.applications
          );
        } catch (err) {
          setError(
            err.response?.data
              ?.message ||
              "Failed to fetch applicants"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchApplicants();
  }, [id]);

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
          "Status updated"
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

  if (loading) {
    return (
      <h2>Loading applicants...</h2>
    );
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Applicants
      </h1>

      {applications.length === 0 ? (
        <p>No applicants found</p>
      ) : (
        applications.map((application) => (
          <div
            key={application._id}
            className="border p-4 rounded space-y-2"
          >
            <h2 className="text-xl font-semibold">
              {
                application
                  .candidate
                  ?.name
              }
            </h2>

            <p>
              Email:{" "}
              {
                application
                  .candidate
                  ?.email
              }
            </p>

            <p>
              Status:{" "}
              {application.status}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleStatusUpdate(
                    application._id,
                    "shortlisted"
                  )
                }
                className="border px-3 py-1 rounded"
              >
                Shortlist
              </button>

              <button
                onClick={() =>
                  handleStatusUpdate(
                    application._id,
                    "rejected"
                  )
                }
                className="border px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicantsPage;