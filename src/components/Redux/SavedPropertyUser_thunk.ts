import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "./store";
import api from "./middleware";


export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface SavedUser {
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
  contract_id: string;
}

export interface SavedPropertyUser {
  id: number;
  property_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  saved_user: SavedUser;
}

export interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedSavedPropertyUsers {
  current_page: number;
  data: SavedPropertyUser[];
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

export interface SavedPropertyUserResponse {
  status: string;
  message: string;
  saved_property_user: PaginatedSavedPropertyUsers;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSavedPropertyUsers = createAsyncThunk<
  SavedPropertyUserResponse,
  { propertyId: number; page?: number },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "savedPropertyUsers/fetchSavedPropertyUsers",
  async ({ propertyId, page = 1 }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<SavedPropertyUserResponse>(
        `${BASE_URL}/api/admin/property-saved-user/${propertyId}`,
        {
           headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
          params: {
            page,
          },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error('API Error:', axiosError.response?.data); // Log detailed error

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
      }

      if (axiosError.response) {
        return rejectWithValue({
          message:
            axiosError.response.data.message || "Failed to fetch saved property users",
          errors: axiosError.response.data.errors,
        });
      }
      
      return rejectWithValue({
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }
);