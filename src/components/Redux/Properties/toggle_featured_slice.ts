import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toggleFeatured, ToggleFeaturedResponse, ErrorResponse } from "./toggle_featured_thunk";

// Interface for the overall state
interface ToggleFeaturedState {
  message: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  propertyId: number | null;
  isFeatured: boolean | null;
}

// Initial state for the slice
const initialState: ToggleFeaturedState = {
  message: null,
  loading: false,
  error: null,
  success: false,
  propertyId: null,
  isFeatured: null,
};

// Create the Redux slice
const toggleFeaturedSlice = createSlice({
  name: "toggle_featured",
  initialState,
  reducers: {
    // Reducer to reset the state
    resetToggleFeaturedState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(toggleFeatured.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
        state.propertyId = action.meta.arg.id; 
      })
      // Handle fulfilled state
      .addCase(
        toggleFeatured.fulfilled,
        (state, action: PayloadAction<ToggleFeaturedResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.message = action.payload.message;
          state.error = null;
          state.propertyId = action.payload.data.id;
          state.isFeatured = action.payload.data.is_featured === 1; 
        }
      )
      .addCase(toggleFeatured.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update featured status";
        state.success = false;
        state.message = null;
      });
  },
});

// Export actions
export const { resetToggleFeaturedState } = toggleFeaturedSlice.actions;

// Export the reducer
export default toggleFeaturedSlice.reducer;

// Selectors
export const selectToggleFeaturedMessage = (state: { toggleFeatured: ToggleFeaturedState }) =>
  state.toggleFeatured.message;
export const selectToggleFeaturedLoading = (state: { toggleFeatured: ToggleFeaturedState }) =>
  state.toggleFeatured.loading;
export const selectToggleFeaturedError = (state: { toggleFeatured: ToggleFeaturedState }) =>
  state.toggleFeatured.error;
export const selectToggleFeaturedSuccess = (state: { toggleFeatured: ToggleFeaturedState }) =>
  state.toggleFeatured.success;
export const selectToggleFeaturedStatus = (state: { toggleFeatured: ToggleFeaturedState }) =>
  state.toggleFeatured.isFeatured;