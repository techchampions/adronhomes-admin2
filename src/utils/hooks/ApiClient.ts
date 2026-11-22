import Cookies from "js-cookie";
import axios, { AxiosInstance } from "axios";
import { useDispatch } from "react-redux";
import { store } from "../../components/Redux/store";
import { logout } from "../../components/Redux/Login/login_slice";
export type ApiError = {
  response?: {
    status?: number;
    data?: {
      errors?: Record<string, string[]>;
      message?: string;
    };
  };
  status?: number;
  message?: string;
};

const adminApi: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/admin/`,
  headers: {
    "Content-Type": "application/json",
    identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
    device_id: "1010l0010l1",
  },
});

const handleLogout = () => {
  store.dispatch(logout());
  window.location.reload();
};

adminApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: ApiError) => {
    if (error.response?.status === 401 || error.status === 401) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);

// Interceptor to attach token if available
adminApi.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default adminApi;
