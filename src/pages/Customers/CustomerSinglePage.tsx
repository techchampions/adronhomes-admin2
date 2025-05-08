import React, { useState } from "react";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import ProfileCard from "../../general/ProfileCard";
import TableCard from "../../general/TableCard";

export default function CustomerSinglePage() {
  const plans = [
    {
      id: 1,
      name: "Treasure Treasure Parks and Gardens",
      location: "Ejigbo Wuse, Lagos",
      price: "₦56,000,000",
      amountPaid: "₦26,000,000",
      amountLeft: "₦30,000,000",
      duration: "12 Months",
      dueDate: "32/09/2025",
      image: "/loactionimage.svg",
    },
    {
      id: 2,
      name: "Luxury Waterfront Villas",
      location: "Victoria Island, Lagos",
      price: "₦120,000,000",
      amountPaid: "₦60,000,000",
      amountLeft: "₦60,000,000",
      duration: "24 Months",
      dueDate: "15/12/2026",
      image: "/loactionimage.svg",
    },
  ];

  // Define your columns configuration
  const columns = [
    {
      key: "property",
      title: "Property",
      width: 220,
      render: (_: any, row: any) => (
        <div className="flex items-center w-full">
          <img
            src={row.image}
            alt={row.name}
            className="w-10 h-10 rounded-lg object-cover mr-3 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="font-medium text-dark truncate w-full">
              {row.name}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <img src="/location.svg" className="mr-1" />
              <span className="truncate">{row.location}</span>
            </div>
          </div>
        </div>
      ),
    },
    { key: "price", title: "Price", width: 150 },
    { key: "amountPaid", title: "Amount Paid", width: 150 },
    { key: "amountLeft", title: "Amount Left", width: 150 },
    { key: "duration", title: "Duration", width: 120 },
    { key: "dueDate", title: "Due Date", width: 120 },
  ];
  return (
    <div className="lg:pl-[38px]  lg:pr-[68px]  pl-[15px] pr-[15px] space-y-[30px] pb-[52px]">
      <Header
        history={true}
        title="Customers"
        subtitle="Manage the list of registered customers"
      />
      <div className="grid md:grid-cols-3 gap-[20px]  ">
        <MatrixCardGreen
          currency={true}
          title="Total Amount Paid"
          value="10,000,000,000"
          change="Includes total amount paid by this customer"
        />
        <MatrixCard
          currency={true}
          title="Total Pending Payments"
          value="105,000,000"
          change="Includes total pending payments of this customer"
        />
        <MatrixCard
          title="Total Active Properties"
          value="1"
          change="Includes all active property plans of this customer"
        />
      </div>

      <ProfileCard
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
      />
      <TableCard
        title="Active Plans"
        data={plans}
        columns={columns}
        viewAllText="View All"
        rowKey="id"
        className=""
      />
      <TableCard
        title="Properties"
        data={plans2}
        columns={columns2}
        viewAllText="View All"
        rowKey="id"
        className=""
      />
     
    </div>
  );
}

const plans2 = [
  {
    id: 1,

    name: "Treasure Treasure Parks and Gardens",
    location: "Ejigbo Wuse, Lagos",
    image: "/loactionimage.svg",
    price: "₦56,000,000",
    amountPaid: "₦26,000,000",
    Duration: "12 Months",
    StartDate: "01/10/2024",
    FinalPayment: "30/09/2025",
  },
  {
    id: 2,

    name: "Luxury Waterfront Villas",
    location: "Victoria Island, Lagos",
    image: "/loactionimage.svg",
    price: "₦120,000,000",
    amountPaid: "₦60,000,000",
    Duration: "24 Months",
    StartDate: "15/12/2024",
    FinalPayment: "14/12/2026",
  },
];

const columns2 = [
  {
    key: "property",
    title: "Property",
    width: 220,
    render: (_: any, row: any) => (
      <div className="flex items-center w-full">
        <img
          src={row.image}
          alt={row.name}
          className="w-10 h-10 rounded-lg object-cover mr-3 flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="font-medium text-dark truncate w-full">
            {row.name}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <img src="/location.svg" className="mr-1" />
            <span className="truncate">{row.location}</span>
          </div>
        </div>
      </div>
    ),
  },
  { key: "price", title: "Price", width: 150 },
  { key: "amountPaid", title: "Amount Paid", width: 150 },
  { key: "Duration", title: "Duration", width: 150 },
  { key: "StartDate", title: "Start Date", width: 120 },
  { key: "FinalPayment", title: "Final Payment", width: 120 },
];
