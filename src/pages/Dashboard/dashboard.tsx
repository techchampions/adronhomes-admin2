import {
  RevenueCard,
  RevenueWhiteCard,
  StatsCard,
} from "../../components/firstcard";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "../../components/Redux/User/user_Thunk";
import { getDashboardData } from "../../components/Redux/dashboard/dashboard_thunk";
import DashboardHeader from "../../general/DashboardHearder";
import { capitalize } from "../../utils/formatname";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getDashboardData());
  }, [dispatch]);

  const {
    loading: userLoading,
    error: userError,
    user,
  } = useSelector((state: RootState) => state.user);

  const {
    loading: dashLoading,
    error: dashError,
    data: dashdata,
  } = useSelector((state: RootState) => state.dashboardData);

  // Safe property stats with default values
  const propstats = [
    {
      value: dashdata?.properties?.total || 0,
      label: "Live Properties",
    },
    {
      value: dashdata?.properties?.sold || 0,
      label: "Sold",
    },
    {
      value: dashdata?.plans?.active || 0,
      label: "Active Plans",
    },
  ];

  const Customerstats = [
    {
      value: dashdata?.customers.total || 0,
      label: "Registered Customers",
    },
    {
      value: dashdata?.customers.active || 0,
      label: "Active Customers",
    },
    {
      value: dashdata?.plans?.active || 0,
      label: "Active Plans",
    },
  ];

  const Transactionstat = [
    {
      value: dashdata?.transactions.total_orders || 0,
      label: "Total Transactions",
    },
    {
      value: dashdata?.transactions.approved_orders || 0,
      label: "Approved",
    },
    {
      value: dashdata?.transactions.pending_orders || 0,
      label: "Pending",
    },
  ];
  const PaymentsStat = [
    {
      value: dashdata?.payments.total_count || 0,
      label: "Total Payments",
    },
    {
      value: dashdata?.payments.approved_count || 0,
      label: "Approved",
    },
    {
      value: dashdata?.payments.pending_count || 0,
      label: "Pending",
    },
  ];

  if (userLoading || dashLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (userError || dashError) {
    return <div>Error loading dashboard data</div>;
  }

  return (
    <div className="pb-[390px] overflow-x-hidden">
      <DashboardHeader
        title={`${capitalize(user?.first_name )|| "N/A"} ${capitalize(user?.last_name) || "N/A"}`}
      />
      <div className="space-y-[20px]">
        <div className="grid lg:grid-cols-2 gap-[22px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <StatsCard stats={propstats} />
          <StatsCard stats={Customerstats} tag="Customers" />
        </div>

        <div className="grid lg:grid-cols-2 gap-[22px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <StatsCard stats={Transactionstat} tag="Transactions" />
          <StatsCard stats={PaymentsStat} tag="Payments" />
        </div>
        <div className="grid lg:grid-cols-3 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mt-[2px]">
          <RevenueCard
       value2 ={`${dashdata?.revenue.percentage}%`}
           />
          <RevenueWhiteCard
       tag="Total Payments Made"
            amount={dashdata?.payments?.pending_amount?.toLocaleString() || "0"}
            currency="₦"
            note="Includes all property plans"
          />
          <RevenueWhiteCard
            tag="Pending Payments"
            amount={dashdata?.payments?.pending_amount?.toLocaleString() || "0"}
            currency="₦"
            note="from last 6 months"
          />
        </div>
      </div>
      <div className="lg:pr-[68px] pl-[15px] pr-[15px] mt-[2px] lg:pl-[38px]"></div>
    </div>
  );
}
