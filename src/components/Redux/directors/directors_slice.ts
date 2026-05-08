import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { directors, ErrorResponse } from "./directors_thunk";

interface Personnel {
  id: number;
  first_name: string;
  last_name: string;
}

interface PersonnelsState {
  data: {
    id: number;
    first_name: string;
    last_name: string;
  }[];
  loading: boolean;
  error: ErrorResponse | null;
  success: boolean;
}
interface PersonnelsResponse {
  success: boolean;
  data: Personnel[];
}
const initialState: PersonnelsState = {
  data: [],
  loading: false,
  error: null,
  success: false,
};

const personnelsSlice = createSlice({
  name: "personnels",
  initialState,
  reducers: {
    // You can add additional reducers here if needed
    resetPersonnelsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(directors.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        directors.fulfilled,
        (state, action: PayloadAction<PersonnelsResponse>) => {
          state.loading = false;
          state.data = action.payload.data;
          state.success = action.payload.success;
        }
      )
      .addCase(
        directors.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload || {
            message: "An unknown error occurred",
          };
          state.success = false;
        }
      );
  },
});

export const { resetPersonnelsState } = personnelsSlice.actions;
export default personnelsSlice.reducer;