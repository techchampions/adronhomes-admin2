import axios from "axios";
import {
  NavigateFunction,
  useNavigate,
  Location,
  useLocation,
} from "react-router-dom";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
    device_id: "1010l0010l1",
  },
});

export const setupAxiosInterceptors = (
  navigate: NavigateFunction,
  location: Location,
) => {
  // Clear any existing interceptors to avoid duplicates
  const interceptors = api.interceptors as any;
  if (interceptors.request.handlers.length > 0) {
    api.interceptors.request.clear();
  }
  if (interceptors.response.handlers.length > 0) {
    api.interceptors.response.clear();
  }

  // Request interceptor
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
    },
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        const userRole = (() => {
          try {
            const userStr = Cookies.get("user");
            if (userStr) {
              const user = JSON.parse(userStr);
              return user?.role;
            }
            return null;
          } catch {
            return null;
          }
        })();

        // Remove token only
        Cookies.remove("token");

        // For marketers (role 2), keep the user cookie so AuthGuard knows where to redirect
        // For all other roles, remove the user cookie as well
        if (userRole !== 2) {
          Cookies.remove("user");
        }

        // Let AuthGuard handle the redirect by reloading the page
        // This ensures the AuthGuard runs and checks the cookie
        window.location.href = window.location.pathname;
      }
      // Handle 500 Internal Server Error
      else if (error.response?.status === 500) {
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
    },
  );

  return api;
};

export const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return setupAxiosInterceptors(navigate, location);
};

export default api;
