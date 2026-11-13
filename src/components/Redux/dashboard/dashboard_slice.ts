import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DashboardData,
  DashboardVisits,
  ErrorResponse,
  getDashboardData,
  getDashboardVisits,
} from "./dashboard_thunk";

interface DashboardState {
  data: DashboardData["data"] | null;
  loading: boolean;
  visitsLoading: boolean;
  visitsMessage: string | null;
  visitsStatus: "idle" | "loading" | "success" | "error";
  error: ErrorResponse | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  visitsLoading: false,
  visitsMessage: null,
  visitsStatus: "idle",
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.data = null;
      state.error = null;
      state.visitsLoading = false;
      state.visitsMessage = null;
      state.visitsStatus = "idle";
    },
    resetDashboardError: (state) => {
      state.error = null;
    },
    clearVisitsMessage: (state) => {
      state.visitsMessage = null;
      if (state.visitsStatus !== "loading") {
        state.visitsStatus = "idle";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.visitsLoading = false;
        state.visitsMessage = null;
        state.visitsStatus = "idle";
      })
      .addCase(
        getDashboardData.fulfilled,
        (state, action: PayloadAction<DashboardData>) => {
          state.loading = false;
          state.data = action.payload.data;
        },
      )
      .addCase(
        getDashboardData.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload || {
            message: "Failed to fetch dashboard data",
          };
        },
      )
      .addCase(getDashboardVisits.pending, (state) => {
        state.visitsLoading = true;
        state.visitsStatus = "loading";
        state.visitsMessage = "Fetching website visit analytics...";
      })
      .addCase(
        getDashboardVisits.fulfilled,
        (state, action: PayloadAction<DashboardVisits>) => {
          state.visitsLoading = false;
          state.visitsStatus = "success";
          state.visitsMessage = "Website visit analytics updated successfully.";
          if (state.data) {
            state.data.visit = action.payload;
          }
        },
      )
      .addCase(getDashboardVisits.rejected, (state, action) => {
        state.visitsLoading = false;
        state.visitsStatus = "error";
        state.visitsMessage =
          action.payload?.message ||
          "Unable to load website visit analytics right now.";
      });
  },
});

export const { clearDashboardData, resetDashboardError, clearVisitsMessage } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
