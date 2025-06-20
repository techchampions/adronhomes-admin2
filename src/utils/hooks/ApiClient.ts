import Cookies from "js-cookie";
import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://adron.microf10.sg-host.com/api/admin/",
  headers: {
    "Content-Type": "application/json",
    identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
    device_id: 1234567,
  },
});

// Interceptor to attach token if available
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default apiClient;
