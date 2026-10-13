import axios from "axios";

// Must point at backend + /api, e.g. http://localhost:5000/api
const BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

export const submitContactForm = async (payload) => {
  const { data } = await axios.post(`${BASE}/public/contact`, payload);
  return data;
};

export const submitAdmissionForm = async (payload, passportFile = null) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value == null ? "" : String(value));
  });
  if (passportFile) {
    formData.append("passport", passportFile);
  }

  console.log("📤 Admission submit", {
    url: `${BASE}/public/admission`,
    ...payload,
    hasPassport: !!passportFile,
  });

  const { data } = await axios.post(`${BASE}/public/admission`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};