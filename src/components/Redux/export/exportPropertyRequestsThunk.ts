import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { RootState } from "../store";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ExportPropertyRequestsResponse {
  success: boolean;
  message: string;
  url: string;
  count?: number;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const exportPropertyRequests = createAsyncThunk<
  ExportPropertyRequestsResponse,
  {
    start_date: string;
    end_date: string;
    property_id?: number;
    director_id?: number;
  },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "exportPropertyRequests/export",
  async ({ start_date, end_date, property_id, director_id }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.post<ExportPropertyRequestsResponse>(
        `${BASE_URL}/api/admin/export-property-requests`,
        {
          start_date,
          end_date,
          property_id,
          director_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
        },
      );

      toast.success(
        response.data.message || "Requests and enquiries export completed",
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
          "Failed to export requests and enquiries";
        toast.error(errorMessage);
        return rejectWithValue(axiosError.response.data);
      }

      const errorMessage = axiosError.request
        ? "No response from server. Please check your network connection."
        : "An unexpected error occurred. Please try again.";

      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  },
);
