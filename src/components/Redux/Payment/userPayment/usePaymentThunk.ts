// userPaymentsThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

import { toast } from "react-toastify";
import { ErrorResponse, PaymentsResponse } from "./type";
import { RootState } from "../../store";
import api from "../../middleware";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://adron.microf10.sg-host.com";

export const fetchUserPayments = createAsyncThunk<
  PaymentsResponse,
  { 
    userId: any;
    page?: number;
    per_page?: number;
    status?: number | null;
    search?: string | null;
  },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "userPaymentsbyid",
  async ({ userId, page = 1, per_page = 10, status = null, search = null }, { rejectWithValue }) => {
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

      if (status !== null) {
        params.status = status;
      }

      if (search) {
        params.search = search;
      }

      const response = await api.get<PaymentsResponse>(
        `${BASE_URL}/api/admin/user-wallet-payment/${userId}`,
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
          "Failed to fetch user payments";
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