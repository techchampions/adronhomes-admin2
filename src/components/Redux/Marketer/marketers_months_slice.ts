import { createSlice } from "@reduxjs/toolkit";
import { fetchMonthlyStats, MonthlyStat } from "./marketers_monthly_thunk";

interface MonthlyStatsState {
  loading: boolean;
  error: string | null;
  total_paid_per_month: number;
  total_paid: number;
  monthly_stats: MonthlyStat[];
}

const initialState: MonthlyStatsState = {
  loading: false,
  error: null,
  total_paid_per_month: 0,
  total_paid: 0,
  monthly_stats: [],
};

const monthlyStatsSlice = createSlice({
  name: "MarketermonthlyStats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.total_paid_per_month = action.payload.total_paid_per_month;
        state.total_paid = action.payload.total_paid;
        state.monthly_stats = action.payload.monthly_stats;
        state.error = null;
      })
      .addCase(fetchMonthlyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch data.";
      });
  },
});

export default monthlyStatsSlice.reducer;
