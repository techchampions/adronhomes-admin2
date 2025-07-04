import React, { useEffect, useState } from "react";
import { GreenCardMarketer, MatrixCard } from "../../components/firstcard";
import { ReusableTable } from "../../components/Tables/Table_one";
import CustomersTableAll from "./allcustomersTable"; 
import CustomersTableAllActive from "./activePlans";
import Header from "../Header/Hearder";
import ReferralModal from "../referalModal/referralModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { fetchMarketerDashboard } from "../../components/Redux/Marketer/Dashboard_thunk";
import NotFound from "../../components/NotFound";
import LoadingAnimations from "../../components/LoadingAnimations";
import Upcomingdata from "./Upcomingdata ";
import CompletedPlans from "./completedTable";

export default function MarketersDashboard() {
  const tabs = [ "Active Plans", "Completed Plans", "Upcoming Payments"]; 
  const [activeTab, setActiveTab] = useState("Active Plans");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { data, error, loading } = useSelector((state: RootState) => state.marketerdashboard);

  useEffect(() => {
    dispatch(fetchMarketerDashboard({ currentpage: 1 }));
  }, [dispatch]);

  // Function to prepare data for Active Plans Table
  const getActivePlansData = (): any[] => {
    if (!data?.active_property_plans?.data) return [];
    return data.active_property_plans.data.map((item) => ({
      name: item.user ? `${item.user.first_name} ${item.user.last_name}` : "N/A",
      StartDate: item.start_date,
      EndDate: item.end_date,
      // nextPayment: item.next_payment_date,
      paid_amount: item.paid_amount,
      nextPaymentAmount: item.next_repayment_amount || 0,
      plan_id: item.id,
      user_id: item.user_id,
      total_amount: item.total_amount,
      remaining_balance: item.remaining_balance,
    }));
  };

  // Function to prepare data for Completed Plans Table
  const getCompletedPlansData = (): any[] => {
    if (!data?.completed_property_plans?.data) return [];
    return data.completed_property_plans.data.map((item) => ({
      name: item.user ? `${item.user.first_name} ${item.user.last_name}` : "N/A",
      StartDate: item.start_date,
      EndDate: item.start_date,
      paymentCompletedAt: item.payment_completed_at, 
      totalAmount: item.total_amount,
      paid_amount: item.paid_amount,
      phoneNumber: item.user?.phone_number || "N/A",
      plan_id: item.id,
      user_id: item.user_id,
    }));
  };

  // Function to prepare data for Upcoming Payments Table
  const getUpcomingdata = (): any[] => {
    if (!data?.upcoming_payment_customers?.data) return [];
    return data.upcoming_payment_customers.data.map((item) => ({
      name: item.property_plan.user 
        ? `${item.property_plan.user.first_name} ${item.property_plan.user.last_name}` 
        : "N/A",
      StartDate: item.created_at,
      nextPayment: item.due_date,
      paid_amount: item.amount,
      // phoneNumber: item.property_plan.user?.phone_number || "N/A",
      user_id: item.property_plan.user_id,
      plan_id: item.plan_id,
      total_amount: item.property_plan.total_amount,
      remaining_balance: item.property_plan.remaining_balance,
    }));
  };

  const activePlans = getActivePlansData();
  const completedPlans = getCompletedPlansData(); 
  const upcomingPayments = getUpcomingdata();

  // Check if data arrays are empty
  const isActivePlansEmpty = activePlans.length === 0;
  const isCompletedPlansEmpty = completedPlans.length === 0; 
  const isUpcomingEmpty = upcomingPayments.length === 0;

  return (
    <div className="mb-[52px]">
      <Header
        copyCode={data?.marketer?.referral_code}
        role={data?.marketer?.referral_code} 
        Name={`${data?.marketer?.first_name || ''} ${data?.marketer?.last_name || ''}`}
      />
      <div className="space-y-[30px]">
        <div className="grid lg:grid-cols-4 gap-[10px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <GreenCardMarketer
            currency={true}
            value={data?.total_paid_amount?.toLocaleString() || "0"}
            change="Includes all total referred amount for this month"
            title="Total Amount for this month"
            handleClickView={() => setShowModal(true)}
          />
          <MatrixCard
            title="Total Completed Property Plan"
            value={data?.total_completed_property_plans?.toString() || "0"}
            change="Includes all customers on a property plan"
          />
          <MatrixCard
            title="Active Plans"
            value={data?.total_active_property_plans?.toString() || "0"} 
            change="All customers on a property plan"
          />
          <MatrixCard
            title="Upcoming Payments"
            value={data?.upcoming_payment_count?.toString() || "0"}
            change="Customers with upcoming payments"
          />
        </div>

        <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] max-w-7xl pr-[15px] mt-[26px]">
          <ReusableTable
            tabs={tabs}
            searchPlaceholder="Search Customer"
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {loading ? (
              <div className="w-full flex items-center justify-center">
                <LoadingAnimations loading={loading} />
              </div>
            ) : error ? (
              <div className="max-h-screen">
                <p className="text-center font-normal text-red-500">
                  Error: {error}
                </p>
                <NotFound /> 
              </div>
            ) : activeTab === "Active Plans" ? (
              isActivePlansEmpty ? (
                <div className="max-h-screen">
                  <p className="text-center font-normal text-[#767676]">
                    No active plans found
                  </p>
                  <NotFound />
                </div>
              ) : (
                <CustomersTableAllActive customerData={activePlans} />
              )
            ) : activeTab === "Completed Plans" ? (
              isCompletedPlansEmpty ? (
                <div className="max-h-screen">
                  <p className="text-center font-normal text-[#767676]">
                    No completed plans found
                  </p>
                  <NotFound />
                </div>
              ) : (
                <CompletedPlans customerData={completedPlans} />
              )
            ) : activeTab === "Upcoming Payments" ? (
              isUpcomingEmpty ? (
                <div className="max-h-screen">
                  <p className="text-center font-normal text-[#767676]">
                    No upcoming payments found
                  </p>
                  <NotFound />
                </div>
              ) : (
                <Upcomingdata customerData={upcomingPayments} />
              )
            ) : null}
          </ReusableTable>

          {showModal && <ReferralModal onClose={() => setShowModal(false)} />}
        </div>
      </div>
    </div>
  );
}