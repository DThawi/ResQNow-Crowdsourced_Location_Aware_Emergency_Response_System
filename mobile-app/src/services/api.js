import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.241.151:5000/api", // Updated to your current IP
  timeout: 5000, // 5 seconds timeout
});


export default API;
