import API from "./authApi";

export const getAcademicSettings = async () => {
  const { data } = await API.get("/academic-settings");
  return data;
};

export const updateAcademicSettings = async (payload) => {
  const { data } = await API.put("/academic-settings", payload);
  return data;
};

export const uploadOfficialSignature = async (role, file, name = "") => {
  const formData = new FormData();
  formData.append("signature", file);
  if (name) formData.append("name", name);

  const { data } = await API.post(
    `/academic-settings/signatures/${role}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

export const removeOfficialSignature = async (role) => {
  const { data } = await API.delete(`/academic-settings/signatures/${role}`);
  return data;
};  