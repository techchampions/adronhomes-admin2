import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ErrorResponse,
  UpdatePaymentstatus,
  UpdatePaymentstatusResponse,
} from "./payment_thunk";

interface PaymentState {
  payment: UpdatePaymentstatusResponse["payment"] | null;
  loading: boolean;
  error: ErrorResponse | null;
  success: boolean;
  message: string | null;
}

const initialState: PaymentState = {
  payment: null,
  loading: false,
  error: null,
  success: false,
  message: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(UpdatePaymentstatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        UpdatePaymentstatus.fulfilled,
        (state, action: PayloadAction<UpdatePaymentstatusResponse>) => {
          state.loading = false;
          state.payment = action.payload.payment;
          state.success = true;
          state.message = action.payload.message;
        }
      )
      .addCase(
        UpdatePaymentstatus.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload || {
            message: "An unknown error occurred",
          };
          state.success = false;
        }
      );
  },
});

// Actions
export const { resetPaymentStatus } = paymentSlice.actions;

export default paymentSlice.reducer;
