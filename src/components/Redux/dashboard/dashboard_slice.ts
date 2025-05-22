import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardData, ErrorResponse, getDashboardData } from "./dashboard_thunk";


interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: ErrorResponse | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.data = null;
      state.error = null;
    },
    resetDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state
      .addCase(
        getDashboardData.fulfilled,
        (state, action: PayloadAction<DashboardData>) => {
          state.loading = false;
          state.data = action.payload.data;
        }
      )
      // Handle rejected state
      .addCase(
        getDashboardData.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload || {
            message: "Failed to fetch dashboard data",
          };
        }
      );
  },
});

// Export actions
export const { clearDashboardData, resetDashboardError } = dashboardSlice.actions;

// Export reducer
export default dashboardSlice.reducer;