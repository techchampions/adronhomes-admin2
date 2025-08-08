import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Career, ErrorResponse, fetchCareerById } from "./ViewApplicationthunk";


export interface CareerState {
  data: Career | null;
  loading: boolean;
  error: ErrorResponse | null;
}

const initialState: CareerState = {
  data: null,
  loading: false,
  error: null,
};

const careerSlice = createSlice({
  name: "career",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCareerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCareerById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.career;
      })
      .addCase(fetchCareerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to fetch career details",
        };
      });
  },
});

export default careerSlice.reducer;
