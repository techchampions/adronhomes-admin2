import Cookies from "js-cookie";
import axios, { AxiosInstance } from "axios";
import { store } from "../../components/Redux/store";
import { logout } from "../../components/Redux/Login/login_slice";

export type ApiError = {
  response?: {
    data?: {
      errors?: Record<string, string[]>;
      message?: string;
    };
  };
  status: number;
  message?: string;
};

const adronApi: AxiosInstance = axios.create({
  baseURL: "https://adron.microf10.sg-host.com/api/",
  headers: {
    "Content-Type": "application/json",
    identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
    device_id: 1234567,
  },
});

const handleLogout = () => {
  store.dispatch(logout());
  window.location.reload();
};

adronApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: ApiError) => {
    if (error.status === 401) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);

// Interceptor to attach token if available
adronApi.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default adronApi;
