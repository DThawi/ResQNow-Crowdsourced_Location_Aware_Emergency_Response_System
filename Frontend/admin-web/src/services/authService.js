import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};
