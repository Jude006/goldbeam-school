import API from "./authApi"; // your axios instance with token

export const getAdmissions = async (params = {}) => {
  const { data } = await API.get("/admissions", { params });
  return data;
};

export const getAdmissionById = async (id) => {
  const { data } = await API.get(`/admissions/${id}`);
  return data;
};

export const updateAdmission = async (id, payload) => {
  const { data } = await API.patch(`/admissions/${id}`, payload);
  return data;
};