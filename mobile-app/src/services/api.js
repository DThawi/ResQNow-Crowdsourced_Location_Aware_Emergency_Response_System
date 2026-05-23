import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.47.106:5000/api",
});

export default API;