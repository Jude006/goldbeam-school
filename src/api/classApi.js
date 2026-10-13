import API from "./authApi"; // same axios instance with token

export const getClasses = async (search = "") => {
  const { data } = await API.get("/classes", {
    params: search ? { search } : {},
  });
  return data;
};

export const getClassById = async (id) => {
  const { data } = await API.get(`/classes/${id}`);
  return data;
};

export const createClass = async (payload) => {
  const { data } = await API.post("/classes", payload);
  return data;
};

export const updateClass = async (id, payload) => {
  const { data } = await API.patch(`/classes/${id}`, payload);
  return data;
};

export const deleteClass = async (id) => {
  const { data } = await API.delete(`/classes/${id}`);
  return data;
};