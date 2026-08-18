import axios from "axios";

const API = axios.create({
  baseURL: "https://resqnow-crowdsourced-location-aware.onrender.com/api",

});

export default API;