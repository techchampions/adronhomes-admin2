import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { ReusableTable } from "../../components/Tables/Table_one";
import PaymentTableComponent from "./PaymentTableComponent";
import {
  selectPaymentStats,
  selectUserPaymentsLoading,
  selectUserPaymentsError,
} from "../../components/Redux/Properties/payment/paymentbyuser_slice";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import Header from "../../general/Header";
import LoadingAnimations from "../../components/LoadingAnimations";
import { fetchUserPayments } from "../../components/Redux/Properties/payment/paymentbyuser_thunk";
import { useParams } from "react-router-dom";
import { selectCustomerUsername } from "../../components/Redux/customers/customerByid";



export default function UserPaymentsPage({

}) {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const paymentStats = useSelector(selectPaymentStats);
  const loading = useSelector(selectUserPaymentsLoading);
  const error = useSelector(selectUserPaymentsError);

  const tabs = ["Payment History"];
  const [activeTab] = React.useState(tabs[0]);
const userId=(id)
  useEffect(() => {
    if (userId) {
      dispatch(
        fetchUserPayments({
          userId: userId,
          page: 1,
        })
      );
    }
  }, [dispatch, userId]);

  // const formattedUserName = userName || `User ${userId}`;

  const stats = paymentStats || {
    total: 0,
    approved: 0,
    pending: 0,
    amount_total: 0,
    amount_approved: 0,
    amount_pending: 0,
  };
  const userNmae = useSelector(selectCustomerUsername);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={userNmae}
        subtitle="  property payments history"
        showSearchAndButton={false}
        history={true}
      />

      {/* Stats Cards */}
      <div className="grid lg:grid-cols-4 gap-[10px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-6">
        <MatrixCardGreen title="Total Payments" value={stats.total.toString()} change="All payment transactions" />
        <MatrixCard title="Approved Payments" value={stats.approved.toString()} change="Successfully processed" />
        <MatrixCard title="Pending Payments" value={stats.pending.toString()} change="Awaiting confirmation" />
        <MatrixCard title="Total Amount" value={`₦${stats.amount_total.toLocaleString()}`} change="Sum of all payments" />
      </div>

      <div className="grid lg:grid-cols-3 gap-[10px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-8">
        <MatrixCard title="Approved Amount" value={`₦${stats.amount_approved.toLocaleString()}`} change="Total approved value" />
        <MatrixCard title="Pending Amount" value={`₦${stats.amount_pending.toLocaleString()}`} change="Total pending value" />
        <MatrixCard
          title="Success Rate"
          value={`${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%`}
          change="Approval rate"
        />
      </div>

      {/* Table */}
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable searchPlaceholder="Search payments..." tabs={tabs} activeTab={activeTab} showTabs={false}>
          {loading && !paymentStats ? (
            <div className="flex justify-center items-center py-16">
              <LoadingAnimations loading={loading} />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 font-medium mb-4">Error: {error}</p>
              
            </div>
          ) : (
            <PaymentTableComponent userId={userId} />
          )}
        </ReusableTable>
      </div>
    </div>
  );
}