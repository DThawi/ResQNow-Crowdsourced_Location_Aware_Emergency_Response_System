import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.8.103:5000/api",
});

export default API;