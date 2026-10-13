import API from "./authApi";

export const getStudents = async (params = {}) => {
  const { data } = await API.get("/students", { params });
  return data;
};

export const getStudentById = async (id) => {
  const { data } = await API.get(`/students/${id}`);
  return data;
};

/**
 * Build multipart body. Never JSON-stringify the file.
 * Field name for photo MUST be: passport
 */
const buildStudentFormData = (payload = {}) => {
  const formData = new FormData();

  const skip = new Set(["passport"]);

  Object.entries(payload).forEach(([key, value]) => {
    if (skip.has(key)) return;
    if (value === null || value === undefined) return;
    // avoid "null" / "undefined" strings
    if (value === "") {
      formData.append(key, "");
      return;
    }
    formData.append(key, String(value));
  });

  const file = payload.passport;
  if (file instanceof File || file instanceof Blob) {
    formData.append(
      "passport",
      file,
      file.name || "passport.jpg"
    );
  }

  return formData;
};

export const createStudent = async (payload) => {
  const formData = buildStudentFormData(payload);

  // Debug in browser console
  console.log("📤 createStudent keys:", [...formData.keys()]);
  console.log("📤 has passport file:", formData.get("passport") instanceof File);

  const { data } = await API.post("/students", formData, {
    headers: {
      // Let browser set boundary — critical
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateStudent = async (id, payload) => {
  const formData = buildStudentFormData(payload);

  console.log("📤 updateStudent keys:", [...formData.keys()]);
  console.log("📤 has passport file:", formData.get("passport") instanceof File);

  const { data } = await API.patch(`/students/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const importStudents = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await API.post("/students/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteStudent = async (id) => {
  const { data } = await API.delete(`/students/${id}`);
  return data;
};

export const activateStudent = async (id) => {
  const { data } = await API.patch(`/students/${id}/activate`);
  return data;
};

export const promoteStudents = async (payload) => {
  const { data } = await API.post("/students/promote", payload);
  return data;
};

export const regenerateStudentPassword = async (id) => {
  const { data } = await API.post(`/students/${id}/regenerate-password`);
  return data;
};