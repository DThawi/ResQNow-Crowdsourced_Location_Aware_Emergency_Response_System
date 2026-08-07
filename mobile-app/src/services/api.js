import axios from "axios";

const API = axios.create({
  // baseURL: "http://192.168.8.194:5000/api",
  baseURL: "http://192.168.1.3:5000/api",
});

export default API;
