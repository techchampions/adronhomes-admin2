import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import api from "../middleware";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// New interface for Marketer
export interface Marketer {
  id: number;
  first_name: string;
  last_name: string;
  laravel_through_key: number;
}

export interface Customer {
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
  created_at: string | null;
  updated_at: string | null;
  personnel: string;
  property_plan_total: number;
  saved_property_total: number;
  // Updated marketer type
  marketer: Marketer;
}

export interface CustomersList {
  current_page: number;
  data: Customer[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface CustomersData {
  total: number;
  active_plan: number;
  active_customer: number;
  list: CustomersList;
}

export interface CustomersResponse {
  success: boolean;
  data: {
    customers: CustomersData;
  };
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const customer = createAsyncThunk<
  CustomersResponse,
  { page?: number; search?: string },
  { rejectValue: ErrorResponse }
>(
  "customers/fetch",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    
    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<CustomersResponse>(
        `${BASE_URL}/api/admin/customers`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
          params: {
            page,
            search
          }
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
          message: axiosError.response.data.message || "Failed to fetch dashboard data",
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