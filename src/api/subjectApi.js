import API from "./authApi";

export const getSubjects = async (params = {}) => {
  const query =
    typeof params === "string"
      ? { search: params || undefined }
      : {
          search: params.search || undefined,
          levelBand: params.levelBand || undefined,
          category: params.category || undefined,
        };

  const { data } = await API.get("/subjects", { params: query });
  return data;
};

export const createSubject = async (payload) => {
  const { data } = await API.post("/subjects", payload);
  return data;
};

export const updateSubject = async (id, payload) => {
  const { data } = await API.patch(`/subjects/${id}`, payload);
  return data;
};

export const deleteSubject = async (id) => {
  const { data } = await API.delete(`/subjects/${id}`);
  return data;
};