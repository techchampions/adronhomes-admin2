import React, { useState, useEffect } from "react";
import Header from "../../general/Header";
import PaymentCard from "./paymentconfirmcard";
import ProfileCard from "../../general/SmallProfileCard";
import PaymentListComponent from "../Customers/PaymentStatus";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentById } from "../../components/Redux/Payment/payment_thunk";
import { useParams } from "react-router-dom";
import { getUser } from "../../components/Redux/User/user_Thunk";
import { capitalize } from "../../utils/formatname";
import LoadingAnimations from "../../components/LoadingAnimations";
import InvoiceCard from "../../general/invioceCardTwo";
import { clearPaymentList } from "../../components/Redux/Payment/fetchPaymentListById_slice";

export default function PaymentById() {
  const [isPaymentListOpen, setIsPaymentListOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  // Correctly typed selector for paymentById state
  const { payment, loading, error } = useSelector(
    (state: RootState) => state.paymentsById
  );

  const {
    loading: userLoading,
    success: userSuccess,
    error: userError,
    user,
  } = useSelector((state: RootState) => state.user);
  const { paymentId } = useParams<{ paymentId: string }>();

  useEffect(() => {
    if (paymentId) {
      const id = Number(paymentId);
      if (!isNaN(id)) {
        dispatch(fetchPaymentById(id));
        dispatch(getUser());
      } else {
        console.error("Invalid paymentId in URL:", paymentId);
      }
    }

    return () => {
      dispatch(clearPaymentList());
    };
  }, [dispatch, paymentId]);

  // Format date for display
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString || dateString === "Payment completed") return "Payment completed";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "₦0.00";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="pb-[236px] relative">
        <Header
          title="Payments"
          subtitle="Manage the list of payments made by customers"
          history={true}
        />
        <div className="flex items-center justify-center h-screen text-center ">
          <LoadingAnimations loading={loading} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-[236px] relative">
        <Header
          title="Payments"
          subtitle="Manage the list of payments made by customers"
          history={true}
        />
        <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <p className="text-center py-10 text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="pb-[236px] relative">
        <Header
          title="Payments"
          subtitle="Manage the list of payments made by customers"
          history={true}
        />
        <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <p className="text-center py-10">No payment data found</p>
        </div>
      </div>
    );
  }

  // Helper function to get property type string
  const getPropertyType = (type: number | undefined): string => {
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
  };

  // Calculate progress percentage for the invoice card
  const calculateProgressPercentage = (): number => {
    if (payment.plan && payment.plan.total_amount > 0) {
      return Math.round(
        (payment.plan.paid_amount / payment.plan.total_amount) * 100
      );
    }
    return 0;
  };

  return (
    <div className="pb-[236px] relative">
      <Header
        title="Payments"
        subtitle="Manage the list of payments made by customers"
        history={true}
      />
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] space-y-[40px]">
        <PaymentCard
          status={payment.status}
          paymentId2={payment.id}
          paymentId={payment.reference}
          amount={formatCurrency(payment.amount_paid)}
          bankName={payment.payment_type === 'Virtual Wallet' ? payment.payment_type : payment.bank_name || "N/A"}
          date={formatDate(payment.created_at)}
          receiptImage={payment.proof_of_payment || "/reciept.svg"}
          fullReciept={payment.proof_of_payment || "/fullreciept.svg"}
          handleHistory={() => setIsPaymentListOpen(true)}
          id={Number(paymentId)}
          wallet={payment.payment_type === 'Virtual Wallet' ||payment.payment_type === 'Paystack'  }
        />

        {payment.property && payment.plan && (
          <div>
            <p className="text-[20px] font-[325] text-dark mb-[20px]">
              Payment Plan
            </p>
            <InvoiceCard
              invoiceAmount={formatCurrency(payment.plan.paid_amount)}
              paidAmount={formatCurrency(payment.plan.total_amount)}
              paymentSchedule={payment.plan.repayment_schedule}
              progressPercentage={calculateProgressPercentage()}
              duration={`${payment.plan.monthly_duration ?? 'One Time Payment'}`}
              nextPaymentDate={formatDate(payment.plan.next_payment_date)}
              dueDate={formatDate(payment.plan.next_payment_date)}
              property={{
                name: payment.property.name,
                address: payment.property.street_address,
                image: payment.property.display_image || "/land.svg",
                size: payment.property.size,
                features: payment.property.features,
                type: getPropertyType(payment.property.type),
              }}
              infrastructure={payment.plan.infrastructure_amount > 0
                ? {
                  percentage: payment.plan.infrastructure_percentage,
                  amount: payment.plan.infrastructure_amount,
                  remainingBalance: payment.plan.remaining_infrastructure_balance,
                  paidAmount: payment.plan.paid_infrastructure_amount,
                }
                : undefined}
              other={payment.plan.other_amount > 0
                ? {
                  percentage: payment.plan.other_percentage,
                  amount: payment.plan.other_amount,
                  remainingBalance: payment.plan.remaining_other_balance,
                  paidAmount: payment.plan.paid_other_amount,
                }
                : undefined}
              number_of_unit={payment.plan.number_of_unit}
            />
          </div>
        )}

        <div>
          <p className="text-[20px] font-[325] text-dark mb-[20px]">Customer</p>
          <ProfileCard
            imageUrl={payment?.user?.profile_picture ?? "/profile.svg"}
            name={`${capitalize(payment?.user?.first_name) || "N/A"} ${
              capitalize(payment?.user?.last_name) || "N/A"
            }`}
            dateJoined={formatDate(payment?.user?.email_verified_at)}
            customerId={`/customers/${payment.user.id}`}
          />
        </div>
      </div>

      {isPaymentListOpen && paymentId && payment.property_plan_id && (
        <PaymentListComponent
          onClose={() => setIsPaymentListOpen(false)}
          paymentId={Number(payment.property_plan_id)}
        />
      )}
    </div>
  );
}