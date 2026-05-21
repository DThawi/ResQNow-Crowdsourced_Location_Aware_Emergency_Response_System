import axios from "axios";

const API = axios.create({
 baseURL: "http://10.158.11.118:5000/api", //{*/ 10.158.11.118 192.168.8.103*/}

});

export default API;