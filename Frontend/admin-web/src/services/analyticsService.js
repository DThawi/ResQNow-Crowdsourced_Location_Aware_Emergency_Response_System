import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ================= ANALYTICS =================

export const getAnalyticsTotal = async () => {
  const res = await API.get("/analytics/total");
  return res.data;
};

export const getAnalyticsCategories = async () => {
  const res = await API.get("/analytics/categories");
  return res.data;
};

export const getAnalyticsStatus = async () => {
  const res = await API.get("/analytics/status");
  return res.data;
};

export const getAnalyticsResponseTime = async () => {
  const res = await API.get("/analytics/response-time");
  return res.data;
};

export const getAnalyticsMonthly = async () => {
  const res = await API.get("/analytics/monthly");
  return res.data;
};

// ================= INCIDENTS =================

export const getIncidents = async (page = 1, limit = 20) => {
  const res = await API.get(
    `/incidents?page=${page}&limit=${limit}`
  );

  return res.data;
};

export const updateIncidentStatus = async (incidentId, status) => {
  const res = await API.put(`/incidents/${incidentId}/status`, { status });
  return res.data;
};