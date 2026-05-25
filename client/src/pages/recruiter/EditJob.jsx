import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getSingleJob,
  updateJob,
} from "../../api/jobApi";
import JobForm from "../../components/jobs/JobForm";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getSingleJob(id);

        const job = data.job;

        setFormData({
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.jobType,
          salary: job.salary || "",
          description: job.description,
          requirements: Array.isArray(
            job.requirements
          )
            ? job.requirements.join(
                "\n"
              )
            : job.requirements || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load job"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const jobData = {
        ...formData,
        jobType: formData.type,
        salary: formData.salary
          ? Number(formData.salary)
          : 0,
        requirements: formData.requirements
          .split("\n")
          .filter((r) => r.trim()),
      };

      await updateJob(id, jobData);

      toast.success("Job updated successfully");

      navigate("/recruiter/jobs");
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Failed to update job"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Loader message="Loading job..." />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load job"
        message={error}
        onRetry={() => {
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6">
          Edit Job
        </h1>

        <JobForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={submitting}
          buttonText="Update Job"
        />
      </div>
    </div>
  );
};

export default EditJob;
