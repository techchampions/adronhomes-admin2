import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaymentData {
  total: number;
  approved: number;
  pending: number;
  amount_total: number;
  amount_approved: number;
  amount_pending: number;
  list: {
    current_page: number;
    data: any[]; // You might want to replace 'any' with a more specific type
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}

export interface PaymentsResponse {
  success: boolean;
  data: {
    payments: PaymentData;
  };
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const payments = createAsyncThunk<
  PaymentsResponse,
  void,
  { rejectValue: ErrorResponse; state: RootState }
>(
  "payments/fetch",
  async (_, { rejectWithValue, getState }) => {
    const token = Cookies.get('token');
    const state = getState() as RootState;
    const currentPage = state.payments?.pagination?.currentPage || 1; 
    
    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.get<PaymentsResponse>(
        `${BASE_URL}/api/admin/payments`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
          params: {
            page: currentPage 
          }
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
          message: axiosError.response.data.message || "Failed to fetch payments data",
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