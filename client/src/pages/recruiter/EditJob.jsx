import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getSingleJob, updateJob } from "../../api/jobApi";
import JobForm from "../../components/jobs/JobForm";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { getErrorMessage, showErrorToast } from "../../utils/errorMessage";
import AppCard from "../../components/ui/AppCard";
import PageHeader from "../../components/ui/PageHeader";

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    salary: "",
    description: "",
    requirements: "",
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSingleJob(id);
      const job = data.job;

      setFormData({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        jobType: job.jobType || "",
        salary: job.salary || "",
        description: job.description || "",
        requirements: Array.isArray(job.requirements)
          ? job.requirements.join(", ")
          : job.requirements || "",
      });
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load job"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        salary: formData.salary.trim(),
        requirements: formData.requirements
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await updateJob(id, payload);
      toast.success("Job updated successfully");
      navigate("/recruiter/jobs");
    } catch (error) {
      showErrorToast(error, "Failed to update job");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading job..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load job"
        message={error}
        onRetry={fetchJob}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Edit Job"
        description="Update your job details and requirements"
      />

      <AppCard hover={false} className="p-8">
        <JobForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={submitting}
          buttonText="Update Job"
        />
      </AppCard>
    </div>
  );
};

export default EditJob;
