import axios from 'axios';

const API = axios.create({
  baseURL: 'http://10.218.167.51:5000/api', 
  
  // Increased to 30 seconds so large file uploads don't drop out early
  timeout: 30000, 
  headers: {
    'Accept': 'application/json',
  }
});

export default API;
