
import DashboardHearder from "../../general/DashboardHearder";
import {
  RevenueCard,
  RevenueWhiteCard,
  StatsCard,
} from "../../components/firstcard";

import VirtualTourUpload from "../../general/VirtualTourUpload";

export default function Dashboard() {


  return (
    <div className="pb-[390px]  overflow-x-hidden">

      <DashboardHearder title="Mike Wellington " />
      <div className="space-y-[20px]">
        <div className="grid lg:grid-cols-2 gap-[22px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <StatsCard />
          <StatsCard />
        </div>

        <div className="grid lg:grid-cols-2 gap-[22px]  lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <StatsCard />
          <StatsCard />
        </div>

        <div className="grid lg:grid-cols-3 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mt-[2px]">
          <RevenueCard />
          <RevenueWhiteCard />
          <RevenueWhiteCard
            tag="Pending Payments"
            amount="57,600,000"
            currency="₦"
            note="from last 6 months"
          />
        </div>
      </div>
      <div className=" lg:pr-[68px] pl-[15px] pr-[15px] mt-[2px] lg:pl-[38px] "></div>
    </div>
  );
}


{/* <ProfileCard
  profileImage="/profile.svg"
  name="Ahmed Musa"
  dateJoined="12th May 2025"
  email="Ahmedmusa@yahoo.com"
  phone="08076543267"
  stats={{
    viewedProperties: 21,
    savedProperties: 9,
    ownedProperties: 2,
  }}
  paymentInfo={{
    amount: "₦17,600,000",
    date: "13/04/2025",
  }}
  marketerName="James May"
  buttonTexts={{
    sendMessage: "Send Message",
    removeClient: "Remove Client",
  }}
/> */}