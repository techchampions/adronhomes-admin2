// erpContractTransactionsThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { RootState } from "../../store";
import api from "../../middleware";

// Response Interfaces
// export interface ERPTransaction {
//   id: number;
//   propertyId: number;
//   userId: number;
//   ContractId: string;
//   TransactionDate: string;
//   TransactionAmount: number;
//   TransactionDRCR: string;
//   TransactionDescription: string;
//   created_at: string;
//   updated_at: string;
//   TransactionReference: string;
// }
// src/types/ERPTransaction.ts
export interface ERPTransaction {
  id: number;
  propertyId: number;
  userId: number;
  ContractId: string;
  TransactionDate: string;
  TransactionAmount: number;
  TransactionDRCR: "C" | "D";
  TransactionDescription: string;
  created_at: string;
  updated_at: string;
  TransactionReference: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ERPTransactionsResponse {
  success: boolean;
  data: {
    current_page: number;
    data: ERPTransaction[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk for fetching contract transactions
export const fetchERPContractTransactions = createAsyncThunk<
  ERPTransactionsResponse,
  {
    contractId: string;
    page?: number;
    perPage?: number;
  },
  { rejectValue: ErrorResponse; state: RootState }
>(
  "erpContractTransactions/fetch",
  async ({ contractId, page = 1, perPage = 15 }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    try {
      const response = await api.get<ERPTransactionsResponse>(
        `${BASE_URL}/api/erp-contract/${contractId}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
          params: {
            page,
            per_page: perPage,
          },
        },
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
          (axiosError.response.data.errors
            ? Object.values(axiosError.response.data.errors).flat().join(", ")
            : "Failed to fetch contract transactions");

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
  },
);
