// create_job_thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store"; // Assuming your store is at ../store
import { toast } from "react-toastify";
import { JobListing } from "./job_details_thunk"; // Re-using JobListing interface
import api from "../middleware";

// Define interfaces for the API response and request body
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface CreateJobResponse {
  success: boolean;
  message: string;
  job: JobListing; // Assuming the response returns the created job details
}

// Note: For FormData, TypeScript interfaces typically describe the expected
// structure of the data *before* it's put into FormData, or as a guide.
// The actual argument to the thunk will be a FormData object.
export interface CreateJobFormData {
  job_title: string;
  key_responsibility?: string;
  requirements?: string;
  qualifications?: string;
  description: string;
  job_type: string;
  location: string;
  address?: string;
  compensation?: number;
  // If images are uploaded, they would be appended to FormData as File objects
  // image?: File;
}

// Base URL for your API
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://adron.microf10.sg-host.com"; // Fallback for VITE_API_BASE_URL

/**
 * Async Thunk to create a new job listing.
 * It sends form-data to the API and handles authentication.
 */
export const createJob = createAsyncThunk<
  CreateJobResponse, // Return type of the fulfilled action
  { credentials: FormData }, // Argument type for the thunk (FormData object)
  { rejectValue: ErrorResponse; state: RootState } // Types for rejectValue and getState
>(
  "jobs/create",
  async ({ credentials }, { rejectWithValue }) => {
    const token = Cookies.get("token"); // Get authentication token from cookies

    // Check if authentication token exists
    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.post<CreateJobResponse>(
        `${BASE_URL}/api/hr/jobs/create`, // API endpoint for creating jobs
        credentials, // FormData body
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for FormData
            Authorization: `Bearer ${token}`, // Authorization header
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno", // Custom header
            device_id: "1010l0010l1", // Custom header
          },
        }
      );
      toast.success(response.data.message || "Job created successfully!"); // Success toast
      return response.data; // Return the data from the successful response
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Handle 401 Unauthorized error: remove token and notify user
      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }

      // If there's a response from the server, use its error message
      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data.message ||
          (axiosError.response.data.errors
            ? Object.values(axiosError.response.data.errors).flat().join(", ")
            : "Failed to create job"); 

        toast.error(errorMessage); // Display error toast
        return rejectWithValue(axiosError.response.data); 
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
