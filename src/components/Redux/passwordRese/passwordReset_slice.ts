// passwordReset_slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { 
  ResetPasswordSuccessResponse, 
  resetPassword,
  ErrorResponse 
} from "./passwordReset_thunk";

interface PasswordResetState {
  loading: boolean;
  success: boolean;
  message: string | null;
  error: string | null;
}

const initialState: PasswordResetState = {
  loading: false,
  success: false,
  message: null,
  error: null,
};

const passwordResetSlice = createSlice({
  name: "passwordReset",
  initialState,
  reducers: {
    resetPasswordState: (state) => {
      state.loading = false;
      state.success = false;
      state.message = null;
      state.error = null;
    },
    clearPasswordResetError: (state) => {
      state.error = null;
    },
    clearPasswordResetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(
        resetPassword.fulfilled,
        (state, action: PayloadAction<ResetPasswordSuccessResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
        state.message = action.payload.message; 
          state.error = null;
        }
      )
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Password reset failed";
        state.message = null;
      });
  },
});

export const {
  resetPasswordState,
  clearPasswordResetError,
  clearPasswordResetMessage,
} = passwordResetSlice.actions;

export default passwordResetSlice.reducer;