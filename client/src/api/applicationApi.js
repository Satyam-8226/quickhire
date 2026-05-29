import api from "./axios";

export const applyToJob = async (jobId) => {
  const response = await api.post(
    `/applications/${jobId}`
  );

  return response.data;
};

export const getMyApplications =
  async () => {
    const response = await api.get(
      "/applications/me"
    );

    return response.data;
  };

export const getJobApplicants =
  async (jobId) => {
    const response = await api.get(
      `/applications/job/${jobId}`
    );

    return response.data;
  };

export const updateApplicationStatus =
  async (applicationId, status) => {
    const response = await api.put(
      `/applications/${applicationId}`,
      { status }
    );

    return response.data;
  };

export const uploadResume = async (formData) => {
  const response = await api.put(
    "/applications/upload-resume",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};