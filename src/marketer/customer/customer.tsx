import React, { useEffect } from "react";

import {
  GreenCardMarketer,
  MatrixCard,
  MatrixCardGreen,
} from "../../components/firstcard";
import { ReusableTable } from "../../components/Tables/Table_one";
import { useAppSelector } from "../../components/Redux/hook";
import { selectTotalActivePropertyPlans, selectTotalCompletedPropertyPlans, selectTotalReferredUsers, selectUpcomingPaymentCount } from "../../components/Redux/Marketer/careerDashboardSlice";
import Header from "../Header/Hearder";
import ReferredUsers from "./customerTable";
import UpcomingPayments from "./fullPaidTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { fetchMarketerDashboard } from "../../components/Redux/Marketer/Dashboard_thunk";

export default function MarketerCustomer() {
  const tabs = ["Referred Users","Upcoming Payments"];
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  const { data, error, loading } = useSelector((state: RootState) => state.marketerdashboard);
   const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMarketerDashboard({ currentpage: 1 }));
  }, [dispatch]);
  // Get data from Redux store
  const totalReferredUsers = useAppSelector(selectTotalReferredUsers);
  const totalActivePlans = useAppSelector(selectTotalActivePropertyPlans);
  const totalCompletedPlans = useAppSelector(selectTotalCompletedPropertyPlans);
  const upcomingPaymentCount = useAppSelector(selectUpcomingPaymentCount);

  return (
    <div>
    <Header
           copyCode={data?.marketer?.referral_code}
           role={data?.marketer?.referral_code} 
           Name={`${data?.marketer?.first_name || ''} ${data?.marketer?.last_name || ''}`}
           
         />

      <div className="grid lg:grid-cols-4 gap-[10px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <MatrixCardGreen 
          title="Referred Users"
          value={totalReferredUsers.toString()}
          change="Total customers referred by you"
        />
        <MatrixCard
         title="Total Active Contracts"
          value={totalActivePlans.toString()}
          change="includes all customers on  active Contracts"
        />
        <MatrixCard
          title="Fully Paid Plans"
          value={totalCompletedPlans.toString()}
          change="Customers who completed payments"
        />
        <MatrixCard
          title="Upcoming Payments"
          value={upcomingPaymentCount.toString()}
          change="Customers with upcoming payments"
        />
      </div>

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mt-[26px]">
        <ReusableTable
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        >
          {activeTab === "Upcoming Payments" && <UpcomingPayments />}
          {activeTab === "Referred Users" && <ReferredUsers />}
        </ReusableTable>
      </div>
    </div>
  );
}