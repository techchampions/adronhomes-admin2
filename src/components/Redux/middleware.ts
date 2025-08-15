import axios from "axios";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
    device_id: "1010l0010l1",
  },
});

export const setupAxiosInterceptors = (navigate: NavigateFunction) => {
  api.interceptors.request.use(
    (config) => {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        Cookies.remove("token");
        navigate("/", { replace: true });
      } else if (error.response?.status === 500) {
        navigate("/error-500", { replace: true });
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export const useAxiosInterceptor = () => {
  const navigate = useNavigate();

  return setupAxiosInterceptors(navigate);
};

export default api;