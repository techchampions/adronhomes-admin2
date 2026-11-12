import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  exportPropertyRequests,
  ExportPropertyRequestsResponse,
} from "./exportPropertyRequestsThunk";
import { RootState } from "../store";

interface ExportPropertyRequestsState {
  loading: boolean;
  error: string | null;
  success: boolean;
  downloadUrl: string | null;
  lastExportDate: string | null;
}

const initialState: ExportPropertyRequestsState = {
  loading: false,
  error: null,
  success: false,
  downloadUrl: null,
  lastExportDate: null,
};

const exportPropertyRequestsSlice = createSlice({
  name: "exportPropertyRequests",
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
      .addCase(exportPropertyRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.downloadUrl = null;
      })
      .addCase(
        exportPropertyRequests.fulfilled,
        (state, action: PayloadAction<ExportPropertyRequestsResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.downloadUrl = action.payload.url;
          state.lastExportDate = new Date().toISOString();
        },
      )
      .addCase(exportPropertyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to export requests and enquiries";
        state.success = false;
        state.downloadUrl = null;
      });
  },
});

export const { resetExportState, clearDownloadUrl, setLastExportDate } =
  exportPropertyRequestsSlice.actions;

export default exportPropertyRequestsSlice.reducer;

export const selectExportPropertyRequestsLoading = (state: RootState) =>
  state.exportPropertyRequests.loading;
export const selectExportPropertyRequestsError = (state: RootState) =>
  state.exportPropertyRequests.error;
export const selectExportPropertyRequestsSuccess = (state: RootState) =>
  state.exportPropertyRequests.success;
export const selectExportPropertyRequestsDownloadUrl = (state: RootState) =>
  state.exportPropertyRequests.downloadUrl;
export const selectExportPropertyRequestsLastExportDate = (state: RootState) =>
  state.exportPropertyRequests.lastExportDate;
