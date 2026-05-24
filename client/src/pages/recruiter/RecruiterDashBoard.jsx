import { useEffect, useState } from "react";

import { getAllJobs } from "../../api/jobApi";

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

          const data =
            await getAllJobs();

          setJobs(data.jobs);
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
      <h2>
        Loading dashboard...
      </h2>
    );
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Recruiter Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-6 rounded">
          <h2 className="text-xl font-semibold">
            Total Jobs
          </h2>

          <p className="text-3xl mt-2">
            {totalJobs}
          </p>
        </div>

        <div className="border p-6 rounded">
          <h2 className="text-xl font-semibold">
            Total Applicants
          </h2>

          <p className="text-3xl mt-2">
            {totalApplicants}
          </p>
        </div>
      </div>

      <div className="border p-6 rounded">
        <h2 className="text-2xl font-semibold mb-4">
          Recent Jobs
        </h2>

        {jobs.length === 0 ? (
          <p>No jobs posted yet</p>
        ) : (
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div
                key={job._id}
                className="border p-3 rounded"
              >
                <h3 className="text-lg font-semibold">
                  {job.title}
                </h3>

                <p>
                  Company:{" "}
                  {job.company}
                </p>

                <p>
                  Location:{" "}
                  {job.location}
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