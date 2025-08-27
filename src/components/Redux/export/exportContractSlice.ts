// exportContractsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { exportContracts, ExportPaymentsResponse } from "./ exportContractsThunk";
import { RootState } from "../store";
import { exportContracts,ExportPaymentsResponse } from "./expoertContractThunk";


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

const exportContractsSlice = createSlice({
  name: "exportContracts",
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
      .addCase(exportContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.downloadUrl = null;
      })
      .addCase(
        exportContracts.fulfilled,
        (state, action: PayloadAction<ExportPaymentsResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.downloadUrl = action.payload.url;
          state.lastExportDate = new Date().toISOString();
        }
      )
      .addCase(exportContracts.rejected, (state, action) => {
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
} = exportContractsSlice.actions;

export default exportContractsSlice.reducer;

// exportContractsSlice.ts
// ... existing code ...

// Selectors (updated to use RootState)
export const selectExportLoading = (state: RootState) => state.exportContracts.loading;
export const selectExportError = (state: RootState) => state.exportContracts.error;
export const selectExportSuccess = (state: RootState) => state.exportContracts.success;
export const selectDownloadUrl = (state: RootState) => state.exportContracts.downloadUrl;
export const selectLastExportDate = (state: RootState) => state.exportContracts.lastExportDate;

