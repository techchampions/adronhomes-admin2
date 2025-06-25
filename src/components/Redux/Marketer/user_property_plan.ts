import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

// Types
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Property {
  id: number;
  name: string;
  type: number;
  features: string[];
  price: number;
  size: string;
  display_image: string;
  lga: string;
  state: string;
  total_amount: number;
}

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
  profile_picture: string | null;
  gender: string | null;
  notification_enabled: number;
  device_id: string;
  address: string;
  created_at: string;
  updated_at: string;
  personnel: string;
  contract_id: number | null;
}

export interface NextRepayment {
  id: number;
  property_id: number;
  plan_id: number;
  status: number;
  amount: number;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  property_id: number;
  user_id: number;
  plan_id: number;
  amount: number;
  status: number;
  description: string;
  transaction_method: string;
  created_at: string;
  updated_at: string;
  marketer_id: number;
  reference: string;
  property: {
    id: number;
    name: string;
    price: number;
    size: string;
    display_image: string;
    lga: string;
    state: string;
    total_amount: number;
  };
}

export interface PlanProperty {
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
  monthly_duration: string;
  payment_type: string;
  end_date: string | null;
  start_date: string | null;
  payment_method: string | null;
  repayment_schedule: string;
  next_payment_date: string;
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
  property: Property;
  user: User;
}

// API response shape
interface UserPropertyPlanResponse {
  success: boolean;
  plan_properties: PlanProperty;
  next_repayment: NextRepayment;
  transactions: Transaction[];
}

interface UserPropertyPlanParams {
  planId: any;
  userId: any;
}

interface UserPropertyPlanState {
  data: {
    planProperties: PlanProperty | null;
    nextRepayment: NextRepayment | null;
    transactions: Transaction[] | null;
  };
  loading: boolean;
  error: string | null;
}

const initialState: UserPropertyPlanState = {
  data: {
    planProperties: null,
    nextRepayment: null,
    transactions: null,
  },
  loading: false,
  error: null,
};

// Thunk
export const fetchUserPropertyPlan = createAsyncThunk<
  UserPropertyPlanResponse,
  UserPropertyPlanParams,
  {
    rejectValue: ErrorResponse;
  }
>(
  'userPropertyPlan/fetch',
  async ({ planId, userId }, { rejectWithValue }) => {
    const token = Cookies.get('token');

    if (!token) {
      return rejectWithValue({ message: 'No authentication token found. Please login again.' });
    }

    try {
      const response = await axios.get<UserPropertyPlanResponse>(
        `https://adron.microf10.sg-host.com/api/user-property-plan/${planId}/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            identifier: 'dMNOcdMNOPefFGHIlefFGHIJKLmno',
            device_id: '1010l0010l1',
          },
        }
      );
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
        toast.error('Session expired. Please login again.');
      }

      if (axiosError.response) {
        return rejectWithValue({
          message: axiosError.response.data.message || 'Failed to fetch user property plan',
          errors: axiosError.response.data.errors,
        });
      } else if (axiosError.request) {
        return rejectWithValue({
          message: 'No response from server. Please check your network connection.',
        });
      }

      return rejectWithValue({
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  }
);

// Slice
const userPropertyPlanSlice = createSlice({
  name: 'userPropertyPlan',
  initialState,
  reducers: {
    clearUserPropertyPlan: (state) => {
      state.data = {
        planProperties: null,
        nextRepayment: null,
        transactions: null,
      };
      state.error = null;
    },
    resetUserPropertyPlanState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPropertyPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserPropertyPlan.fulfilled,
        (state, action: PayloadAction<UserPropertyPlanResponse>) => {
          const { plan_properties, next_repayment, transactions } = action.payload;
          state.loading = false;
          state.data = {
            planProperties: plan_properties,
            nextRepayment: next_repayment,
            transactions,
          };
          state.error = null;
        }
      )
      .addCase(fetchUserPropertyPlan.rejected, (state, action) => {
        state.loading = false;
        state.data = {
          planProperties: null,
          nextRepayment: null,
          transactions: null,
        };
        state.error =
          (action.payload && 'message' in action.payload)
            ? action.payload.message
            : action.error.message || 'Failed to fetch user property plan';
      });
  },
});

// Exports
export const { clearUserPropertyPlan, resetUserPropertyPlanState } =
  userPropertyPlanSlice.actions;
export default userPropertyPlanSlice.reducer;