import API from "./authApi";

export const getResultsOverview = async (params = {}) => {
  const { data } = await API.get("/results/overview", { params });
  return data;
};

export const getEntrySheet = async (params) => {
  const { data } = await API.get("/results/entry-sheet", { params });
  return data;
};

export const saveScores = async (payload) => {
  const { data } = await API.post("/results/scores", payload);
  return data;
};

export const getStudentReport = async (studentId, params = {}) => {
  const { data } = await API.get(`/results/report/${studentId}`, { params });
  return data;
};

export const getTermReport = async (studentId, params = {}) => {
  const { data } = await API.get(`/results/term-report/${studentId}`, {
    params,
  });
  return data;
};

export const saveTermReport = async (studentId, payload) => {
  const { data } = await API.put(`/results/term-report/${studentId}`, payload);
  return data;
};

export const publishClassResults = async (payload) => {
  const { data } = await API.post("/results/publish", payload);
  return data;
};

export const unpublishClassResults = async (payload) => {
  const { data } = await API.post("/results/unpublish", payload);
  return data;
};  