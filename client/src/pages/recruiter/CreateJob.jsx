import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createJob } from "../../api/jobApi";
import JobForm from "../../components/jobs/JobForm";
import { showErrorToast } from "../../utils/errorMessage";
import AppCard from "../../components/ui/AppCard";
import PageHeader from "../../components/ui/PageHeader";

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
      toast.success("Job created successfully");
      navigate("/recruiter/jobs");
    } catch (error) {
      showErrorToast(error, "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Create New Job"
        description="Publish a new opening and start receiving applications from qualified candidates."
      />

      <AppCard hover={false} className="p-8">
        <JobForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          buttonText="Create Job"
        />
      </AppCard>
    </div>
  );
};

export default CreateJob;
