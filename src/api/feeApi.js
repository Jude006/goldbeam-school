import API from "./authApi";

// Structures
export const getFeeStructures = async (params = {}) => {
  const { data } = await API.get("/fees/structures", { params });
  return data;
};

export const createFeeStructure = async (payload) => {
  const { data } = await API.post("/fees/structures", payload);
  return data;
};

export const updateFeeStructure = async (id, payload) => {
  const { data } = await API.patch(`/fees/structures/${id}`, payload);
  return data;
};

export const deleteFeeStructure = async (id) => {
  const { data } = await API.delete(`/fees/structures/${id}`);
  return data;
};

// Payments
export const getPayments = async (params = {}) => {
  const { data } = await API.get("/fees/payments", { params });
  return data;
};

export const recordPayment = async (payload) => {
  const { data } = await API.post("/fees/record", payload);
  return data;
};

export const getStudentFeeSummary = async (studentId, params = {}) => {
  const { data } = await API.get(`/fees/student/${studentId}`, { params });
  return data;
};

export const getClassFeeBoard = async (params) => {
  const { data } = await API.get("/fees/class-board", { params });
  return data;
};

export const sendFeeDueNotices = async (payload) => {
  const { data } = await API.post("/fees/notify-due", payload);
  return data;
};

// Student portal (later)
export const getMyFees = async (params = {}) => {
  const { data } = await API.get("/fees/my", { params });
  return data;
};

export const initializePaystack = async (payload) => {
  const { data } = await API.post("/fees/paystack/initialize", payload);
  return data;
};

export const verifyPaystack = async (reference) => {
  const { data } = await API.get("/fees/paystack/verify", {
    params: { reference },
  });
  return data;
};