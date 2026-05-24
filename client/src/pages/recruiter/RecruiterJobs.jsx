import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import {
  getAllJobs,
  deleteJob,
} from "../../api/jobApi";

function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchRecruiterJobs =
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
              "Failed to fetch jobs"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchRecruiterJobs();
  }, []);

  const handleDelete = async (
    jobId
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this job?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const data =
        await deleteJob(jobId);

      toast.success(
        data.message ||
          "Job deleted successfully"
      );

      setJobs((prev) =>
        prev.filter(
          (job) => job._id !== jobId
        )
      );
    } catch (err) {
      toast.error(
        err.response?.data
          ?.message ||
          "Failed to delete job"
      );
    }
  };

  if (loading) {
    return (
      <h2>Loading jobs...</h2>
    );
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          My Jobs
        </h1>

        <Link
          to="/recruiter/create-job"
          className="border px-4 py-2 rounded"
        >
          Create Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            className="border p-4 rounded space-y-2"
          >
            <h2 className="text-xl font-semibold">
              {job.title}
            </h2>

            <p>
              Company: {job.company}
            </p>

            <p>
              Location: {job.location}
            </p>

            <p>
              Job Type: {job.jobType}
            </p>

            <div className="flex gap-2">
              <Link
                to={`/jobs/${job._id}`}
                className="border px-3 py-1 rounded"
              >
                View
              </Link>

              <Link
                to={`/recruiter/jobs/${job._id}/applicants`}
                className="border px-3 py-1 rounded"
              >
                View Applicants
              </Link>

              <Link
                to={`/recruiter/jobs/edit/${job._id}`}
                className="border px-3 py-1 rounded"
              >
                Edit
              </Link>

              <button
                onClick={() =>
                  handleDelete(job._id)
                }
                className="border px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default RecruiterJobs;