// propertyDetailSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import api from "../middleware";

export interface RemovePropertyDetailResponse {
  status: string;
  message: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// State interface for the slice
interface PropertyDetailState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: PropertyDetailState = {
  loading: false,
  error: null,
  success: false,
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk for removing property detail
export const removePropertyDetail = createAsyncThunk<
  RemovePropertyDetailResponse,
  string, // Property ID as parameter
  {
    rejectValue: ErrorResponse;
  }
>("propertyDetail/remove", async (propertyId, { rejectWithValue }) => {
  const token = Cookies.get("token");

  if (!token) {
    return rejectWithValue({
      message: "No authentication token found. Please login again.",
    });
  }

  try {
    const response = await api.delete<RemovePropertyDetailResponse>(
      `${BASE_URL}/api/admin/remove-property-detail/${propertyId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
          device_id: "1010l0010l1",
        },
      }
    );
    
    toast.success(response.data.message || "Property detail deleted successfully.");
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;

    if (axiosError.response?.status === 401) {
      Cookies.remove("token");
      toast.error("Session expired. Please login again.");
    }

    if (axiosError.response) {
      const errorMessage = axiosError.response.data?.message || "Failed to delete property detail";
      toast.error(errorMessage);
      return rejectWithValue(
        axiosError.response.data || {
          message: errorMessage,
        }
      );
    } else if (axiosError.request) {
      const errorMessage = "No response from server. Please check your network connection.";
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
      });
    }

    const errorMessage = "An unexpected error occurred. Please try again.";
    toast.error(errorMessage);
    return rejectWithValue({
      message: errorMessage,
    });
  }
});

// Slice to manage the state
const propertyDetailSlice = createSlice({
  name: "propertyDetail/",
  initialState,
  reducers: {
    clearPropertyDetailState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    resetPropertyDetailState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(removePropertyDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        removePropertyDetail.fulfilled,
        (state, action: PayloadAction<RemovePropertyDetailResponse>) => {
          state.loading = false;
          state.success = true;
          state.error = null;
        }
      )
      .addCase(removePropertyDetail.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload && "message" in action.payload
            ? action.payload.message
            : action.error.message || "Failed to delete property detail";
      });
  },
});

// Exports
export const { clearPropertyDetailState, resetPropertyDetailState } = propertyDetailSlice.actions;
export default propertyDetailSlice.reducer;