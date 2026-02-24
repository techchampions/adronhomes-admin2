// profileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import { toast } from "react-toastify";
import api from "../middleware";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Update the User interface to match your API structure
export interface User {
  id: number;
  email: string;
  phone_number: string;
  first_name?: string;
  last_name?: string;
  firstName?: string; // Keep both for compatibility
  lastName?: string;
  name?: string | null;
  country?: string;
  state?: string;
  lga?: string;
  dateOfBirth?: string;
  date_of_birth?: string;
  profile_picture?: string;
  profilePicture?: string;
  notification_enabled?: number;
  address?: string;
  referral_code?: string | null;
  [key: string]: any;
}

interface ProfileState {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  updateSuccess: boolean;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
};

// Fetch user details
// profileSlice.ts (updated fetchUserDetails)
// Complete fetchUserDetails thunk
export const fetchUserDetails = createAsyncThunk(
  "profile/fetchUserDetails",
  async (userId: string | number, { rejectWithValue }) => {
    const token = Cookies.get("token");
    
    if (!token) {
      return rejectWithValue("No authentication token found");
    }
    
    try {
      const response = await api.get(
        `${BASE_URL}/api/admin/customer/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("API Response:", response.data); // Debug log
      
      if (response.data.success && response.data.customer) {
        // Transform the customer data to match your expected format
        const customerData = response.data.customer;
        
        // Create a normalized user object
        const normalizedUser = {
          id: customerData.id,
          email: customerData.email,
          phone_number: customerData.phone_number,
          first_name: customerData.first_name || "",
          last_name: customerData.last_name || "",
          firstName: customerData.first_name || "",
          lastName: customerData.last_name || "",
          country: customerData.country || "",
          state: customerData.state || "",
          lga: customerData.lga || "",
          date_of_birth: customerData.date_of_birth || "",
          dateOfBirth: customerData.date_of_birth || "",
          profile_picture: customerData.profile_picture || "",
          profilePicture: customerData.profile_picture || "",
          notification_enabled: customerData.notification_enabled || 1,
          address: customerData.address || "",
          referral_code: customerData.referral_code,
          name: customerData.name,
        };
        
        return normalizedUser;
      } else {
        return rejectWithValue("Invalid response format");
      }
    } catch (error: any) {
      console.error("Error fetching user:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);
// Update user profile
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async ({ userId, data }: { userId: string; data: FormData }, { rejectWithValue }) => {
    const token = Cookies.get("token");
    
    try {
      const response = await api.put(
        `${BASE_URL}/api/admin/customer/${userId}/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.loading = false;
      state.error = null;
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
    resetUpdateState: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.user = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
        state.updateSuccess = false;
      });
  },
});

export const { resetProfileState, resetUpdateState, setUser, clearUser } = profileSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.profile.user;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
export const selectProfileError = (state: RootState) => state.profile.error;
export const selectUpdateLoading = (state: RootState) => state.profile.updateLoading;
export const selectUpdateError = (state: RootState) => state.profile.updateError;
export const selectUpdateSuccess = (state: RootState) => state.profile.updateSuccess;

export default profileSlice.reducer;