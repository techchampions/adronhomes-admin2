import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import { toast } from "react-toastify";
import { BASE_URL } from "../UpdateContract/viewcontractFormDetails";
import api from "../middleware";

// Define interfaces for the API response
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Career {
  id: number;
  job_title: string;
  created_at: string | null;
  views: number;
  compensation: number | null;
  total_applications: number;
}

export interface CareerPaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

export interface CareerData {
  current_page: number;
  data: Career[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: CareerPaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface CareerResponse {
  success: boolean;
  name: string;
  total_career: number;
  total_career_views: string;
  total_applications: string;
  data: CareerData;
}

export const fetchCareers = createAsyncThunk<
  CareerResponse, 
  { page?: number; search?: string }, 
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "careers/fetch",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<CareerResponse>(
        `${BASE_URL}/api/hr/jobs`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
          params: {
            page,
            ...(search && search.trim() !== '' && { search: search.trim() })
          }
        }
      );
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data.message ||
          "Failed to fetch career data";
        toast.error(errorMessage);
        return rejectWithValue(axiosError.response.data);
      }

      if (axiosError.request) {
        const errorMessage =
          "No response from server. Please check your network connection.";
        toast.error(errorMessage);
        return rejectWithValue({
          message: errorMessage,
        });
      }

      if (error instanceof Error) {
        toast.error(error.message);
        return rejectWithValue({
          message: error.message,
        });
      }

      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
      });
    }
  }
);