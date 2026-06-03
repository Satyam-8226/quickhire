import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

import { getMyJobs, deleteJob } from "../../api/jobApi";
import JobCard from "../../components/jobs/JobCard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/ui/PageHeader";
import { AppButtonLink } from "../../components/ui/AppButton";
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

    if (!confirm) return;

    try {
      const data = await deleteJob(jobId);
      toast.success(data.message || "Job deleted successfully");
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete job"));
    }
  };

  const handleEdit = (jobId) => {
    navigate(`/recruiter/edit-job/${jobId}`);
  };

  if (loading) {
    return <Loader message="Loading your jobs..." />;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="My Job Postings"
        description="Manage all your job listings"
        cta={
          <AppButtonLink to="/recruiter/create-job" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Job
          </AppButtonLink>
        }
      />

      {error && !loading && (
        <ErrorState
          title="Failed to load jobs"
          message={error}
          onRetry={fetchJobs}
        />
      )}

      {!error && jobs.length > 0 && (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              showActions
              onViewApplicants={(jobId) =>
                navigate(`/recruiter/jobs/${jobId}/applicants`)
              }
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {!error && jobs.length === 0 && (
        <EmptyState
          title="No jobs posted yet"
          message="Create your first job posting to get started"
          buttonText="Create Job"
          buttonLink="/recruiter/create-job"
        />
      )}
    </div>
  );
}

export default RecruiterJobs;
