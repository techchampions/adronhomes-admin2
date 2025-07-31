// auth_slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { LoginSuccessResponse, loginUser, ErrorResponse } from "./login_thunk";

interface AuthState {
  loading: boolean;
  token: string | null;
  success: boolean;
  message: string | null;
  otpVerified: boolean;
  error: string | null;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  logoutSuccess: boolean;
}


const initialState: AuthState = {
  loading: false,
  token: Cookies.get("token") || null,
  success: false,
  message: null,
  otpVerified: false,
  error: null,
  user: null,
  logoutSuccess: false, 
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
      state.user = null;
      state.loading = false;
      Cookies.remove("token");
       state.logoutSuccess = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    resetLogoutSuccess: (state) => {
  state.logoutSuccess = false;
},

  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginSuccessResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.token = action.payload.token || null;
          state.message = action.payload.message;
          state.otpVerified = action.payload.otpVerified || false;
          state.user = action.payload.user || null;
          state.error = null;
          
          if (action.payload.token) {
            Cookies.set("token", action.payload.token, { expires: 7 }); // Expires in 7 days
          }
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Login failed";
        state.token = null;
        state.user = null;
        state.otpVerified = false;
      });
  },
});

export const {
  logout,
  clearError,
  resetSuccess,
  clearMessage,
  resetLogoutSuccess, 
} = authSlice.actions;

export default authSlice.reducer;