import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.API_URL,
  timeout: 7000, 
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response.data, 
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
