import { createSlice } from "@reduxjs/toolkit";
import { DeleteProperty } from "./deleteThunk";


interface UpdatePropertyState {
  loading: boolean;
  success: boolean;
  error: string | null;
  propertyId: string | null;
}

const initialState: UpdatePropertyState = {
  loading: false,
  success: false,
  error: null,
  propertyId: null,
};

const updatePropertySlice = createSlice({
  name: "updateProperty",
  initialState,
  reducers: {
    resetUpdatePropertyState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.propertyId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(DeleteProperty.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.propertyId = null;
      })
      .addCase(DeleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.propertyId = action.payload.propertyId;
        state.error = null;
      })
      .addCase(DeleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.propertyId = null;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export const { resetUpdatePropertyState } = updatePropertySlice.actions;

export default updatePropertySlice.reducer;