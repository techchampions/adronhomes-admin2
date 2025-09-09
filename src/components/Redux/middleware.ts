import axios from "axios";
import { NavigateFunction, useNavigate, Location, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
    device_id: "1010l0010l1",
  },
});

export const setupAxiosInterceptors = (navigate: NavigateFunction, location: Location) => {
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
        // Use the location variables to determine the correct error page
        const currentPath = location.pathname;

        if (currentPath.startsWith("/human-resources")) {
          navigate("/human-resources/error-500", { replace: true });
        } else if (currentPath.startsWith("/marketer")) {
          navigate("/marketer/error-500", { replace: true });
        } else if (currentPath.startsWith("/director")) {
          navigate("/director/error-500", { replace: true });
        } else if (currentPath.startsWith("/payments/")) {
          navigate("/payments/error-500", { replace: true });
        } else if (currentPath.startsWith("/legal")) {
          navigate("/legal/error-500", { replace: true });
        } else if (currentPath.startsWith("/client/")) {
          navigate("/client/error-500", { replace: true });
        } else if (currentPath.startsWith("/info-tech")) {
          navigate("/info-tech/error-500", { replace: true });
        } else {
          // Default fallback for admin or other routes
          navigate("/error-500", { replace: true });
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object here
  return setupAxiosInterceptors(navigate, location);
};

export default api;