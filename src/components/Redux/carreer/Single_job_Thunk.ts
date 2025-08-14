// job_details_thunk.ts
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

export interface Job {
  id: number;
  job_title: string;
  description: string;
  location: string;
  job_type: string;
  key_responsibility: string;
  requirements: string;
  qualifications: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  address: string;
  views: number;
  total_applications: number;
  compensation: number;
}

export interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ApplicationsData {
  current_page: number;
  data: Application[];
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

export interface JobDetailsResponse {
  success: boolean;
  job_list: Job;
  total_career_views: number;
  total_applications: number;
  applications: ApplicationsData;
}

export const fetchJobDetails = createAsyncThunk<
  JobDetailsResponse,
  string, // The jobId will be passed as an argument
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "singlejobDetails/fetch",
  async (jobId, { rejectWithValue, getState }) => {
    const token = Cookies.get("token");
    const state = getState();
    const currentPage = state.singlejobDetails?.applications?.current_page || 1;

    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<JobDetailsResponse>(
        `${BASE_URL}/api/hr/career/${jobId}`,
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

      // Validate the response structure matches our interface
      if (
        !response.data.success ||
        !response.data.job_list ||
        typeof response.data.total_career_views !== "number" ||
        typeof response.data.total_applications !== "number" ||
        !response.data.applications
      ) {
        throw new Error("Invalid response structure from server");
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data.message || "Failed to fetch job details";
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