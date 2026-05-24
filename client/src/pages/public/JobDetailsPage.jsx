import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getSingleJob } from "../../api/jobApi";
import { applyToJob } from "../../api/applicationApi";

import { useAuth } from "../../context/AuthContext";

import toast from "react-hot-toast";

const JobDetailsPage = () => {
  const { id } = useParams();

  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);

        const data = await getSingleJob(id);

        setJob(data.job);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch job"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (user.role !== "candidate") {
      toast.error(
        "Only candidates can apply"
      );
      return;
    }

    try {
      setApplying(true);

      const data = await applyToJob(job._id);

      toast.success(
        data.message || "Applied successfully"
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Application failed"
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <h2>Loading job details...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!job) {
    return <h2>Job not found</h2>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">
        {job.title}
      </h1>

      <p>
        <strong>Company:</strong>{" "}
        {job.company}
      </p>

      <p>
        <strong>Location:</strong>{" "}
        {job.location}
      </p>

      <p>
        <strong>Job Type:</strong>{" "}
        {job.jobType}
      </p>

      <p>
        <strong>Description:</strong>
      </p>

      <p>{job.description}</p>

      <button
        onClick={handleApply}
        disabled={applying}
        className="border px-4 py-2 rounded"
      >
        {applying
          ? "Applying..."
          : "Apply Now"}
      </button>
    </div>
  );
};

export default JobDetailsPage;