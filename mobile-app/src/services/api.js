import axios from "axios";

const API = axios.create({
  // baseURL: "http://192.168.115.151:5000/api",
  baseURL: "http://192.168.87.151:5000/api",
});

export default API;