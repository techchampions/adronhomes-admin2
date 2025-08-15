// career_view_thunk.ts
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

export interface CareerDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  state: string;
  job_role: string;
  education: string;
  description: string;
  created_at: string;
  updated_at: string;
  application_type: number;
  job_id: number | null;
  cover_letter: string | null;
  resume: string | null;
}

export interface CareerViewResponse {
  success: boolean;
  career: CareerDetail;
}

// Base URL for your API
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://adron.microf10.sg-host.com"; // Fallback for VITE_API_BASE_URL

/**
 * Async Thunk to fetch a single career's details by its ID.
 * It fetches career details and handles authentication.
 */
export const fetchCareerById = createAsyncThunk<
  CareerViewResponse, // Return type of the fulfilled action
  number, // Argument type for the thunk (the career ID)
  {
    state: RootState; // Type for getState
    rejectValue: ErrorResponse; // Type for rejectWithValue
  }
>(
  "career_view/fetchById",
  async (id, { rejectWithValue }) => {
    const token = Cookies.get("token"); // Get authentication token from cookies

    // Check if authentication token exists
    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<CareerViewResponse>(
        `${BASE_URL}/api/hr/career-view/${id}`, // API endpoint for career view with ID
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Authorization header
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno", // Custom header
            device_id: "1010l0010l1", // Custom header
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
          "Failed to fetch career details"; // Default error message
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
