import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { LoginSuccessResponse, loginUser } from "./login_thunk";

interface AuthState {
  loading: boolean;
  token: string | null;
  success: boolean;
  message: string | null;
  otpVerified: boolean;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  token: null,
  success: false,
  message: null,
  otpVerified: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.success = false;
      state.message = null;
      state.otpVerified = false;
      state.error = null;
      Cookies.remove("token");
    },
    clearError: (state) => {
      state.error = null;
    },
      resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginSuccessResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.token = action.payload.token || null;
          state.message = action.payload.message;
          state.otpVerified = action.payload.otpVerified || false;
          
          if (action.payload.token) {
            Cookies.set("token", action.payload.token);
          }
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Login failed";
      });
  },
});

export const { logout, clearError,resetSuccess } = authSlice.actions;
export default authSlice.reducer;