import axios from "axios";

const API = axios.create({
  baseURL: "https://resqnow-crowdsourced-location-aware.onrender.com/api",
});

export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};
