// itDashboardSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import api from "../middleware";

export interface ITDashboardResponse {
  success: boolean;
  message: string;
  total_visit: number;
  today_visit: number;
  this_month_visit: number;
  total_active_user: number;
  total_last_30_min: number;
  total_views: number;
  total_properties: number;
  total_requests: number;
  total_notifications: number;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// State interface for the slice
interface ITDashboardState {
  totalVisit: number | null;
  todayVisit: number | null;
  thisMonthVisit: number | null;
  totalActiveUser: number | null;
  totalLast30Min: number | null;
  totalViews: number | null;
  totalProperties: number | null;
  totalRequests: number | null;
  totalNotifications: number | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ITDashboardState = {
  totalVisit: null,
  todayVisit: null,
  thisMonthVisit: null,
  totalActiveUser: null,
  totalLast30Min: null,
  totalViews: null,
  totalProperties: null,
  totalRequests: null,
  totalNotifications: null,
  loading: false,
  error: null,
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk for fetching IT dashboard data
export const fetchITDashboard = createAsyncThunk<
  ITDashboardResponse,
  void,
  {
    rejectValue: ErrorResponse;
  }
>("itDashboard/fetchData", async (_, { rejectWithValue }) => {
  const token = Cookies.get("token");

  if (!token) {
    return rejectWithValue({
      message: "No authentication token found. Please login again.",
    });
  }

  try {
    const response = await api.get<ITDashboardResponse>(
      `${BASE_URL}/api/it/dashboard`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
          device_id: "1010l0010l1",
        },
      }
    );
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;

    if (axiosError.response?.status === 401) {
      Cookies.remove("token");
      toast.error("Session expired. Please login again.");
    }

    if (axiosError.response) {
      return rejectWithValue(
        axiosError.response.data || {
          message: "Failed to fetch IT dashboard data",
        }
      );
    } else if (axiosError.request) {
      return rejectWithValue({
        message:
          "No response from server. Please check your network connection.",
      });
    }

    return rejectWithValue({
      message: "An unexpected error occurred. Please try again.",
    });
  }
});

// Slice to manage the state
const itDashboardSlice = createSlice({
  name: "itDashboard",
  initialState,
  reducers: {
    clearITDashboard: (state) => {
      state.totalVisit = null;
      state.todayVisit = null;
      state.thisMonthVisit = null;
      state.totalActiveUser = null;
      state.totalLast30Min = null;
      state.totalViews = null;
      state.totalProperties = null;
      state.totalRequests = null;
      state.totalNotifications = null;
      state.error = null;
    },
    resetITDashboardState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchITDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchITDashboard.fulfilled,
        (state, action: PayloadAction<ITDashboardResponse>) => {
          state.loading = false;
          state.totalVisit = action.payload.total_visit;
          state.todayVisit = action.payload.today_visit;
          state.thisMonthVisit = action.payload.this_month_visit;
          state.totalActiveUser = action.payload.total_active_user;
          state.totalLast30Min = action.payload.total_last_30_min;
          state.totalViews = action.payload.total_views;
          state.totalProperties = action.payload.total_properties;
          state.totalRequests = action.payload.total_requests;
          state.totalNotifications = action.payload.total_notifications;
          state.error = null;
        }
      )
      .addCase(fetchITDashboard.rejected, (state, action) => {
        state.loading = false;
        state.totalVisit = null;
        state.todayVisit = null;
        state.thisMonthVisit = null;
        state.totalActiveUser = null;
        state.totalLast30Min = null;
        state.totalViews = null;
        state.totalProperties = null;
        state.totalRequests = null;
        state.totalNotifications = null;
        state.error =
          action.payload && "message" in action.payload
            ? action.payload.message
            : action.error.message || "Failed to fetch IT dashboard data";
      });
  },
});

// Exports
export const { clearITDashboard, resetITDashboardState } = itDashboardSlice.actions;
export default itDashboardSlice.reducer;