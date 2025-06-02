import { createSlice } from "@reduxjs/toolkit";
import { ErrorResponse } from "../addProperty_slice";
import { UpdateProperty } from "./updateThunk";

interface PropertyState {
  loading: boolean;
  success: boolean;
  error: ErrorResponse | null;
  propertyId: string | null;
}

const initialState: PropertyState = {
  loading: false,
  success: false,
  error: null,
  propertyId: null,
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    resetPropertyState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.propertyId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(UpdateProperty.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.propertyId = null;
      })
      .addCase(UpdateProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.propertyId = action.payload.propertyId;
        state.error = null;
      })
      .addCase(UpdateProperty.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || {
          message: "An unknown error occurred",
        };
        state.propertyId = null;
      });
  },
});

export const { resetPropertyState } = propertySlice.actions;
export default propertySlice.reducer;