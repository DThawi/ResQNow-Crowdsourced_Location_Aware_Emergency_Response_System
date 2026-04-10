import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.36.151:5000/api", // Updated to your current IP
});


export default API;
