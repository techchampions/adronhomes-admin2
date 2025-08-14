import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store"; 
import { toast } from "react-toastify";
import api from "../middleware";

export interface Property {
  id: number;
  name: string;
  display_image: string;
  photos: string[];
  is_featured: 0 | 1; 
}

export interface ToggleFeaturedResponse {
  success: boolean;
  message: string;
  data: Property;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Base URL for your API
const BASE_URL = import.meta.env.VITE_API_BASE_URL 

export const toggleFeatured = createAsyncThunk<
  ToggleFeaturedResponse, 
  { id: number },
  { rejectValue: ErrorResponse; state: RootState } 
>(
  "property/toggleFeatured",
  async ({ id }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<ToggleFeaturedResponse>(
        `${BASE_URL}/api/admin/toggle-feature/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
        }
      );
      toast.success(response.data.message || "Featured status updated successfully!");
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
          (axiosError.response.data.errors
            ? Object.values(axiosError.response.data.errors).flat().join(",")
            : "Failed to update featured status");
        toast.error(errorMessage);
        return rejectWithValue(axiosError.response.data);
      } else if (axiosError.request) {
        const errorMessage =
          "No response from server. Please check your network connection.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage });
      }

      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);