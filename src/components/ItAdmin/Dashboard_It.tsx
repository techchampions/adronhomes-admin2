import React, { useEffect } from "react";
import { CardGreen, RevenueWhiteCard, StatsCard } from "../firstcard";
import DashboardHeader from "../../general/DashboardHearder";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { fetchITDashboard } from "../Redux/info-tech/itDashboardSlice";
import { useNavigate, useNavigation } from "react-router-dom";
import LoadingAnimations from "../LoadingAnimations";

// A simple capitalize function
const capitalize = (str: any) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function Dashboard_It() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    totalVisit,
    todayVisit,
    thisMonthVisit,
    totalActiveUser,
    totalLast30Min,
    totalViews,
    totalProperties,
    totalRequests,
    totalNotifications,
    loading,
    error,
  } = useSelector((state: RootState) => state.itDashboard);

  useEffect(() => {
    dispatch(fetchITDashboard());
  }, [dispatch]);

  const user = {
    first_name: "Mike",
    last_name: "Wellington",
  };

  // Use safe defaults for all values to prevent undefined errors
  const safeTotalVisit = totalVisit ?? 0;
  const safeTodayVisit = todayVisit ?? 0;
  const safeThisMonthVisit = thisMonthVisit ?? 0;
  const safeTotalActiveUser = totalActiveUser ?? 0;
  const safeTotalLast30Min = totalLast30Min ?? 0;
  const safeTotalViews = totalViews ?? 0;
  const safeTotalProperties = totalProperties ?? 0;
  const safeTotalRequests = totalRequests ?? 0;
  const safeTotalNotifications = totalNotifications ?? 0;

  const Transactionstat = [
    {
      value: safeTotalRequests,
      label: "Total Requests & Enquiries",
    },
  ];

  const PaymentsStat = [
    {
      value: safeTotalNotifications,
      label: "Total Notifications",
    },
  ];

  const WebsiteVisits = [
    {
      value: safeTotalVisit,
      label: "Total",
    },
    {
      value: safeTodayVisit,
      label: "Today",
    },
    {
      value: safeThisMonthVisit,
      label: "This Month",
    },
  ];

  const ActiveUsers = [
    {
      value: safeTotalActiveUser,
      label: "Total Active Users",
    },
    {
      value: safeTotalLast30Min,
      label: "Users last 30mins",
    },
    {
      value: safeTotalViews,
      label: "Total Views",
    },
  ];

  const Properties = [
    {
      value: safeTotalProperties,
      label: "Total Properties",
    },
  ];

  // Show loading state
  if (loading) {
    return (
      <div>
        <DashboardHeader
          subtitle={"IT Admin"}
          title={`${capitalize(user?.first_name) || "N/A"} ${
            capitalize(user?.last_name) || "N/A"
          }`}
        />
        <div className="flex justify-center items-center h-64">
        <LoadingAnimations loading={loading}/>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div>
        <DashboardHeader
          subtitle={"IT Admin"}
          title={`${capitalize(user?.first_name) || "N/A"} ${
            capitalize(user?.last_name) || "N/A"
          }`}
        />
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-[300px] ">
      <DashboardHeader
        subtitle={"IT Admin"}
        title={`${capitalize(user?.first_name) || "N/A"} ${
          capitalize(user?.last_name) || "N/A"
        }`}
      />

      <div className="grid lg:grid-cols-2 gap-[22px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[20px]">
        <StatsCard stats={WebsiteVisits} tag="Website Visits" />
        <StatsCard stats={ActiveUsers} tag="Active Users" />
      </div>

      <div className="grid lg:grid-cols-3 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mt-[2px] mb-[20px]">
        <RevenueWhiteCard
        currency=""
          tag="Requests & Enquiries"
          amount={Transactionstat[0].value}
          note={Transactionstat[0].label}
        />
        <RevenueWhiteCard
         currency=""
          tag="Notifications"
          amount={PaymentsStat[0].value}
          note={PaymentsStat[0].label}
        />
        <RevenueWhiteCard
         currency=""
          tag="Properties"
          amount={Properties[0].value}
          note={Properties[0].label}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mt-[2px]">
        <div onClick={() => navigate("/info-tech/settings/sliders")}>
          <CardGreen />
        </div>
        <div onClick={() => navigate("/info-tech/settings/page-headers")}>
          {" "}
          <CardGreen icon2="/iticon2.svg" tag="Headers" />
        </div>

        <div onClick={() => navigate("/info-tech/settings/site-information")}>
          {" "}
          <CardGreen icon2="/iticon3.svg" tag="Site Information" />
        </div>
      </div>

      <div className="lg:pr-[68px] pl-[15px] pr-[15px] mt-[2px] lg:pl-[38px]"></div>
    </div>
  );
}
