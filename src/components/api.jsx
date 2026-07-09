import axios from "axios";

const API = axios.create({
  baseURL: "https://gym-app-66of.onrender.com/api/",
});

export default API;