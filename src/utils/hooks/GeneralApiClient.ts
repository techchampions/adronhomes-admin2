import Cookies from "js-cookie";
import axios, { AxiosInstance } from "axios";

const adronApi: AxiosInstance = axios.create({
  baseURL: "https://adron.microf10.sg-host.com/api/",
  headers: {
    "Content-Type": "application/json",
    identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
    device_id: 1234567,
  },
});

// Interceptor to attach token if available
adronApi.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default adronApi;
