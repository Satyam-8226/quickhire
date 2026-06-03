import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getMyJobs,
  deleteJob,
} from "../../api/jobApi";
import JobCard from "../../components/jobs/JobCard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import { Plus } from "lucide-react";
import { getErrorMessage } from "../../utils/errorMessage";

function RecruiterJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyJobs();

      setJobs(data.jobs);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to fetch jobs");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirm) {
      return;
    }

    try {
      const data = await deleteJob(jobId);

      toast.success(
        data.message ||
          "Job deleted successfully"
      );

      setJobs((prev) =>
        prev.filter((job) => job._id !== jobId)
      );
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete job"));
    }
  };

  const handleEdit = (jobId) => {
    navigate(`/recruiter/edit-job/${jobId}`);
  };

  const handleRetry = () => {
    fetchJobs();
  };

  if (loading) {
    return <Loader message="Loading your jobs..." />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            My Job Postings
          </h1>
          <p className="text-gray-600">
            Manage all your job listings
          </p>
        </div>

        <Link
          to="/recruiter/create-job"
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          Create Job
        </Link>
      </div>

      {/* Error State */}
      {error && !loading && (
        <ErrorState
          title="Failed to load jobs"
          message={error}
          onRetry={handleRetry}
        />
      )}

      {/* Jobs List */}
      {!error && jobs.length > 0 && (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              showActions={true}
              onViewApplicants={(jobId) => navigate(`/recruiter/jobs/${jobId}/applicants`)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!error && jobs.length === 0 && (
        <EmptyState
          title="No jobs posted yet"
          message="Create your first job posting to get started"
        />
      )}
    </div>
  );
}

export default RecruiterJobs;