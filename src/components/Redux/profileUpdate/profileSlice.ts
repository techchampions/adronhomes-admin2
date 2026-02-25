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
  country?: string | null;
  state?: string | null;
  lga?: string | null;
  dateOfBirth?: string | null;
  date_of_birth?: string | null;
  profile_picture?: string | null;
  profilePicture?: string | null;
  notification_enabled?: number;
  address?: string | null;
  referral_code?: string | null;
  gender?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

// API Response interface based on your actual response structure
interface ApiResponse {
  success: boolean;
  message: string;
  data?: User; // User data is inside the 'data' property for updates
  customer?: User; // For fetch details, it might be under 'customer'
  user?: User; // Sometimes it might be under 'user'
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

// Helper function to normalize user data
const normalizeUser = (userData: any): User => {
  if (!userData) return {} as User;
  
  return {
    id: userData.id || 0,
    email: userData.email || "",
    phone_number: userData.phone_number || "",
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    firstName: userData.first_name || "",
    lastName: userData.last_name || "",
    name: userData.name || null,
    country: userData.country || null,
    state: userData.state || null,
    lga: userData.lga || null,
    date_of_birth: userData.date_of_birth || null,
    dateOfBirth: userData.date_of_birth || null,
    profile_picture: userData.profile_picture || null,
    profilePicture: userData.profile_picture || null,
    notification_enabled: userData.notification_enabled ?? 1,
    address: userData.address || null,
    referral_code: userData.referral_code || null,
    gender: userData.gender || null,
    created_at: userData.created_at,
    updated_at: userData.updated_at,
  };
};

// Fetch user details
export const fetchUserDetails = createAsyncThunk(
  "profile/fetchUserDetails",
  async (userId: string | number, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Authentication required. Please login.");
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
        },
      );

      console.log("Fetch User API Response:", response.data);

      // Handle different response structures
      let userData = null;
      const responseData = response.data as ApiResponse;
      
      if (responseData.success) {
        // Check if data is under 'customer' or 'data' property
        if (responseData.customer) {
          userData = responseData.customer;
        } else if (responseData.data) {
          userData = responseData.data;
        } else if (responseData.user) {
          userData = responseData.user;
        } else {
          // If no nested property, assume the response itself is the user data
          userData = responseData;
        }
      }

      if (userData) {
        const normalizedUser = normalizeUser(userData);
        console.log("Normalized user:", normalizedUser);
        return normalizedUser;
      } else {
        return rejectWithValue("Invalid response format");
      }
    } catch (error: any) {
      console.error("Error fetching user:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch user";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (
    { userId, data }: { userId: string; data: FormData },
    { rejectWithValue },
  ) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue("No authentication token found");
    }

    try {
      console.log("Updating profile for user:", userId);
      
      const response = await api.put(
        `${BASE_URL}/api/admin/customer/${userId}/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Update Profile API Response:", response.data);

      // Cast the response to our ApiResponse type
      const responseData = response.data as ApiResponse;

      // Check if the update was successful
      if (!responseData.success) {
        const errorMessage = responseData.message || "Failed to update profile";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }

      // Extract user data from the response
      // Based on your actual response: { success: true, message: "...", data: { ...userData } }
      let userData = null;
      
      if (responseData.data) {
        userData = responseData.data;
      } else if (responseData.customer) {
        userData = responseData.customer;
      } else if (responseData.user) {
        userData = responseData.user;
      } else {
        // Check if the response itself has user properties
        const anyResponse = responseData as any;
        if (anyResponse.id || anyResponse.email) {
          userData = anyResponse;
        }
      }

      if (!userData) {
        console.warn("No user data found in response, using original data");
        toast.success(responseData.message || "Profile updated successfully");
        
        // Return a partial update with the form data
        const formDataObj: any = {};
        data.forEach((value, key) => {
          formDataObj[key] = value;
        });
        
        return formDataObj as User;
      }

      const normalizedUser = normalizeUser(userData);
      console.log("Normalized updated user:", normalizedUser);
      
      toast.success(responseData.message || "Profile updated successfully");
      return normalizedUser;

    } catch (error: any) {
      console.error("Error updating profile:", error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
        return rejectWithValue("Session expired. Please login again.");
      }
      
      if (error.response?.status === 422) {
        const errorData = error.response.data;
        if (errorData && errorData.errors) {
          // Get the first error message safely
          const errors = errorData.errors;
          const firstErrorKey = Object.keys(errors)[0];
          const firstErrorMessage = firstErrorKey && errors[firstErrorKey] && errors[firstErrorKey][0] 
            ? errors[firstErrorKey][0] 
            : "Validation error";
          
          toast.error(firstErrorMessage);
          return rejectWithValue(firstErrorMessage);
        }
      }
      
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
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
        console.log("User fetched successfully:", action.payload);
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log("User fetch failed:", action.payload);
      })

      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        console.log("Update pending - setting updateLoading to true");
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        console.log("Update fulfilled - setting updateLoading to false, user updated:", action.payload);
        state.updateLoading = false;
        
        // Merge the updated data with existing user data
        if (state.user && action.payload) {
          state.user = {
            ...state.user,
            ...action.payload,
            // Ensure both naming conventions are preserved
            firstName: action.payload.firstName || action.payload.first_name || state.user.firstName,
            lastName: action.payload.lastName || action.payload.last_name || state.user.lastName,
            first_name: action.payload.first_name || action.payload.firstName || state.user.first_name,
            last_name: action.payload.last_name || action.payload.lastName || state.user.last_name,
            dateOfBirth: action.payload.dateOfBirth || action.payload.date_of_birth || state.user.dateOfBirth,
            date_of_birth: action.payload.date_of_birth || action.payload.dateOfBirth || state.user.date_of_birth,
            profilePicture: action.payload.profilePicture || action.payload.profile_picture || state.user.profilePicture,
            profile_picture: action.payload.profile_picture || action.payload.profilePicture || state.user.profile_picture,
          };
        } else {
          state.user = action.payload;
        }
        
        state.updateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        console.log("Update rejected - setting updateLoading to false");
        state.updateLoading = false;
        state.updateError = action.payload as string;
        state.updateSuccess = false;
      });
  },
});

export const { resetProfileState, resetUpdateState, setUser, clearUser } =
  profileSlice.actions;

// Selectors
export const selectUser = (state: RootState) => {
  return state.profile.user;
};

export const selectProfileLoading = (state: RootState) => {
  return state.profile.loading;
};

export const selectProfileError = (state: RootState) => state.profile.error;

export const selectUpdateLoading = (state: RootState) => {
  return state.profile.updateLoading;
};

export const selectUpdateError = (state: RootState) => {
  return state.profile.updateError;
};

export const selectUpdateSuccess = (state: RootState) => {
  return state.profile.updateSuccess;
};

export default profileSlice.reducer;