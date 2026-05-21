import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.249.151:5000/api",
});

export default API;