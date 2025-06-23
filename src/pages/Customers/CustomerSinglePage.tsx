import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import ProfileCard from "../../general/ProfileCard";
import TableCard from "../../general/TableCard";
import { fetchCustomerById } from "../../components/Redux/customers/customerByid";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { formatDate } from "../../utils/formatdate";
import { formatAsNaira } from "../../utils/formatcurrency";
import LoadingAnimations from "../../components/LoadingAnimations";

export default function CustomerSinglePage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.customerById
  );
    const { loading:messagingcustomerloading} = useSelector(
    (state: RootState) => state.messagingcustomer
  );


      const { loading:loadingdelete} = useSelector(
    (state: RootState) => state.deleteUserSlice
  );



  
  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerById(id));
    }
  }, [dispatch, id]);

  // Format active plans data for the table
  const activePlans =
    data?.active_plan.map((plan) => {
      const property = data.list_property.find(
        (p) => p.plan_id === plan.id
      )?.property;
      return {
        id: plan.id,
        name: property?.name || "Unknown Property",
        location: property
          ? `${property.street_address}, ${property.lga}, ${property.state}`
          : "Unknown Location",
        price: formatAsNaira(plan.total_amount),
        amountPaid: formatAsNaira(plan.paid_amount),
        amountLeft: formatAsNaira(plan.remaining_balance),
        duration: plan.monthly_duration
          ? `${plan.monthly_duration} Months`
          : "One-time",
        dueDate: plan.next_payment_date
          ? formatDate(plan.next_payment_date)
          : "N/A",
        image: property?.display_image || "/default-property.jpg",
        property,
        user_id: plan.id,
        plan_id: plan?.user_id,
      };
    }) || [];

  // Format properties data for the table
  const properties =
    data?.list_property.map((item) => {
      return {
        id: item.id,
        name: item.property.name,
        location: `${item.property.street_address}, ${item.property.lga}, ${item.property.state}`,
        image: item.property.display_image || "/default-property.jpg",
        price: formatAsNaira(item.property.price),
        amountPaid: formatAsNaira(item.property.initial_deposit),
        Duration: item.property.property_duration_limit
          ? `${item.property.property_duration_limit} Months`
          : "N/A",
        StartDate: item.created_at ? formatDate(item.created_at) : "N/A",
        FinalPayment: item.updated_at ? formatDate(item.updated_at) : "N/A",
        property: item.property,
      };
    }) || [];

  // Define your columns configuration for active plans
  const activePlansColumns = [
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

  // Define your columns configuration for properties
  const propertiesColumns = [
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

  if (loading) {
    return     <div className="flex items-center justify-center h-screen text-center "><LoadingAnimations loading={loading}/></div>;
  }

  if (error) {
    return (
    <div className="flex items-center justify-center h-screen text-center text-red-500">
  Error: {error.message}
</div>

    );
  }

  if (!data) {
    return <div className="text-center py-8">No customer data found</div>;
  }

  return (
    <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] space-y-[30px] pb-[52px]">
      <Header
        history={true}
        title="Customers"
        subtitle="Manage the list of registered customers"
      />

      <div className="grid md:grid-cols-3 gap-[20px]">
        <MatrixCardGreen
          // currency={true}
          title="Total Amount Paid"
          value={formatAsNaira(parseInt(data.total_paid))}
          change="Includes total amount paid by this customer"
        />
        <MatrixCard
          // currency={true}
          title="Total Pending Payments"
          value={formatAsNaira(parseInt(data.pending_paid))}
          change="Includes total pending payments of this customer"
        />
        <MatrixCard
          title="Total Active Properties"
          value={data.active_property.toString()}
          change="Includes all active property plans of this customer"
        />
      </div>

      <ProfileCard
        profileImage={data.customer.profile_picture || "/profile.svg"}
        name={`${data.customer.first_name} ${data.customer.last_name}`}
        dateJoined={formatDate(data.customer.created_at)}
        email={data.customer.email}
        phone={data.customer.phone_number}
        stats={{
          viewedProperties: data.viewed_property,
          savedProperties: data.saved_property,
          ownedProperties: data.owned_property,
        }}
        paymentInfo={{
          amount: formatAsNaira(data.total_paid),
          date: formatDate(data.customer.updated_at),
        }}
        marketerName={data.customer.referral_code || "Unknown Marketer"}
        buttonTexts={{
          sendMessage: "Send Message",
          removeClient: "Remove Client",
        }} userId={data.customer.id} userNmae={`${data.customer.first_name} ${data.customer.last_name}`} userImage={data.customer.profile_picture} loading={messagingcustomerloading} loadingdelete={loadingdelete}      />

      <TableCard
        title="Active Plans"
        data={activePlans}
        columns={activePlansColumns}
        viewAllText="View All"
        rowKey="id"
        className=""
      />

      <TableCard
        title="Properties"
        data={properties}
        columns={propertiesColumns}
        viewAllText="View All"
        rowKey="id"
        className=""
      />
    </div>
  );
}
