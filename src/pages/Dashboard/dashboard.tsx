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
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import Header from "../../general/Header";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const {
    loading: dashLoading,
    error: dashError,
    data: dashdata,
  } = useSelector((state: RootState) => state.dashboardData);

  // Safe property stats with default values
  const propstats = [
    {
      value: dashdata?.properties?.total || 0,
      label: "Total Properties",
    },
    {
      value: dashdata?.properties?.sold || 0,
      label: "Sold",
    },
    {
      value: dashdata?.properties?.publish || 0,
      label: "Published Properties",
    },
  ];

  const Customerstats = [
    {
      value: dashdata?.customers.total || 0,
      label: "Registered Customers",
    },
    {
      value: dashdata?.contracts.completed || 0,
      label: "Completed Contracts",
    },
    {
      value: dashdata?.contracts.active || 0,
      label: "Active Contracts",
    },
  ];

  const VisitStats = [
    {
      value: dashdata?.visit?.total || "0",
      label: "Total",
    },
    {
      value: dashdata?.visit?.today || 0,
      label: "Today",
    },
    {
      value: dashdata?.visit?.this_month || "0",
      label: "This Month",
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
  const basePath = location.pathname.startsWith(
    "/payments/dashboard"
  );
  const basePath2 = location.pathname.startsWith(
    "/dashboard"
  );

  if (userError || dashError) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <div className="text-center">
          <p className="font-normal text-[#767676]">No data found</p>
          <NotFound />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-[390px] overflow-x-hidden ">
      {userLoading || dashLoading ? (
        <div className="flex justify-center items-center h-screen">
          {" "}
          <LoadingAnimations loading={userLoading || dashLoading} />
        </div>
      ) : (
        <>
          {basePath2 && <DashboardHeader
            title={`${capitalize(user?.first_name) || "N/A"} ${capitalize(user?.last_name) || "N/A"}`} />}
          {basePath && <Header
            showSearchAndButton={false}
            title="Payment Admin"
            subtitle="Manage the list of payments made by customers" />}
          <div className="space-y-[20px]">
            <div className="grid lg:grid-cols-2 gap-[22px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
              <StatsCard stats={propstats} />
              <StatsCard stats={Customerstats} tag="Customers" />
            </div>

            <div className="grid lg:grid-cols-2 gap-[22px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
              <StatsCard stats={VisitStats} tag="Website Visits" />
              <StatsCard stats={PaymentsStat} tag="Payments" />
            </div>
            <div className="grid lg:grid-cols-3 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mt-[2px]">
              <RevenueWhiteCard
                tag="Monthly Payments "
                amount={
                  dashdata?.payments?.total_amount_this_month?.toLocaleString() ||
                  "0"
                }
                currency="₦"
                note="Includes all Payments for the Month"
              />
              <RevenueWhiteCard
                tag="Total Payments Made"
                amount={
                  dashdata?.payments?.total_amount?.toLocaleString() || "0"
                }
                currency="₦"
                note="Includes all property plans"
              />
              <RevenueWhiteCard
                tag="Pending Payments"
                amount={
                  dashdata?.payments?.pending_amount?.toLocaleString() || "0"
                }
                currency="₦"
                note="from last 6 months"
              />
            </div>
          </div>
        </>
      )}
      <div className="lg:pr-[68px] pl-[15px] pr-[15px] mt-[2px] lg:pl-[38px]"></div>
    </div>
  );
}