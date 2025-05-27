import React, { useState } from "react";
import Header from "../../general/Header";
import PaymentCard from "./paymentconfirmcard";
import ProfileCard from "../../general/SmallProfileCard";
import InvoiceCard from "../../general/InvoiceCard";
import PaymentListComponent from "../Customers/PaymentStatus";

export default function paymentById() {
  const [isPaymentListOpen, setIsPaymentListOpen] = useState(false); 

  return (
    <div className="pb-[236px] relative">
      <Header
        title="Payments"
        subtitle="Manage the list of payments made by customers"
        history={true}
      />
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] space-y-[40px]">
        <PaymentCard 
        handleHistory={()=>setIsPaymentListOpen(true)}/>

        <div>
          <p className="text-[20px] font-[325] text-dark mb-[20px]">
            Payment Plan
          </p>
          <InvoiceCard
            invoiceAmount="₦56,000,000"
            paidAmount="₦36,000,000"
            paymentSchedule="Weekly"
            progressPercentage={60}
            duration="6 Months"
            nextPaymentDate="15/09/2025"
            dueDate="5/09/2025"
            property={{
              name: "Treasure Parks and Gardens",
              address: "34, Shimawa, Ogun State, Nigeria",
              image: "/land.svg",
              size: "648 Sq M",
              hasStreetLights: true,
              hasGym: true,
              type: "Land",
            }}
          />
        </div>
        <div>
          <p className="text-[20px] font-[325] text-dark mb-[20px]">Customer</p>
          <ProfileCard
            imageUrl="/profile.svg"
            name="Ahmed Musa"
            dateJoined="12th May 2025"
            className="custom-class-if-needed"
          />
        </div>
      </div>
     {isPaymentListOpen && (
        <PaymentListComponent onClose={() => setIsPaymentListOpen(false)} />
      )}
    </div>
  );
}
