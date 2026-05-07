// profileThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import { toast } from "react-toastify";
import { ErrorResponse, UpdateProfileResponse, UpdateProfilePayload } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://adron.microf10.sg-host.com";

export const updateUserProfile = createAsyncThunk<
  UpdateProfileResponse,
  { userId: string; data: FormData | UpdateProfilePayload },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "profile/updateUser",
  async ({ userId, data }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const isFormData = data instanceof FormData;
      
      const response = await axios.put<UpdateProfileResponse>(
        `${BASE_URL}/api/admin/customer/${userId}/update`,
        data,
        {
          headers: {
            ...(isFormData 
              ? { "Content-Type": "multipart/form-data" }
              : { "Content-Type": "application/json" }
            ),
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
        }
      );

      toast.success(response.data.message || "Profile updated successfully");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data.message || "Failed to update profile";
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