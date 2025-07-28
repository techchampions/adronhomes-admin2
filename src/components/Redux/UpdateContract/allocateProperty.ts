import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../store";

export interface PlanData {
  id: number;
  property_id: number;
  user_id: number;
  property_type: number;
  total_amount: number;
  paid_amount: number;
  remaining_balance: number;
  status: number;
  payment_percentage: number;
  payment_completed_at: string | null;
  created_at: string;
  updated_at: string;
  monthly_duration: number | null;
  payment_type: string;
  end_date: string;
  start_date: string;
  payment_method: string | null;
  repayment_schedule: string | null;
  next_payment_date: string | null;
  marketer_id: number;
  infrastructure_percentage: number;
  infrastructure_amount: number;
  other_percentage: number;
  other_amount: number;
  remaining_infrastructure_balance: number;
  remaining_other_balance: number;
  paid_infrastructure_amount: number;
  paid_other_amount: number;
  contract_id: number | null;
  number_of_unit: number;
  initial_payment_percentage: number;
  is_a_contract: number;
}

export interface AllocatePropertySuccessResponse {
  success: boolean;
  message: string;
  data: PlanData;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface AllocatePropertyState {
  loading: boolean;
  success: boolean;
  data: PlanData | null;
  error: ErrorResponse | null;
}

const initialState: AllocatePropertyState = {
  loading: false,
  success: false,
  data: null,
  error: null,
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AllocatePropertyRequestBody {
  plan_id: number;
}

export const allocateProperty = createAsyncThunk<
  AllocatePropertySuccessResponse,
  AllocatePropertyRequestBody,
  { rejectValue: ErrorResponse; state: RootState }
>(
  "allocateProperty/allocateProperty",
  async (body, { rejectWithValue }) => {
    const token = Cookies.get('token');
    
    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    try {
      const response = await axios.post<AllocatePropertySuccessResponse>(
        `${BASE_URL}/api/admin/allocate-property`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
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
            : "Failed to allocate property");
        
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

const allocatePropertySlice = createSlice({
  name: "allocateProperty",
  initialState,
  reducers: {
    resetAllocatePropertyState: (state) => {
      state.loading = false;
      state.success = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(allocateProperty.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(allocateProperty.fulfilled, (state, action: PayloadAction<AllocatePropertySuccessResponse>) => {
        state.loading = false;
        state.success = action.payload.success;
        state.data = action.payload.data;
      })
      .addCase(allocateProperty.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || { message: "An unknown error occurred" };
      });
  },
});

export const { resetAllocatePropertyState } = allocatePropertySlice.actions;
export default allocatePropertySlice.reducer;