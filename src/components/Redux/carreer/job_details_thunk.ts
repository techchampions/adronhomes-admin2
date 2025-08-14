// job_details_thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store"; // Assuming your store is at ../store
import { toast } from "react-toastify";
import api from "../middleware";

// Define interfaces for the API response
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface JobListing {
  id: number;
  job_title: string;
  description: string;
  location: string;
  job_type: string;
  key_responsibility: string | null;
  requirements: string | null;
  qualifications: string | null;
  image: string | null;
  created_at: string | null;
  updated_at: string | null;
  address: string | null;
  views: number;
  total_applications: number;
  compensation: number;
}

export interface ApplicationDetail {
  // Assuming application details might be more complex, add properties here if known
  // For now, based on 'data: []', we'll keep it minimal or extend as needed.
  // Example: id: number; applicant_name: string; etc.
}

export interface ApplicationPaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ApplicationsData {
  current_page: number;
  data: ApplicationDetail[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: ApplicationPaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface JobDetailsResponse {
  success: boolean;
  job_list: JobListing;
  total_career_views: number;
  total_applications: number;
  applications: ApplicationsData;
}

// Base URL for your API
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://adron.microf10.sg-host.com"; // Fallback for VITE_API_BASE_URL

/**
 * Async Thunk to fetch details for a specific job listing by its ID.
 * It fetches job details including related applications and handles authentication.
 */
export const fetchJobDetailsById = createAsyncThunk<
  JobDetailsResponse, // Return type of the fulfilled action
  { id: number; page?: number }, // Argument type for the thunk (job ID and optional page for applications)
  {
    state: RootState; // Type for getState
    rejectValue: ErrorResponse; // Type for rejectWithValue
  }
>(
  "job_details/fetchById",
  async ({ id, page = 1 }, { rejectWithValue }) => {
    const token = Cookies.get("token"); // Get authentication token from cookies

    // Check if authentication token exists
    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<JobDetailsResponse>(
        `${BASE_URL}/api/hr/career/${id}`, // API endpoint for career details with ID
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Authorization header
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno", // Custom header
            device_id: "1010l0010l1", // Custom header
          },
          params: {
            page: page, // Pass the page number for applications pagination
          },
        }
      );
      return response.data; // Return the data from the successful response
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>; // Cast error to AxiosError

      // Handle 401 Unauthorized error: remove token and notify user
      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }

      // If there's a response from the server, use its error message
      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data.message ||
          "Failed to fetch job details"; // Default error message
        toast.error(errorMessage); // Display error toast
        return rejectWithValue(axiosError.response.data); // Reject with the server's error data
      } else if (axiosError.request) {
        // If no response was received (e.g., network error)
        const errorMessage =
          "No response from server. Please check your network connection.";
        toast.error(errorMessage); // Display error toast
        return rejectWithValue({
          message: errorMessage,
        });
      }

      // Handle any other unexpected errors
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage); // Display error toast
      return rejectWithValue({
        message: errorMessage,
      });
    }
  }
);
