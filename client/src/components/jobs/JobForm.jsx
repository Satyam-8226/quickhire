import React from "react";

const JobForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  buttonText,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="block mb-2 font-medium">
          Job Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Frontend Developer"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Company
        </label>

        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Google"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2 font-medium">
            Location
          </label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Bangalore"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Job Type
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            required
          >
            <option value="">Select Type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Salary
          </label>

          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="12 LPA"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="6"
          placeholder="Enter job description"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Requirements
        </label>

        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows="5"
          placeholder="React, Node.js, MongoDB..."
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Processing..." : buttonText}
      </button>
    </form>
  );
};

export default JobForm;