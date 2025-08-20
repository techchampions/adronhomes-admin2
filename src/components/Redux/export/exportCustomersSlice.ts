// exportCustomersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { exportCustomers, ExportCustomersResponse } from "./exportCustomersThunk";
import { RootState } from "../store";

interface ExportCustomersState {
  loading: boolean;
  error: string | null;
  success: boolean;
  downloadUrl: string | null;
  lastExportDate: string | null;
}

const initialState: ExportCustomersState = {
  loading: false,
  error: null,
  success: false,
  downloadUrl: null,
  lastExportDate: null,
};

const exportCustomersSlice = createSlice({
  name: "exportCustomers",
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
      .addCase(exportCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.downloadUrl = null;
      })
      .addCase(
        exportCustomers.fulfilled,
        (state, action: PayloadAction<ExportCustomersResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.downloadUrl = action.payload.url;
          state.lastExportDate = new Date().toISOString();
        }
      )
      .addCase(exportCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to export customers";
        state.success = false;
        state.downloadUrl = null;
      });
  },
});

export const { 
  resetExportState, 
  clearDownloadUrl, 
  setLastExportDate 
} = exportCustomersSlice.actions;

export default exportCustomersSlice.reducer;


export const selectExportCustomersLoading = (state: RootState) => state.exportCustomers.loading;
export const selectExportCustomersError = (state: RootState) => state.exportCustomers.error;
export const selectExportCustomersSuccess = (state: RootState) => state.exportCustomers.success;
export const selectCustomersDownloadUrl = (state: RootState) => state.exportCustomers.downloadUrl;
export const selectCustomersLastExportDate = (state: RootState) => state.exportCustomers.lastExportDate;