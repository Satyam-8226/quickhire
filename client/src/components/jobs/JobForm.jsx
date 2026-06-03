import AppInput from "../ui/AppInput";
import AppSelect from "../ui/AppSelect";
import AppTextarea from "../ui/AppTextarea";
import AppButton from "../ui/AppButton";

const JobForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  buttonText,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AppInput
        label="Job Title"
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Frontend Developer"
        required
      />

      <AppInput
        label="Company"
        type="text"
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="Google"
        required
      />

      <div className="grid gap-6 md:grid-cols-3">
        <AppInput
          label="Location"
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Bangalore"
          required
        />

        <AppSelect
          label="Job Type"
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </AppSelect>

        <AppInput
          label="Salary"
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="12 LPA"
        />
      </div>

      <AppTextarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={6}
        placeholder="Enter job description"
        required
      />

      <AppTextarea
        label="Requirements"
        name="requirements"
        value={formData.requirements}
        onChange={handleChange}
        rows={5}
        placeholder="React, Node.js, MongoDB..."
        required
      />

      <AppButton type="submit" disabled={loading}>
        {loading ? "Processing..." : buttonText}
      </AppButton>
    </form>
  );
};

export default JobForm;
