import React, { useEffect, useState } from "react";
import {
  GreenCardMarketer,
  MatrixCard,
} from "../../components/firstcard";
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

export default function MarketersDashboard() {
  const tabs = ["Registered Customers", "Active Plans"];
  const [activeTab, setActiveTab] = useState("Registered Customers");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { data, error, loading } = useSelector(
    (state: RootState) => state.marketerdashboard
  );

  useEffect(() => {
    dispatch(fetchMarketerDashboard({ currentpage: 1 }));
  }, [dispatch]);

  const getActivePlansData = (): any[] => {
    if (!data?.active_plan?.data) return [];
    return data.active_plan.data.map((item) => ({
      name: item ? `${item.user.first_name} ${item.user.last_name}` : "N/A",
      dateJoined: item.created_at,
      nextPayment: item.next_payment_date,
      paid_amount: item.paid_amount,
      phoneNumber: item.user.phone_number,
      plan_id:item.user_id,
      user_id:item.id
    }));
  };

  const getReferredUsersData = (): any[] => {
    if (!data?.referred_users?.data) return [];
    return data.referred_users.data.map((item) => ({
      name: item ? `${item.first_name} ${item.last_name}` : "N/A",
      dateJoined: item.created_at,
      propertyPlans: item.property_plan_total,
      savedProperties: item.saved_property_total,
      phoneNumber: item.phone_number,
    }));
  };

  const referredUsers = getReferredUsersData();
  const activePlans = getActivePlansData();
  const isReferredEmpty = referredUsers.length === 0;
  const isActiveEmpty = activePlans.length === 0;

  return (
    <div className="mb-[52px]">
      <Header
        copyCode={data?.marketer?.referral_code}
        role={data?.marketer?.referral_code}
        Name={`${data?.marketer?.first_name} ${data?.marketer?.last_name}`}
      />

      <div className="space-y-[30px]">
        <div className="grid lg:grid-cols-4 gap-[10px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <GreenCardMarketer
            currency={true}
            value={data?.total_amount?.toLocaleString() || "0"}
            change="Includes all total referred amount for this month"
            title="Total Amount for this month"
            handleClickView={() => setShowModal(true)}
          />
          <MatrixCard
            title="Referred Customers"
            value={data?.total_referred_users?.toString() || "0"}
            change="Includes all customers on a property plan"
          />
          <MatrixCard
            title="Active Plans"
            value={data?.total_property_plans?.toString() || "0"}
            change="All customers on a property plan"
          />
          <MatrixCard
            title="Upcoming Payments this week"
            value={data?.expected_payment_count?.toString() || "0"}
            change="Customers with upcoming payments"
          />
        </div>

        <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
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
            ) : activeTab === "Registered Customers" ? (
              isReferredEmpty ? (
                <div className="max-h-screen">
                  <p className="text-center font-normal text-[#767676]">
                    No registered customers found
                  </p>
                  <NotFound />
                </div>
              ) : (
                <CustomersTableAll currentItems={referredUsers} />
              )
            ) : isActiveEmpty ? (
              <div className="max-h-screen">
                <p className="text-center font-normal text-[#767676]">
                  No active plans found
                </p>
                <NotFound />
              </div>
            ) : (
              <CustomersTableAllActive customerData={activePlans} />
            )}
          </ReusableTable>

          {showModal && <ReferralModal onClose={() => setShowModal(false)} />}
        </div>
      </div>
    </div>
  );
}

