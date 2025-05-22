import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

// Define the response data structure based on your example
export interface DashboardData {
  data: any;
  properties: {
    total: number;
    sold: number;
    active: number;
  };
  transactions: {
    total_orders: number;
    approved_orders: number;
    pending_orders: number;
  };
  payments: {
    total_count: number;
    approved_count: number;
    pending_count: number;
    total_amount: number;
    approved_amount: number;
    pending_amount: number;
  };
  customers: {
    total: number;
    active: number;
  };
  plans: {
    active: number;
  };
  revenue: {
    total: number;
    percentage: number;
  };
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getDashboardData = createAsyncThunk<
  DashboardData, // Return type
  void, // Argument type (none in this case)
  { rejectValue: ErrorResponse }
>(
  "dashboard/getData",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get('token');
    
    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.get<DashboardData>(
        `${BASE_URL}/api/admin/dashboard`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
      }

      if (axiosError.response) {
        return rejectWithValue({
          message: axiosError.response.data.message || "Failed to fetch dashboard data",
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