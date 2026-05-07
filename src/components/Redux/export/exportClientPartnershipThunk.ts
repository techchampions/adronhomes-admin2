// exportClientPartnershipThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// types.ts
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ExportClientPartnershipResponse {
  success: boolean;
  message: string;
  url: string;
}

export const exportClientPartnership = createAsyncThunk<
  ExportClientPartnershipResponse,
  {
    start_date?: string;
    end_date?: string;
    // Add any other filter parameters as needed
  },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "exportClientPartnership/export",
  async (
    { start_date, end_date },
    { rejectWithValue }
  ) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.post<ExportClientPartnershipResponse>(
        `${BASE_URL}/api/admin/export-clientPartnership`,
        {
          start_date,
          end_date,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
        }
      );

      toast.success(response.data.message || "Export completed successfully");

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data.message || "Failed to export client partnership";
        toast.error(errorMessage);
        return rejectWithValue(axiosError.response.data);
      }

      const errorMessage = axiosError.request
        ? "No response from server. Please check your network connection."
        : "An unexpected error occurred. Please try again.";

      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
      });
    }
  }
);