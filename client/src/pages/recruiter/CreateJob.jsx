import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createJob } from "../../api/jobApi";
import JobForm from "../../components/jobs/JobForm";
import { showErrorToast } from "../../utils/errorMessage";

const CreateJob = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    salary: "",
    description: "",
    requirements: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,

        salary: formData.salary.trim(),

        requirements: formData.requirements
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await createJob(payload);

      toast.success(
        "Job created successfully"
      );

      navigate("/recruiter/jobs");
    } catch (error) {
      showErrorToast(error, "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6">
          Create New Job
        </h1>

        <JobForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          buttonText="Create Job"
        />
      </div>
    </div>
  );
};

export default CreateJob;