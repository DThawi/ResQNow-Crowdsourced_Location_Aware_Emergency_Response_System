import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.56.1:5000/api", // CHANGE THIS
});

export default API;