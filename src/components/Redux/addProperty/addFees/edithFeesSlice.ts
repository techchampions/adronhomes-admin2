import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  edit_property_detail,
  EditPropertyDetailSuccessResponse,
  ErrorResponse,
} from "./edithFees";

// Define the state interface
interface PropertyDetailState {
  loading: boolean;
  data: EditPropertyDetailSuccessResponse | null;
  error: ErrorResponse | null;
}

const initialState: PropertyDetailState = {
  loading: false,
  data: null,
  error: null,
};

// Create the slice
const editPropertyDetailSlice = createSlice({
  name: "editPropertyDetail",
  initialState,
  reducers: {
    resetEditPropertyDetailState: (state) => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(edit_property_detail.pending, (state) => {
        state.loading = true;
        state.data = null;
        state.error = null;
      })
      .addCase(
        edit_property_detail.fulfilled,
        (
          state,
          action: PayloadAction<EditPropertyDetailSuccessResponse>
        ) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(
        edit_property_detail.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.data = null;
          state.error = action.payload || {
            message: "An unknown error occurred",
          };
        }
      );
  },
});

export const { resetEditPropertyDetailState } = editPropertyDetailSlice.actions;
export default editPropertyDetailSlice.reducer;