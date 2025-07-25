import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface WalletTransaction {
  id: number;
  property_id: number | null;
  user_id: number;
  plan_id: number | null;
  amount: number;
  transaction_type: "credit" | "debit";
  created_at: string;
  updated_at: string;
  status: number;
  description: string;
  marketer_id: number | null;
  transaction_method: string;
  is_payment: number;
  reference: string | null;
}

export interface WalletTransactionsList {
  current_page: number;
  data: WalletTransaction[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface WalletTransactionsResponse {
  status: string;
  message: string;
  data: WalletTransactionsList;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchWalletTransactions = createAsyncThunk<
  WalletTransactionsResponse,
  any, // userId as parameter
  { rejectValue: ErrorResponse; state: RootState }
>(
  "walletTransactions/fetch",
  async (userId, { rejectWithValue, getState }) => {
    const token = Cookies.get('token');
    const state = getState() as RootState;
    const currentPage = state.walletTransactions.pagination.currentPage;
    
    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.get<WalletTransactionsResponse>(
        `${BASE_URL}/api/admin/user-wallet-transaction/${userId}`,
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
          message: axiosError.response.data.message || "Failed to fetch wallet transactions",
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