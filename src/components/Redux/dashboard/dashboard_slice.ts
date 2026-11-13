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
  error: ErrorResponse | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  visitsLoading: false,
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
    },
    resetDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
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
      })
      .addCase(
        getDashboardVisits.fulfilled,
        (state, action: PayloadAction<DashboardVisits>) => {
          state.visitsLoading = false;
          if (state.data) {
            state.data.visit = action.payload;
          }
        },
      )
      .addCase(getDashboardVisits.rejected, (state) => {
        state.visitsLoading = false;
      });
  },
});

export const { clearDashboardData, resetDashboardError } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
