import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import api from "../middleware";

export interface BulkUploadResponse {
  status: string;
  message: string;
  data?: {
    successful_uploads: number;
    failed_uploads: number;
    errors?: Array<{
      row: number;
      errors: Record<string, string[]>;
    }>;
  };
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface BulkUploadState {
  loading: boolean;
  error: string | null;
  success: boolean;
  progress: number;
  uploadResult: {
    successful: number;
    failed: number;
    errors: Array<{
      row: number;
      errors: Record<string, string[]>;
    }>;
  } | null;
}

const initialState: BulkUploadState = {
  loading: false,
  error: null,
  success: false,
  progress: 0,
  uploadResult: null,
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const bulkUploadEmployees = createAsyncThunk<
  BulkUploadResponse,
  FormData, // Change to FormData
  {
    rejectValue: ErrorResponse;
  }
>("bulkUpload/upload", async (formData: FormData, { rejectWithValue, dispatch }) => {
  const token = Cookies.get("token");

  if (!token) {
    return rejectWithValue({
      message: "No authentication token found. Please login again.",
    });
  }

  try {
    const response = await api.post<BulkUploadResponse>(
      `${BASE_URL}/api/admin/bulk-upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
          device_id: "1010l0010l1",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch(setUploadProgress(progress));
          }
        },
      }
    );
    
    toast.success(response.data.message || "Bulk upload completed successfully.");
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;

    if (axiosError.response?.status === 401) {
      Cookies.remove("token");
      toast.error("Session expired. Please login again.");
    }

    if (axiosError.response) {
      const errorMessage = axiosError.response.data?.message || "Failed to upload file";
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

const bulkUploadSlice = createSlice({
  name: "bulkUpload",
  initialState,
  reducers: {
    clearBulkUploadState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.progress = 0;
      state.uploadResult = null;
    },
    resetBulkUploadState: () => initialState,
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bulkUploadEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.progress = 0;
        state.uploadResult = null;
      })
      .addCase(
        bulkUploadEmployees.fulfilled,
        (state, action: PayloadAction<BulkUploadResponse>) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.progress = 100;
          state.uploadResult = {
            successful: action.payload.data?.successful_uploads || 0,
            failed: action.payload.data?.failed_uploads || 0,
            errors: action.payload.data?.errors || [],
          };
        }
      )
      .addCase(bulkUploadEmployees.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.progress = 0;
        state.error =
          action.payload && "message" in action.payload
            ? action.payload.message
            : action.error.message || "Failed to upload file";
        state.uploadResult = null;
      });
  },
});

export const { 
  clearBulkUploadState, 
  resetBulkUploadState, 
  setUploadProgress 
} = bulkUploadSlice.actions;
export default bulkUploadSlice.reducer;