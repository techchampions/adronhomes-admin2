import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  add_property_detail,
  add_property_detailPropertySuccessResponse,
} from "./addFees_thunk";
import { ErrorResponse } from "../addProperty_thunk";

interface PropertyDetailState {
  loading: boolean;
  data: add_property_detailPropertySuccessResponse | null;
  error: ErrorResponse | null;
}

const initialState: PropertyDetailState = {
  loading: false,
  data: null,
  error: null,
};

const addPropertyDetailSlice = createSlice({
  name: "addPropertyDetail",
  initialState,
  reducers: {
    resetPropertyDetailState: (state) => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(add_property_detail.pending, (state) => {
        state.loading = true;
        state.data = null;
        state.error = null;
      })
      .addCase(
        add_property_detail.fulfilled,
        (
          state,
          action: PayloadAction<add_property_detailPropertySuccessResponse>
        ) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(
        add_property_detail.rejected,
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

export const { resetPropertyDetailState } = addPropertyDetailSlice.actions;
export default addPropertyDetailSlice.reducer;
