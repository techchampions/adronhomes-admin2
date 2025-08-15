// delete_job_thunk.ts
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

export interface DeleteJobResponse {
  success: boolean;
  message: string;

}

// Base URL for your API
const BASE_URL = import.meta.env.VITE_API_BASE_URL ; 


export const deleteJob = createAsyncThunk<
  DeleteJobResponse,
  number,
  { rejectValue: ErrorResponse; state: RootState }
>(
  "jobs/delete",
  async (id, { rejectWithValue }) => {
    const token = Cookies.get("token");

    // Check if authentication token exists
    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.delete<DeleteJobResponse>(
        `${BASE_URL}/api/hr/jobs/delete/${id}`, 
        {
          headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`, 
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno", 
            device_id: "1010l0010l1",
          },
        }
      );
      toast.success(response.data.message || "Job deleted successfully!"); 
      return response.data; 
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>; 

      // Handle 401 Unauthorized error: remove token and notify user
      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }

   
      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data.message ||
          (axiosError.response.data.errors
            ? Object.values(axiosError.response.data.errors).flat().join(", ")
            : "Failed to delete job");
        toast.error(errorMessage); 
        return rejectWithValue(axiosError.response.data); 
      } else if (axiosError.request) {
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
