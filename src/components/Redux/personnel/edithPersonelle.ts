import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../store";

export interface User {
  id: number;
  email: string;
  phone_number: string;
  referral_code: string;
  name: string | null;
  first_name: string;
  last_name: string;
  role: number;
  country: string;
  state: string;
  lga: string;
  otp_verified_at: string;
  email_verified_at: string;
  profile_picture: string;
  gender: string | null;
  notification_enabled: number;
  device_id: string;
  address: string;
  created_at: string;
  updated_at: string;
  personnel: string;
  contract_id: string | null;
}

export interface EdithpersonelSuccessResponse {
  success: boolean;
  user: User;
  message: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface EdithPersonnelState {
  loading: boolean;
  success: boolean;
  user: User | null;
  error: ErrorResponse | null;
}

const initialState: EdithPersonnelState = {
  loading: false,
  success: false,
  user: null,
  error: null,
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Edithpersonel = createAsyncThunk<
  EdithpersonelSuccessResponse,
  { UpdateId: any, credentials: FormData },
  { rejectValue: ErrorResponse; state: RootState }
>(
  "editPersonnel/edithpersonel",
  async ({ UpdateId, credentials }, { rejectWithValue }) => {
    const token = Cookies.get('token');
    
    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    try {
      const response = await axios.post<EdithpersonelSuccessResponse>(
        `${BASE_URL}/api/admin/edit-personnel/${UpdateId}`,
        credentials,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          }
        }
      );
      
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        const errorMessage = axiosError.response.data.message || 
          (axiosError.response.data.errors 
            ? Object.values(axiosError.response.data.errors).flat().join(', ')
            : "Failed to update personnel");
        
        toast.error(errorMessage);
        return rejectWithValue(axiosError.response.data);
      }
      
      const errorMessage = axiosError.request 
        ? "No response from server. Please check your network connection."
        : "An unexpected error occurred. Please try again.";
      
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
      });
    }
  }
);

const editPersonnelSlice = createSlice({
  name: "editPersonnel",
  initialState,
  reducers: {
    resetEditPersonnelState: (state) => {
      state.loading = false;
      state.success = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Edithpersonel.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(Edithpersonel.fulfilled, (state, action: PayloadAction<EdithpersonelSuccessResponse>) => {
        state.loading = false;
        state.success = action.payload.success;
        state.user = action.payload.user;
      })
      .addCase(Edithpersonel.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || { message: "An unknown error occurred" };
      });
  },
});

export const { resetEditPersonnelState } = editPersonnelSlice.actions;
export default editPersonnelSlice.reducer;