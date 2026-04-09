import React, { useEffect, useState } from "react";
import { GreenCardMarketer, MatrixCard, ClickTrackingCard } from "../../components/firstcard";
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
import PendingPlans from "./pendingPlans"; // Create this component

export default function MarketersDashboard() {
  const tabs = ["Pending Plans", "Active Plans", "Completed Plans", "Upcoming Payments"]; 
  const [activeTab, setActiveTab] = useState("Pending Plans");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { data, error, loading } = useSelector((state: RootState) => state.marketerdashboard);

  // Get click tracking data from Redux state
  const clickTracking = useSelector((state: RootState) => state.marketerdashboard.clickTracking);

  useEffect(() => {
    dispatch(fetchMarketerDashboard({ currentpage: 1 }));
  }, [dispatch]);

  // Function to prepare data for Pending Plans Table
  const getPendingPlansData = (): any[] => {
    if (!data?.pending_property_plans?.data) return [];
    return data.pending_property_plans.data.map((item) => ({
      name: item.user ? `${item.user.first_name} ${item.user.last_name}` : "N/A",
      StartDate: item.start_date,
      EndDate: item.end_date,
      totalAmount: item.total_amount,
      paid_amount: item.paid_amount,
      remaining_balance: item.remaining_balance,
      payment_percentage: item.payment_percentage,
      plan_id: item.id,
      user_id: item.user_id,
      phoneNumber: item.user?.phone_number || "N/A",
      unique_customer_id: item.user?.unique_customer_id || "N/A",
      status: item.status,
      next_payment_date: item.next_payment_date
    }));
  };

  // Function to prepare data for Active Plans Table
  const getActivePlansData = (): any[] => {
    if (!data?.active_property_plans?.data) return [];
    return data.active_property_plans.data.map((item) => ({
      name: item.user ? `${item.user.first_name} ${item.user.last_name}` : "N/A",
      StartDate: item.start_date,
      EndDate: item.end_date,
      nextPayment: item.next_payment_date,
      paid_amount: item.paid_amount,
      nextPaymentAmount: item.next_repayment_data?.amount || 0,
      plan_id: item.id,
      user_id: item.user_id,
      total_amount: item.total_amount,
      remaining_balance: item.remaining_balance,
      unique_customer_id: item.user?.unique_customer_id || "N/A"
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
      unique_customer_id: item.user?.unique_customer_id || "N/A"
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
      user_id: item.property_plan.user_id,
      plan_id: item.plan_id,
      total_amount: item.property_plan.total_amount,
      remaining_balance: item.property_plan.remaining_balance,
      unique_customer_id: item.property_plan.user?.unique_customer_id || "N/A"
    }));
  };

  const pendingPlans = getPendingPlansData();
  const activePlans = getActivePlansData();
  const completedPlans = getCompletedPlansData(); 
  const upcomingPayments = getUpcomingdata();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Check if data arrays are empty
  const isPendingPlansEmpty = pendingPlans.length === 0;
  const isActivePlansEmpty = activePlans.length === 0;
  const isCompletedPlansEmpty = completedPlans.length === 0; 
  const isUpcomingEmpty = upcomingPayments.length === 0;

  // Generic filter function that searches through all object values
  const filterData = (data: any[], searchTerm: string) => {
    if (!searchTerm) return data;
    
    const searchLower = searchTerm.toLowerCase();
    return data.filter((item) => {
      return Object.values(item).some((value) => {
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchLower);
      });
    });
  };

  const filteredPendingPlans = filterData(pendingPlans, searchTerm);
  const filteredActivePlans = filterData(activePlans, searchTerm);
  const filteredCompletedPlans = filterData(completedPlans, searchTerm);
  const filteredUpcomingPayments = filterData(upcomingPayments, searchTerm);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  return (
    <div className="mb-[52px] relative">
      <Header
        copyCode={data?.marketer?.referral_code}
        role={data?.marketer?.referral_code} 
        Name={`${data?.marketer?.first_name || ''} ${data?.marketer?.last_name || ''}`}
      
      />

      <div className="space-y-[6px]">
        {/* First Row - Original Cards */}
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
    <div className="pt-4">
          <ClickTrackingCard
            title="Link Performance"
            todayClicks={clickTracking.total_clicks_today}
            weekClicks={clickTracking.total_clicks_this_week}
            monthClicks={clickTracking.total_clicks_month}
            totalClicks={clickTracking.total_clicks}
            change="Total link clicks across all your shared campaigns"
          />
      
        </div>
        <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mt-[26px]">
          <ReusableTable
            tabs={tabs}
            searchPlaceholder="Search Customer"
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSearch={handleSearch}
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
            ) : activeTab === "Pending Plans" ? (
              isPendingPlansEmpty ? (
                <div className="max-h-screen">
                  <p className="text-center font-normal text-[#767676]">
                    No pending plans found
                  </p>
                  <NotFound />
                </div>
              ) : (
                <PendingPlans customerData={filteredPendingPlans} />
              )
            ) : activeTab === "Active Plans" ? (
              isActivePlansEmpty ? (
                <div className="max-h-screen">
                  <p className="text-center font-normal text-[#767676]">
                    No active plans found
                  </p>
                  <NotFound />
                </div>
              ) : (
                <CustomersTableAllActive customerData={filteredActivePlans} />
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
                <CompletedPlans customerData={filteredCompletedPlans} />
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
                <Upcomingdata customerData={filteredUpcomingPayments} />
              )
            ) : null}
          </ReusableTable>

          {showModal && <ReferralModal onClose={() => setShowModal(false)} />}
        </div>
      </div>
    </div>
  );
}