import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import { toast } from "react-toastify";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface MonthlyStat {
  month: string;
  total_paid: number;
  payment_count: number;
  users:any
}
export interface MonthlyStatsResponse {
  success: boolean;
  message: string;
  total_paid_per_month: number;
  total_paid: number;
  monthly_stats: MonthlyStat[];
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchMonthlyStats = createAsyncThunk<
  MonthlyStatsResponse,
  { year: any }, 
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "monthlyStats/fetch",
  async ({ year }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.get<MonthlyStatsResponse>(
        `${BASE_URL}/api/marketers/monthly`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
          params: {
            year: year,
          },
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
        return rejectWithValue({
          message:
            axiosError.response.data.message || "Failed to fetch monthly stats",
          errors: axiosError.response.data.errors,
        });
      } else if (axiosError.request) {
        return rejectWithValue({
          message: "No response from server. Please check your network connection.",
        });
      }

      return rejectWithValue({
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }
);