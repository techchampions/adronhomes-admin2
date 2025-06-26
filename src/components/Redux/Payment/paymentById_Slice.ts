import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPaymentById, User } from './payment_thunk';

// Types
interface Property {
  id: number;
  name: string;
  display_image: string;
  photos: string[];
  size: string;
  price: number;
  type: number;
  no_of_bedroom: number;
  slug: string;
  features: string[];
  overview: string;
  description: string;
  street_address: string;
  country: string;
  state: string;
  lga: string;
  created_at: string | null;
  updated_at: string | null;
  area: string;
  property_map: string | null;
  property_video: string | null;
  virtual_tour: string | null;
  subscriber_form: string | null;
  status: string;
  initial_deposit: number;
  is_sold: number;
  is_active: number;
  property_duration_limit: number;
  payment_schedule: string | null;
  total_amount: number;
  user:User
}

interface PaymentPlan {
  infrastructure_amount: number;
  infrastructure_percentage: number;
  remaining_infrastructure_balance: number;
  paid_infrastructure_amount: number;
  other_amount: number;
  other_percentage: number;
  remaining_other_balance: number;
  paid_other_amount: number;
  id: number;
  payment_percentage: number;
  repayment_schedule: string;
  next_payment_date: string;
  total_amount: number;
  paid_amount: number;
  remaining_balance: number;
  status: number;
  monthly_duration: string;
}

interface PaymentData {
  id: number;
  property_id: number | null;
  user_id: number;
  property_plan_id: number | null;
  order_id: number | null;
  amount_paid: number;
  purpose: string;
  payment_type: string;
  status: number;
  reference: string;
  is_coupon: number;
  created_at: string;
  updated_at: string;
  proof_of_payment: string;
  property: Property | null;
  plan: PaymentPlan | null;
  bank_name:string
    user:User
}

interface SinglePaymentResponse {
  status: string;
  message: string;
  data: PaymentData;
}

interface PaymentState {
  payment: PaymentData | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PaymentState = {
  payment: null,
  loading: false,
  error: null,
};

// Create slice
const paymentSlice = createSlice({
  name: 'paymentById',
  initialState,
  reducers: {
    clearPayment: (state) => {
      state.payment = null;
      state.error = null;
    },
    resetPaymentState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPaymentById.fulfilled,
        (state, action: PayloadAction<SinglePaymentResponse>) => {
          state.loading = false;
          state.payment = action.payload.data;
          state.error = null;
        }
      )
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.payment = null;
        state.error =
          action.payload?.message ||
          action.error.message ||
          'Failed to fetch payment';
      });
  },
});

// Export actions
export const { clearPayment, resetPaymentState } = paymentSlice.actions;

// Export reducer
export default paymentSlice.reducer;