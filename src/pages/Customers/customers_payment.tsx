import React, { useEffect, useState } from "react";
import ProfileCard from "../../general/SmallProfileCard";

import PaymentListCard from "../../general/PaymentListCard";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import Pagination from "../../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useParams } from "react-router-dom";
import {
  clearUserPropertyPlan,
  fetchUserPropertyPlan,
} from "../../components/Redux/Marketer/user_property_plan";
import PaymentModal, { PaymentStatus } from "../../pages/Customers/PaymentList";
import { fetchPropertyPlanPayments } from "../../components/Redux/Marketer/PaymentList";
import { PaymentCard } from "../../pages/Customers/PaymentTable";
import LoadingAnimations from "../../components/LoadingAnimations";
import InvoiceCard from "../../general/invioceCardTwo";

export default function MarketerInvoice() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentListOpen, setIsPaymentListOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { plan_id, user_id } = useParams<{ plan_id: string; user_id: string }>();

  // Get data from Redux store
  const {
    data: { planProperties, nextRepayment, transactions },
    loading,
    error,
  } = useSelector((state: RootState) => state.marketerUserPropertyPlan);

  const {
    data,
    loading: loadingpropertyPlanPayments,
    error: ErrorpropertyPlanPayments,
  } = useSelector((state: RootState) => state.propertyPlanPayments);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (plan_id && user_id) {
      dispatch(fetchUserPropertyPlan({ planId: plan_id, userId: user_id }));
    }

    return () => {
      dispatch(clearUserPropertyPlan());
    };
  }, [dispatch, plan_id, user_id]);

  useEffect(() => {
    
    if (planProperties?.id) {
      
      dispatch(fetchPropertyPlanPayments(planProperties?.id!));
    }
  }, [dispatch, planProperties?.id]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatTransactions = () => {
    if (!transactions) return [];

    return transactions.map((transaction) => ({
      
      title: transaction.description || "Property Payment",
      date: new Date(transaction.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      amount: `₦${transaction.amount?.toLocaleString() || "0"}`,
      status:
        transaction.status === 1
          ? "Completed"
          : transaction.status === 0
          ? "Pending"
          : "Failed",
      transactionData: {
        from:
          `${planProperties?.user?.first_name} ${planProperties?.user?.last_name}` ||
          "Customer",
        description: transaction.description || "Property Payment",
        type: "Property Investment",
        method: transaction.transaction_method || "Bank Transfer",
        fees: "0",
        reference: transaction.reference || "N/A",
        status:
          transaction.status === 1
            ? "Completed"
            : transaction.status === 0
            ? "Pending"
            : "Failed",
        bankIcon: "/bank-icon.svg",
        property: {
          name: transaction.property?.name || planProperties?.property?.name || "Property",
          price: transaction.property?.price || planProperties?.property?.price || 0,
          size: transaction.property?.size || planProperties?.property?.size || "N/A",
          image: transaction.property?.display_image || planProperties?.property?.display_image || "/land.svg",
          address:
            `${transaction.property?.lga || planProperties?.property?.lga}, ${
              transaction.property?.state || planProperties?.property?.state
            }` || "N/A",
        },
        user: {
          name:
            `${planProperties?.user?.first_name} ${planProperties?.user?.last_name}` ||
            "Customer",
          email: planProperties?.user?.email || "N/A",
          phone: planProperties?.user?.phone_number || "N/A",
        },
      },
    }));
  };

  // Calculate pagination
  const paginatedPayments = formatTransactions().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pagination = {
    currentPage,
    totalPages: Math.ceil(formatTransactions().length / itemsPerPage),
    itemsPerPage,
    totalItems: formatTransactions().length,
  };

  const tabs = ["All", "Completed", "Pending", "Failed"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-center ">
        <LoadingAnimations loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-center text-red-500">
        Error: {error}
      </div>
    );
  }
  if (!planProperties)
    return (
      <div className="flex items-center justify-center h-screen text-center ">
        No data found
      </div>
    );

  return (
    <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] space-y-[30px] pb-[52px]">
      <Header
        history={true}
        title="Customers"
        subtitle="Manage the list of registered customers"
        showSearchAndButton={false}
      />

      <ProfileCard
        imageUrl={planProperties.user?.profile_picture || "/unknown.png"}
        name={`${planProperties.user?.first_name} ${planProperties.user?.last_name}`}
        dateJoined={new Date(
          planProperties.user?.created_at
        ).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        customerId={undefined}
      />
<InvoiceCard
  other={
    planProperties.other_amount > 0 ? {
      percentage: planProperties.other_percentage,
      amount: planProperties.other_amount,
      remainingBalance: planProperties.remaining_other_balance,
      paidAmount: planProperties.paid_other_amount
    } : undefined
  }
  invoiceAmount={`₦${planProperties.paid_amount?.toLocaleString()}`}
  paidAmount={`₦${planProperties.total_amount?.toLocaleString()}`}
  paymentSchedule={planProperties.repayment_schedule}
  progressPercentage={
    planProperties.payment_percentage ??
    (planProperties.paid_amount / planProperties.total_amount) * 100
  }
  duration={`${planProperties.monthly_duration} Months`}
  nextPaymentDate={
    planProperties.next_payment_date
      ? new Date(planProperties.next_payment_date).toLocaleDateString()
      : "N/A"
  }
  dueDate={
    nextRepayment?.due_date
      ? new Date(nextRepayment.due_date).toLocaleDateString()
      : "N/A"
  }
  property={{
    name: planProperties.property?.name || "Property",
    address: `${planProperties.property?.lga}, ${planProperties.property?.state}`,
    image: planProperties.property?.display_image || "/land.svg",
    size: planProperties.property?.size || "N/A",
    features: planProperties.property?.features || [],
    type: getPropertyType(planProperties.property_type),
  }}
  infrastructure={
    planProperties.infrastructure_amount > 0 ? {
      percentage: planProperties.infrastructure_percentage,
      amount: planProperties.infrastructure_amount,
      remainingBalance: planProperties.remaining_infrastructure_balance,
      paidAmount: planProperties.paid_infrastructure_amount
    } : undefined
  }
  number_of_unit={ planProperties.number_of_unit}
/>

      <PaymentListCard
        title="Payment Schedule"
        description="View all upcoming payments for your property plan."
        buttonText="Show Payments"
        onButtonClick={() => setIsModalOpen(true)}
      />

      <p className="md:text-[20px] font-[325] text-base text-dark">Payments</p>

      <ReusableTable activeTab={"All"} tabs={tabs} >
        <div className="w-full overflow-x-auto">
          {/* invoiceAmount={`₦${planProperties.paid_amount?.toLocaleString()}`} */}
          <div className="space-y-[10px]">
            {paginatedPayments.map((payment, index) => (
              <PaymentCard
                key={index}
                index={index}
                title={payment.title}
                date={payment.date}
                amount={payment.amount}
                status={payment.status as "Completed" | "Pending" | "Failed"}
                transactionData={payment.transactionData}
              />
            ))}
          </div>
        </div>

      </ReusableTable>

      {isModalOpen && data && (
        
        <div className="fixed inset-0 bg-[#00000066] bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="rounded-lg sm:rounded-[30px] bg-white p-3 sm:p-6 w-full max-w-full min-w-0 md:min-w-[800px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Payment Schedule</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#767676] hover:text-dark text-sm sm:text-base"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 sm:space-y-4">
              {data?.map((item, index) => {
                const status = statusMap[item.status];
                const style = statusStyles[status];
                const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F5F5F5]";

                return (
                  <div
                    key={item.id}
                    className={`rounded-lg sm:rounded-[30px] ${bgColor} p-3 sm:p-6`}
                  >
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full items-center">
                      <div className="min-w-0 col-span-1 xs:col-span-2 sm:col-span-1">
                        <p className="text-sm sm:text-base font-[325] text-dark truncate">
                          Payment {item.property?.name || "Property"}
                        </p>
                        <p className="font-[400] text-xs sm:text-sm text-[#767676] truncate">
                                Payment #{item.id}
                        </p>
                      </div>

                      <div className="flex justify-start sm:justify-center col-span-1">
                        <button
                          className={`text-xs sm:text-sm font-[400] ${style.text} ${style.bg} border ${style.border} py-2 sm:py-[11px] rounded-[20px] sm:rounded-[30px] px-3 sm:px-6 whitespace-nowrap`}
                        >
                          {status}
                        </button>
                      </div>

                      <p className="text-dark font-bold text-sm sm:text-base text-left sm:text-right col-span-1 truncate">
                        ₦{item.amount.toLocaleString()}
                      </p>

                      <div className="flex justify-start sm:justify-end col-span-1">
                        {status === "Rejected" ? (
                          <button className="text-xs sm:text-sm font-[400] text-white bg-[#272727] py-2 sm:py-[11px] rounded-[20px] sm:rounded-[30px] px-3 sm:px-6 whitespace-nowrap">
                            Mark Paid
                          </button>
                        ) : (
                          <button
                            onClick={() => {}}
                            className="text-xs sm:text-sm font-[400] text-[#767676] bg-transparent py-2 sm:py-[11px] rounded-[20px] sm:rounded-[30px] px-3 sm:px-6 whitespace-nowrap hover:bg-[#EAEAEA]"
                          >
                               {new Date(item.due_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                     
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getPropertyType(type: number): string {
  switch (type) {
    case 1:
      return "Apartment";
    case 2:
      return "House";
    case 3:
      return "Land";
    default:
      return "Property";
  }
}

const statusMap: Record<number, PaymentStatus> = {
  0: "Pending",
  1: "Completed",
  2: "Rejected",
};

const statusStyles: Record<
  PaymentStatus,
  { text: string; bg: string; border: string }
> = {
  Completed: {
    text: "text-[#2E9B2E]",
    bg: "bg-[#ECFFEC]",
    border: "border-[#2E9B2E]",
  },
  Pending: {
    text: "text-[#767676]",
    bg: "bg-[#EAEAEA]",
    border: "border-[#767676]",
  },
  Rejected: {
    text: "text-[#D70E0E]",
    bg: "bg-white",
    border: "border-[#D70E0E]",
  },
};