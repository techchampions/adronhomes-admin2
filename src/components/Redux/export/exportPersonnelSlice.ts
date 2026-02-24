// exportCustomersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { exportCustomers, ExportCustomersResponse } from "./exportCustomersThunk";
import { RootState } from "../store";
import {
  exportPersonnel,
  ExportPersonnelResponse,
} from "./exportPersonnelThunk";

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
// Personnel
const exportPersonnelSlice = createSlice({
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
      .addCase(exportPersonnel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.downloadUrl = null;
      })
      .addCase(
        exportPersonnel.fulfilled,
        (state, action: PayloadAction<ExportPersonnelResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.downloadUrl = action.payload.url;
          state.lastExportDate = new Date().toISOString();
        },
      )
      .addCase(exportPersonnel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to export personnel";
        state.success = false;
        state.downloadUrl = null;
      });
  },
});

export const { resetExportState, clearDownloadUrl, setLastExportDate } =
  exportPersonnelSlice.actions;

export default exportPersonnelSlice.reducer;

export const selectExportPersonnelLoading = (state: RootState) =>
  state.exportPersonnel.loading;
export const selectExportPersonnelError = (state: RootState) =>
  state.exportPersonnel.error;
export const selectExportPersonnelSuccess = (state: RootState) =>
  state.exportPersonnel.success;
export const selectPersonnelDownloadUrl = (state: RootState) =>
  state.exportPersonnel.downloadUrl;
export const selectPersonnelLastExportDate = (state: RootState) =>
  state.exportPersonnel.lastExportDate;
