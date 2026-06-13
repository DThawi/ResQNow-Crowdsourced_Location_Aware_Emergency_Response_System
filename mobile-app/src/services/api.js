import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.199.151:5000/api',

  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  }
});

export default API;
