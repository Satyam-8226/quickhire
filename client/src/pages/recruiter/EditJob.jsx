import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

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

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] =
    useState({
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

      const data =
        await getSingleJob(id);

      const job = data.job;

      setFormData({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        jobType:
          job.jobType || "",
        salary: job.salary || "",
        description:
          job.description || "",

        requirements:
          Array.isArray(
            job.requirements
          )
            ? job.requirements.join(
                ", "
              )
            : job.requirements || "",
      });
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
          "Failed to load job"
      );
    } finally {
      setLoading(false);
    }
  };

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

      const payload = {
        ...formData,

        salary: formData.salary.trim(),

        requirements:
          formData.requirements
            .split(",")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean),
      };

      await updateJob(
        id,
        payload
      );

      toast.success(
        "Job updated successfully"
      );

      navigate(
        "/recruiter/jobs"
      );
    } catch (error) {
      console.log(error);

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
        onRetry={fetchJob}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Edit Job
          </h1>

          <p className="text-gray-600">
            Update your job details and
            requirements
          </p>
        </div>

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