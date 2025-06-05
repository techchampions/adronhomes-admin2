import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";

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
  string,             
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "personnels/fetch",
  async (role, { rejectWithValue, getState }) => {
    const token = Cookies.get("token");
    const state = getState();
    const currentPage = state.getpersonnel?.data?.current_page || 1;

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.get<PersonnelsResponse>(
        `${BASE_URL}/api/admin/personnels?role=${role}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
          params: {
            page: currentPage,
          },
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