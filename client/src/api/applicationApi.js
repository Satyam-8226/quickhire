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

export const getMyResumes = async () => {
  const response = await api.get('/applications/resumes');
  return response.data;
};

export const activateResume = async (versionId) => {
  const response = await api.patch(`/applications/resumes/${versionId}/activate`);
  return response.data;
};

export const getMyExternalApplications = async () => {
  const response = await api.get('/external-applications');
  return response.data;
};

export const createExternalApplication = async (payload) => {
  const response = await api.post('/external-applications', payload);
  return response.data;
};

export const updateExternalApplication = async (id, payload) => {
  const response = await api.put(`/external-applications/${id}`, payload);
  return response.data;
};

export const deleteExternalApplication = async (id) => {
  const response = await api.delete(`/external-applications/${id}`);
  return response.data;
};

export const getInterviewRounds = async (externalApplicationId) => {
  const response = await api.get(`/external-applications/${externalApplicationId}/interviews`);
  return response.data;
};

export const createInterviewRound = async (externalApplicationId, payload) => {
  const response = await api.post(`/external-applications/${externalApplicationId}/interviews`, payload);
  return response.data;
};

export const updateInterviewRound = async (id, payload) => {
  const response = await api.put(`/interviews/${id}`, payload);
  return response.data;
};

export const deleteInterviewRound = async (id) => {
  const response = await api.delete(`/interviews/${id}`);
  return response.data;
};