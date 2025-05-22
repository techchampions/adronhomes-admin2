// store.ts
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../Redux/Login/login_slice';
import userReducer from '../Redux/User/user_Slice';
import dashboardReducer from '../Redux/dashboard/dashboard_slice'
import customersReducer from '../Redux/customers/customers_slice'
import transactionsReducer from '../Redux/Transactions/Transactions_slice'
import paymentsReducer from '../Redux/Payment/payment_slice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    user:userReducer,
    dashboardData:dashboardReducer,
    customers:customersReducer,
    transactions:transactionsReducer,
    payments:paymentsReducer
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