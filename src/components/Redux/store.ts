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
import CreatepersonnelReducer from "./personnel/createPersonell_slice";
import editPersonnelReducer from "./personnel/edithPersonelle";
import DeletePersonnelReducer from "./personnel/delete_slice";
import editPersonnelSliceReducer from "./personnel/edithPersonelle";
import marketerdashboardSlice from "./Marketer/Dashboard_slice";
import marketerMonthlyStatsReducer from "./Marketer/marketers_months_slice";
import marketerUserPropertyPlanReducer from "./Marketer/user_property_plan";
import propertyPlanPaymentsReducer from "./Marketer/PaymentList";
import customerByIdReducer from "./customers/customerByid";
import messageSliceReducer from "./customers/send_message";
import deleteUserSliceReducer from "./customers/delete_customers";
import careerDashboardReducer from "./Marketer/careerDashboardSlice";
import savedPropertyUserReducer from "./SavedPropertyUser_slice";
import careersReducer from "./carreer/career_slice";
import careerViewReducer from "./carreer/career_view_slice";
import jobDetailsReducer from "./carreer/job_details_slice";
import createJobReducer from "./carreer/create_job_slice";
import editJobReducer from "./carreer/edit_job_slice";
import deleteJobReducer from "./carreer/delete_job_slice";
import contractsReducer from './Contract/contracts_slice'

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
    Createpersonnel: CreatepersonnelReducer,
    Edithpersonel: editPersonnelReducer,
    DeletePersonnel: DeletePersonnelReducer,
    editPersonnelSlice: editPersonnelSliceReducer,
    marketerdashboard: marketerdashboardSlice,
    marketerMonthlyStats: marketerMonthlyStatsReducer,
    marketerUserPropertyPlan: marketerUserPropertyPlanReducer,
    propertyPlanPayments: propertyPlanPaymentsReducer,
    customerById: customerByIdReducer,
    messagingcustomer: messageSliceReducer,
    deleteUserSlice: deleteUserSliceReducer,
    careerDashboard: careerDashboardReducer,
    getcareers: careersReducer,
    getcareerview: careerViewReducer,
    getjobdetails: jobDetailsReducer,
    createjob: createJobReducer,
    editjob: editJobReducer,
    deletejob: deleteJobReducer,
    savedPropertyUser: savedPropertyUserReducer,
    getcontracts:contractsReducer
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
