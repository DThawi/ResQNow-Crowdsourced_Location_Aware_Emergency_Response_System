import axios from "axios";

const API = axios.create({
  baseURL: "http://10.75.221.244:5000/api", // CHANGE THIS
});

export default API;
