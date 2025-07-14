// edit_job_thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import { toast } from "react-toastify";
import { JobListing } from "./job_details_thunk"; 

// Define interfaces for the API response and request body
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface EditJobResponse {
  success: boolean;
  message: string;
  job: JobListing;
}

// The FormData structure is the same as for creation, but we also need the job ID
export interface EditJobPayload {
  id: number; 
  credentials: FormData; 
}

// Base URL for your API
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://adron.microf10.sg-host.com"; 


export const editJob = createAsyncThunk<
  EditJobResponse,
  EditJobPayload, 
  { rejectValue: ErrorResponse; state: RootState } 
>(
  "jobs/edit",
  async ({ id, credentials }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    // Check if authentication token exists
    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.post<EditJobResponse>( 
        `${BASE_URL}/api/hr/jobs/edit/${id}`,
        credentials, 
        {
          headers: {
            "Content-Type": "multipart/form-data", 
            Authorization: `Bearer ${token}`, 
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
        }
      );
      toast.success(response.data.message || "Job updated successfully!"); 
      return response.data; 
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
            : "Failed to update job"); 

        toast.error(errorMessage); 
        return rejectWithValue(axiosError.response.data); 
      } else if (axiosError.request) {
        // If no response was received (e.g., network error)
        const errorMessage =
          "No response from server. Please check your network connection.";
        toast.error(errorMessage); 
        return rejectWithValue({
          message: errorMessage,
        });
      }

      // Handle any other unexpected errors
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage); 
      return rejectWithValue({
        message: errorMessage,
      });
    }
  }
);
