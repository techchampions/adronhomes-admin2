import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toggleLatest, ToggleLatestResponse, ErrorResponse } from "./tooggleLatestThunk";
// import { toggleLatest, ToggleLatestResponse, ErrorResponse } from "./toggle_latest_thunk";

interface ToggleLatestState {
  message: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  propertyId: number | null;
  isLatest: boolean | null;
}

const initialState: ToggleLatestState = {
  message: null,
  loading: false,
  error: null,
  success: false,
  propertyId: null,
  isLatest: null,
};

const toggleLatestSlice = createSlice({
  name: "toggle_latest",
  initialState,
  reducers: {
    resetToggleLatestState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleLatest.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
        state.propertyId = action.meta.arg.id; 
      })
      .addCase(
        toggleLatest.fulfilled,
        (state, action: PayloadAction<ToggleLatestResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.message = action.payload.message;
          state.error = null;
          state.propertyId = action.payload.data.id;
          state.isLatest = action.payload.data.is_latest === 1; 
        }
      )
      .addCase(toggleLatest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update latest offer status";
        state.success = false;
        state.message = null;
      });
  },
});

export const { resetToggleLatestState } = toggleLatestSlice.actions;

export default toggleLatestSlice.reducer;

export const selectToggleLatestMessage = (state: { toggleLatest: ToggleLatestState }) =>
  state.toggleLatest.message;
export const selectToggleLatestLoading = (state: { toggleLatest: ToggleLatestState }) =>
  state.toggleLatest.loading;
export const selectToggleLatestError = (state: { toggleLatest: ToggleLatestState }) =>
  state.toggleLatest.error;
export const selectToggleLatestSuccess = (state: { toggleLatest: ToggleLatestState }) =>
  state.toggleLatest.success;
export const selectToggleLatestStatus = (state: { toggleLatest: ToggleLatestState }) =>
  state.toggleLatest.isLatest;