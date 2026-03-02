import { createSlice } from "@reduxjs/toolkit";
import { fetchPropertyCategories } from "./propertycategorthunk";

interface PropertyCategory {
  id: number;
  created_at: string | null;
  updated_at: string | null;
  category_name: string;
  category_description: string | null;
}

interface PropertyCategoriesState {
  categories: PropertyCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: PropertyCategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

const propertyCategorySlice = createSlice({
  name: "propertyCategories",
  initialState,
  reducers: {
    clearCategories: (state) => {
      state.categories = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.propertyCategory;
      })
      .addCase(fetchPropertyCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch property categories.";
      });
  },
});

export const { clearCategories } = propertyCategorySlice.actions;
export default propertyCategorySlice.reducer;