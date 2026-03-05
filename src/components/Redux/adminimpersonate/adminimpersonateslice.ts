import { createSlice } from "@reduxjs/toolkit";
import { impersonateUser } from "./adminimpersonatethunk";

interface ImpersonatedUser {
  id: number;
  email: string;
  phone_number: string;
  referral_code: string;
  name: string | null;
  first_name: string;
  last_name: string;
  role: number;
  country: string;
  state: string | null;
  lga: string | null;
  otp_verified_at: string;
  email_verified_at: string;
  profile_picture: string | null;
  gender: string | null;
  notification_enabled: number;
  device_id: string;
  address: string | null;
  created_at: string;
  updated_at: string;
  personnel: string;
  contract_id: string | null;
  unique_customer_id: string;
  date_of_birth: string | null;
  created_origin: string;
}

interface AdminImpersonateState {
  user: ImpersonatedUser | null;
  impersonationToken: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: AdminImpersonateState = {
  user: null,
  impersonationToken: null,
  loading: false,
  error: null,
  success: false,
  message: null,
};

const adminImpersonateSlice = createSlice({
  name: "adminImpersonate",
  initialState,
  reducers: {
    clearImpersonation: (state) => {
      state.user = null;
      state.impersonationToken = null;
      state.error = null;
      state.success = false;
      state.message = null;
    },
    clearImpersonationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(impersonateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(impersonateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.impersonationToken = action.payload.token;
        state.user = action.payload.data;
      })
      .addCase(impersonateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to impersonate user.";
        state.success = false;
      });
  },
});

export const { clearImpersonation, clearImpersonationError } = adminImpersonateSlice.actions;
export default adminImpersonateSlice.reducer;