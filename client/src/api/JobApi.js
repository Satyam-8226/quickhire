import api from "./axios";

export const getAllJobs = async ({
  keyword = "",
  location = "",
  jobType = "",
  page = 1,
  limit = 10,
}) => {
  const query = new URLSearchParams({
    keyword,
    location,
    jobType,
    page,
    limit,
  });

  const { data } = await api.get(
    `/jobs?${query.toString()}`
  );

  return data;
};

export const getMyJobs = async (
  params = {}
) => {
  const response = await api.get(
    "/jobs/my-jobs",
    {
      params,
    }
  );

  return response.data;
};

export const getSingleJob = async (
  id
) => {
  const response = await api.get(
    `/jobs/${id}`
  );

  return response.data;
};

export const createJob = async (jobData) => {
  const response = await api.post("/jobs", jobData);
  return response.data;
};

export const updateJob = async (
  id,
  jobData
) => {
  const response = await api.put(
    `/jobs/${id}`,
    jobData
  );

  return response.data;
};

export const deleteJob = async (
  id
) => {
  const response = await api.delete(
    `/jobs/${id}`
  );

  return response.data;
};

export const getRecruiterStats = async () => {
  const { data } = await api.get("/jobs/stats");
  return data;
};