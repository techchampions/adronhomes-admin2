// exportPaymentsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { exportPayments, ExportPaymentsResponse } from "./ exportPaymentsThunk";
import { RootState } from "../store";


interface ExportPaymentsState {
  loading: boolean;
  error: string | null;
  success: boolean;
  downloadUrl: string | null;
  lastExportDate: string | null;
}

const initialState: ExportPaymentsState = {
  loading: false,
  error: null,
  success: false,
  downloadUrl: null,
  lastExportDate: null,
};

const exportPaymentsSlice = createSlice({
  name: "exportPayments",
  initialState,
  reducers: {
    resetExportState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.downloadUrl = null;
    },
    clearDownloadUrl: (state) => {
      state.downloadUrl = null;
    },
    setLastExportDate: (state, action: PayloadAction<string>) => {
      state.lastExportDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(exportPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.downloadUrl = null;
      })
      .addCase(
        exportPayments.fulfilled,
        (state, action: PayloadAction<ExportPaymentsResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.downloadUrl = action.payload.url;
          state.lastExportDate = new Date().toISOString();
        }
      )
      .addCase(exportPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to export payments";
        state.success = false;
        state.downloadUrl = null;
      });
  },
});

export const { 
  resetExportState, 
  clearDownloadUrl, 
  setLastExportDate 
} = exportPaymentsSlice.actions;

export default exportPaymentsSlice.reducer;

// exportPaymentsSlice.ts
// ... existing code ...

// Selectors (updated to use RootState)
export const selectExportLoading = (state: RootState) => state.exportPayments.loading;
export const selectExportError = (state: RootState) => state.exportPayments.error;
export const selectExportSuccess = (state: RootState) => state.exportPayments.success;
export const selectDownloadUrl = (state: RootState) => state.exportPayments.downloadUrl;
export const selectLastExportDate = (state: RootState) => state.exportPayments.lastExportDate;

