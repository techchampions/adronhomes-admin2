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
  no_of_bedroom?: number | null;
  slug?: string;
  overview?: string;
  description?: string;
  street_address?: string;
  country?: string;
  photos?: string[];
  created_at?: string;
  updated_at?: string;
  area?: string | null;
  property_map?: string | null;
  property_video?: string | null;
  virtual_tour?: string | null;
  subscriber_form?: string | null;
  status?: string;
  initial_deposit?: number;
  is_sold?: number;
  is_active?: number;
  property_duration_limit?: number;
  payment_schedule?: string[];
  category?: string;
  is_discount?: boolean;
  discount_name?: string | null;
  discount_percentage?: number | null;
  discount_units?: number | null;
  discount_start_date?: string | null;
  discount_end_date?: string | null;
  parking_space?: number | null;
  number_of_bathroom?: number | null;
  number_of_unit?: number;
  property_agreement?: string;
  payment_type?: string;
  location_type?: string;
  purpose?: string;
  year_built?: string | null;
  shape?: string;
  topography?: string | null;
  title_document_type?: string;
  road_access?: string;
  director_id?: number;
  unit_available?: number;
  unit_sold?: number;
  property_view?: number;
  property_requests?: number;
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
  country: string | null;
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
  contract_id: string;
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
  user_id?: number;
  director_id?: number;
  marketer_id?: number | null;
}

export interface Transaction {
  id: number;
  property_id: number;
  user_id: number;
  property_plan_id: number;
  order_id: number | null;
  amount_paid: number;
  purpose: string;
  payment_type: string;
  status: number;
  reference: string;
  is_coupon: number;
  created_at: string;
  updated_at: string;
  proof_of_payment: string | null;
  bank_name: string | null;
  description: string;
  marketer_id: number | null;
  director_id: number;
  property: Property;
}

export interface InfrastructureBreakdown {
  id: number;
  name: string;
  value: number;
  property_id: number;
  created_at: string;
  updated_at: string;
  type: string;
}

export interface OthersBreakdown {
  id: number;
  name: string;
  value: number;
  property_id: number;
  created_at: string;
  updated_at: string;
  type: string;
}

export interface ContractDocument {
  id: number;
  plan_id: number;
  document_name: string;
  document_file: string;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: number;
  plan_id: number;
  status: number;
  property_id: number;
  user_id: number;
  unique_contract_id: string;
  contract_customer_id: string;
  contract_business_type: string;
  contract_subscriber_name_1: string;
  contract_subscriber_name_2: string;
  contract_subscriber_name_3: string;
  contract_additional_name: string;
  contract_transaction_date: string | null;
  contract_purpose: string | null;
  contract_promo: string | null;
  contract_quantity: number | null;
  contract_gender: string;
  contract_marital_status: string;
  contract_date_of_birth: string;
  contract_nationality: string;
  contract_residential_address: string;
  contract_town: string;
  contract_state: string;
  contract_country: string;
  contract_sms: string;
  contract_email: string;
  contract_processing_fee: number | null;
  contract_manual_discount: number | null;
  contract_termination_charge: number | null;
  contract_main_marketer: string | null;
  contract_marketer_1: string | null;
  contract_marketer_2: string | null;
  contract_employer: string;
  contract_occupation: string;
  contract_employer_address: string;
  contract_next_of_kin: string;
  contract_next_of_kin_address: string;
  contract_next_of_kin_phone: string | null;
  contract_next_of_kin_relationship: string;
  contract_management_document: string | null;
  contract_profile_picture: string;
  created_at: string;
  updated_at: string;
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
  monthly_duration: string | null;
  payment_type: string;
  end_date: string | null;
  start_date: string | null;
  payment_method: string | null;
  repayment_schedule: string | null;
  next_payment_date: string | null;
  marketer_id: number | null;
  infrastructure_percentage: number;
  infrastructure_amount: number;
  other_percentage: number;
  other_amount: number;
  remaining_infrastructure_balance: number;
  remaining_other_balance: number;
  paid_infrastructure_amount: number;
  paid_other_amount: number;
  contract_id: string;
  number_of_unit: number;
  initial_payment_percentage: number;
  is_a_contract: number;
  property: Property;
  user: User;
}

// API response shape
interface UserPropertyPlanResponse {
  success: boolean;
  plan_properties: PlanProperty;
  infrastructure_breakdown: InfrastructureBreakdown[];
  others_breakdown: OthersBreakdown[];
  next_repayment: NextRepayment | null;
  transactions: Transaction[];
  contract: Contract;
  contract_documents: ContractDocument[];
}

interface UserPropertyPlanParams {
  planId: any;
  userId: any;
}

interface UserPropertyPlanState {
  data: {
    planProperties: PlanProperty | null;
    infrastructureBreakdown: InfrastructureBreakdown[] | null;
    othersBreakdown: OthersBreakdown[] | null;
    nextRepayment: NextRepayment | null;
    transactions: Transaction[] | null;
    contract: Contract | null;
    contractDocuments: ContractDocument[] | null;
  };
  loading: boolean;
  error: string | null;
}

const initialState: UserPropertyPlanState = {
  data: {
    planProperties: null,
    infrastructureBreakdown: null,
    othersBreakdown: null,
    nextRepayment: null,
    transactions: null,
    contract: null,
    contractDocuments: null,
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
        infrastructureBreakdown: null,
        othersBreakdown: null,
        nextRepayment: null,
        transactions: null,
        contract: null,
        contractDocuments: null,
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
          const { 
            plan_properties, 
            infrastructure_breakdown, 
            others_breakdown, 
            next_repayment, 
            transactions,
            contract,
            contract_documents
          } = action.payload;
          state.loading = false;
          state.data = {
            planProperties: plan_properties,
            infrastructureBreakdown: infrastructure_breakdown,
            othersBreakdown: others_breakdown,
            nextRepayment: next_repayment,
            transactions,
            contract,
            contractDocuments: contract_documents
          };
          state.error = null;
        }
      )
      .addCase(fetchUserPropertyPlan.rejected, (state, action) => {
        state.loading = false;
        state.data = {
          planProperties: null,
          infrastructureBreakdown: null,
          othersBreakdown: null,
          nextRepayment: null,
          transactions: null,
          contract: null,
          contractDocuments: null,
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