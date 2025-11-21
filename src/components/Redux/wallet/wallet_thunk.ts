// wallet_thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
// import { RootState } from "../../store";
// import api from "../../middleware";
// import { WalletSuccessResponse, ErrorResponse } from "./wallet_types";
import { RootState } from "../store";
import { ErrorResponse } from "../SavedPropertyUser_thunk";
import { WalletSuccessResponse } from "./types";
import api from "../middleware";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://adron.microf10.sg-host.com";

export const fetchWalletTransactions = createAsyncThunk<
  WalletSuccessResponse,
  { 
    page?: number;
    per_page?: number;
    search?: string | null;
    type?: string | null;
  },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "wallet/fetchTransactions",
  async ({ 
    page = 1, 
    per_page = 20, 
    search = null, 
    type = null 
  }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const params: Record<string, any> = {
        page,
        per_page,
      };

      if (search) {
        params.search = search;
      }

      if (type) {
        params.type = type;
      }

      const response = await api.get<WalletSuccessResponse>(
        `${BASE_URL}/api/admin/transactions`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
          params,
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
        const errorMessage =
          axiosError.response.data.message ||
          "Failed to fetch wallet transactions";
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