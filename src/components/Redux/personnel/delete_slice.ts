import { createSlice } from "@reduxjs/toolkit";
import { DeletePersonel } from "./deleteThunk";

interface UpdatePropertyState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: UpdatePropertyState = {
  loading: false,
  success: false,
  error: null,
};

const delete_slice = createSlice({
  name: "updateProperty",
  initialState,
  reducers: {
    resetUpdatePropertyState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(DeletePersonel.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(DeletePersonel.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.error = null;
      })
      .addCase(DeletePersonel.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export const { resetUpdatePropertyState } = delete_slice.actions;

export default delete_slice.reducer;
