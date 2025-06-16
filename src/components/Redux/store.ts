// store.ts
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "../Redux/Login/login_slice";
import userReducer from "../Redux/User/user_Slice";
import dashboardReducer from "../Redux/dashboard/dashboard_slice";
import customersReducer from "../Redux/customers/customers_slice";
import transactionsReducer from "../Redux/Transactions/Transactions_slice";
import paymentsReducer from "../Redux/Payment/payment_slice";
import otpReducer from "../Redux/resetPassword/sendOtp_slice";
import reserPasswordReducer from "../Redux/resetPassword/resetPassword_slice";
import PaymentsStateReducer from "../Redux/Payment/paymentById_Slice";
import paymentListReducer from "../Redux/Payment/fetchPaymentListById_slice";
import updatePaymentReducer from "../Redux/Payment/updatePaymentStatus";
import PropertiesState from "../Redux/Properties/propertiesTable_slice";
import addpropertyReducer from "../Redux/addProperty/addProperty_slice";
import updatepropertyReducer from "../Redux/addProperty/UpdateProperties/update_slice";
import DeletePropertyReducer from "./addProperty/UpdateProperties/delete_slice";
import getpersonelReducer from "./personnel/personnel_slice";
import directorsReducer from "./directors/directors_slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    dashboardData: dashboardReducer,
    customers: customersReducer,
    transactions: transactionsReducer,
    payments: paymentsReducer,
    sendOtp: otpReducer,
    reserPassword: reserPasswordReducer,
    paymentsById: PaymentsStateReducer,
    paymentList: paymentListReducer,
    updatePayment: updatePaymentReducer,
    properties: PropertiesState,
    addproperty: addpropertyReducer,
    updateproperty: updatepropertyReducer,
    DeleteProperty: DeletePropertyReducer,
    getpersonnel: getpersonelReducer,
    directors: directorsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
