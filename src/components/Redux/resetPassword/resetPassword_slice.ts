import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ErrorResponse,
  OtpPasswordResetData,
  SendotpSuccessResponse,
} from "./reset_Password_thunk";

interface OtpPasswordState {
  data: SendotpSuccessResponse | null;
  loading: boolean;
  error: ErrorResponse | null;
  success: boolean | null;
}

const initialState: OtpPasswordState = {
  data: null,
  loading: false,
  error: null,
  success: null,
};

const otpPasswordSlice = createSlice({
  name: "otpPassword",
  initialState,
  reducers: {
    resetOtpPasswordState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(OtpPasswordResetData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(
        OtpPasswordResetData.fulfilled,
        (state, action: PayloadAction<SendotpSuccessResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.data = action.payload;
        }
      )
      .addCase(
        OtpPasswordResetData.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.success = action.payload?.success || false;
          state.error = action.payload || {
            success: false,
            message: "An unexpected error occurred",
          };
        }
      );
  },
});

export const { resetOtpPasswordState } = otpPasswordSlice.actions;
export default otpPasswordSlice.reducer;
