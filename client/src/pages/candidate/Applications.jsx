import { useEffect, useState } from "react";

import { getMyApplications } from "../../api/applicationApi";

const ApplicationsPage = () => {
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchApplications =
      async () => {
        try {
          setLoading(true);

          const data =
            await getMyApplications();

          setApplications(
            data.applications
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

  if (loading) {
    return (
      <h2>Loading applications...</h2>
    );
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        My Applications
      </h1>

      {applications.length === 0 ? (
        <p>
          You have not applied to any jobs
          yet.
        </p>
      ) : (
        applications.map((application) => (
          <div
            key={application._id}
            className="border p-4 rounded"
          >
            <h2 className="text-xl font-semibold">
              {
                application.job
                  ?.title
              }
            </h2>

            <p>
              Company:{" "}
              {
                application.job
                  ?.company
              }
            </p>

            <p>
              Status:{" "}
              {application.status}
            </p>

            <p>
              Applied On:{" "}
              {new Date(
                application.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicationsPage;