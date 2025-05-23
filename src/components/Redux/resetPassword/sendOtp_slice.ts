import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorResponse, Sendotp, SendotpSuccessResponse } from "./reset_Password_thunk";

interface OtpState {
  loading: boolean;
  success: boolean | null;
  message: string | null;
  errors: Record<string, string[]> | null;
}

const initialState: OtpState = {
  loading: false,
  success: null,
  message: null,
  errors: null,
};

const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    resetOtpState: (state) => {
      state.loading = false;
      state.success = null;
      state.message = null;
      state.errors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Sendotp.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.message = null;
        state.errors = null;
      })
      .addCase(
        Sendotp.fulfilled,
        (state, action: PayloadAction<SendotpSuccessResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.message = action.payload.message;
        }
      )
      .addCase(
        Sendotp.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.success = action.payload?.success || false;
          state.message = action.payload?.message || "An unexpected error occurred";
          state.errors = action.payload?.errors || null;
        }
      );
  },
});

export const { resetOtpState } = otpSlice.actions;
export default otpSlice.reducer;