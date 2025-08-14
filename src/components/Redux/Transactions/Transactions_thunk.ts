import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import api from "../middleware";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Transaction {
  id: number;
  property_id: number | null;
  user_id: number | null;
  plan_id: number | null;
  amount: number;
  status: number;
  description: string;
  transaction_method: string;
  created_at: string;
  updated_at: string;
  reference:any
  marketer_id: number | null;
  user: {
    first_name: string;
    last_name: string;
  } | null;
  marketer: {
    first_name: string;
    last_name: string;
  } | null;
}

export interface TransactionsList {
  current_page: number;
  data: Transaction[];
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

export interface TransactionsData {
  total: number;
  approved: number;
  pending: number;
  list: TransactionsList;
}

export interface TransactionsResponse {
  success: boolean;
  data: {
    transactions: TransactionsData;
  };
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTransactions = createAsyncThunk<
  TransactionsResponse,
  void,
  { rejectValue: ErrorResponse; state: RootState }
>(
  "transactions/fetch",
  async (_, { rejectWithValue, getState }) => {
    const token = Cookies.get('token');
    const state = getState() as RootState;
    const currentPage = state.transactions.pagination?.currentPage || 1;
    
    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<TransactionsResponse>(
        `${BASE_URL}/api/admin/transactions`,
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
          message: axiosError.response.data.message || "Failed to fetch transactions data",
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