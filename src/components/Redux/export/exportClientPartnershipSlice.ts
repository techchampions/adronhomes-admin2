// exportClientPartnershipSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { exportClientPartnership, ExportClientPartnershipResponse } from "./exportClientPartnershipThunk";
import { RootState } from "../store";
import { exportClientPartnership, ExportClientPartnershipResponse } from "./exportClientPartnershipThunk";

interface ExportClientPartnershipState {
  loading: boolean;
  error: string | null;
  success: boolean;
  downloadUrl: string | null;
  lastExportDate: string | null;
}

const initialState: ExportClientPartnershipState = {
  loading: false,
  error: null,
  success: false,
  downloadUrl: null,
  lastExportDate: null,
};

const exportClientPartnershipSlice = createSlice({
  name: "exportClientPartnership",
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
      .addCase(exportClientPartnership.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.downloadUrl = null;
      })
      .addCase(
        exportClientPartnership.fulfilled,
        (state, action: PayloadAction<ExportClientPartnershipResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.downloadUrl = action.payload.url;
          state.lastExportDate = new Date().toISOString();
        }
      )
      .addCase(exportClientPartnership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to export client partnership";
        state.success = false;
        state.downloadUrl = null;
      });
  },
});

export const { 
  resetExportState, 
  clearDownloadUrl, 
  setLastExportDate 
} = exportClientPartnershipSlice.actions;

export default exportClientPartnershipSlice.reducer;

// Selectors
export const selectExportClientPartnershipLoading = (state: RootState) => 
  state.exportClientPartnership.loading;
export const selectExportClientPartnershipError = (state: RootState) => 
  state.exportClientPartnership.error;
export const selectExportClientPartnershipSuccess = (state: RootState) => 
  state.exportClientPartnership.success;
export const selectExportClientPartnershipDownloadUrl = (state: RootState) => 
  state.exportClientPartnership.downloadUrl;
export const selectExportClientPartnershipLastExportDate = (state: RootState) => 
state.exportClientPartnership.lastExportDate;