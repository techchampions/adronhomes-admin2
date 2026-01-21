import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import { zstdCompress } from "zlib";
import { toast } from "react-toastify";
import api from "../middleware";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Personnel {
  id: number;
  email: string;
  phone_number: string;
  referral_code: string;
  name: string | null;
  first_name: string;
  last_name: string;
  role: number;
  country: string | null;
  state: string | null;
  lga: string | null;
  otp_verified_at: string | null;
  email_verified_at: string | null;
  profile_picture: string | null;
  gender: string | null;
  notification_enabled: number;
  device_id: string;
  address: string | null;
  created_at: string;
  updated_at: string;
  personnel: string;
  contract_id: string | null;
}

export interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PersonnelsData {
  current_page: number;
  data: Personnel[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PersonnelsResponse {
  success: boolean;
  data: PersonnelsData;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const personnels = createAsyncThunk<
  PersonnelsResponse, 
  { role: number; search?: string },  // <-- include search
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "personnels/fetch",
  async ({ role, search }, { rejectWithValue, getState }) => {
    const token = Cookies.get("token");
    const state = getState();
    const currentPage = state.getpersonnel?.data?.current_page || 1;

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    // Build query parameters
    const params: Record<string, any> = { role };
    if (search) {
      params.search = search;
    } else {
      params.page = currentPage;
    }

    try {
      const response = await api.get<PersonnelsResponse>(
        `${BASE_URL}/api/admin/personnels`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
          params, // use the built params object
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
      }

      if (axiosError.response) {
        return rejectWithValue({
          message:
            axiosError.response.data.message || "Failed to fetch personnels data",
          errors: axiosError.response.data.errors,
        });
      } else if (axiosError.request) {
        return rejectWithValue({
          message: "No response from server. Please check your network connection.",
        });
      }

      return rejectWithValue({
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }
);



// Your response interface remains the same
export interface PersonnelResponse {
  success: boolean;
  message: string;
  personnel: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    role: string;
    personnel: string;
    contract_id: string;
    referral_code: string;
    updated_at: string;
    created_at: string;
  };
}

export const CreatePersonnel = createAsyncThunk<
  PersonnelResponse,
  {
    credentials: FormData;
  },
  { rejectValue: ErrorResponse; state: RootState }
>(
  "CreatePersonnel",
  async ({ credentials }, { rejectWithValue }) => {
    const token = Cookies.get('token');
    
    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    try {
      const response = await api.post<PersonnelResponse>(
        `${BASE_URL}/api/admin/create-personnel`,
        credentials,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          }
        }
      );
      
      return response.data}
       catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        const errorMessage = axiosError.response.data.message || 
          (axiosError.response.data.errors 
            ? Object.values(axiosError.response.data.errors).flat().join(', ')
            : "Failed to create property");
        
        toast.error(errorMessage);
        return rejectWithValue(axiosError.response.data);
      }
      
      const errorMessage = axiosError.request 
        ? "No response from server. Please check your network connection."
        : "An unexpected error occurred. Please try again.";
      
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
      });
    }
  }
);




