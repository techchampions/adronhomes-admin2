// propertySlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPropertyData, SavedPropertyUser } from "./propertiesDetails_thunk";
import { SimilarPropertyUser } from "./types";

interface PropertyState {
  data: {
    properties: any[];
    saved_property_user: SavedPropertyUser[];
    similar_property_user: SimilarPropertyUser[];
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  data: null,
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    clearPropertyData: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPropertyData.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.data = action.payload.data;
        }
      )
      .addCase(fetchPropertyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch property data";
      });
  },
});

export const { clearPropertyData } = propertySlice.actions;
export default propertySlice.reducer;