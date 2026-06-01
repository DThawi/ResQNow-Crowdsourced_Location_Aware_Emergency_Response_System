import axios from "axios";

const API = axios.create({
  baseURL: "http://10.142.34.118:5000/api",
});

export default API;