import React, { useState, useEffect } from "react";
import Header from "../../general/Header";
import PaymentCard from "./paymentconfirmcard";
import ProfileCard from "../../general/SmallProfileCard";
import InvoiceCard from "../../general/InvoiceCard";
import PaymentListComponent from "../Customers/PaymentStatus";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentById } from "../../components/Redux/Payment/payment_thunk";
import { clearPayment } from "../../components/Redux/Payment/paymentById_Slice";
import { useParams } from "react-router-dom";
import { getUser } from "../../components/Redux/User/user_Thunk";
import { capitalize } from "../../utils/formatname";
import LoadingAnimations from "../../components/LoadingAnimations";


export default function PaymentById() {
  const [isPaymentListOpen, setIsPaymentListOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { payment, loading, error} = useSelector(
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
      dispatch(clearPayment());
    };
  }, [dispatch, paymentId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
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
  const formatCurrency = (amount: number) => {
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
     <div className="flex items-center justify-center h-screen text-center "><LoadingAnimations loading={loading}/></div>;

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
        paymentId2={payment.id}
          paymentId={payment.reference}
          amount={formatCurrency(payment.amount_paid)}
          // additionalPayments="34 more payments" // This should probably be dynamic
          bankName={payment.bank_name || "N/A"} 
          // accountNumber="834993948393" // This should come from payment data if available
          // accountName={payment.bank_name || "N/A"}
          // This should come from payment data if available
          date={formatDate(payment.created_at)}
          receiptImage={payment.proof_of_payment || "/reciept.svg"}
          fullReciept={payment.proof_of_payment || "/fullreciept.svg"}
          handleHistory={() => setIsPaymentListOpen(true)}
          // additionalPayments={payment. || "N/A"}
        />

        {payment.property && payment.plan && (
          <div>
            <p className="text-[20px] font-[325] text-dark mb-[20px]">
              Payment Plan
            </p>
            <InvoiceCard
              invoiceAmount={formatCurrency(payment.property.total_amount)}
              paidAmount={formatCurrency(payment.plan.paid_amount)}
              paymentSchedule={payment.plan.repayment_schedule}
              progressPercentage={calculateProgressPercentage()}
              duration={`${payment.plan.monthly_duration} Months`}
              nextPaymentDate={formatDate(payment.plan.next_payment_date)}
              dueDate={formatDate(payment.plan.next_payment_date)} // Adjust if you have separate due date
              property={{
                name: payment.property.name,
                address: payment.property.street_address,
                image: payment.property.display_image || "/land.svg",
                size: payment.property.size,
                hasStreetLights: payment.property.features.includes(
                  "24/7 Security"
                ),
                hasGym: payment.property.features.includes("Gym"),
                type: getPropertyType(payment.property.type),
              }}
            />
          </div>
        )}

        <div>
          <p className="text-[20px] font-[325] text-dark mb-[20px]">Customer</p>
          <ProfileCard
            imageUrl={payment?.user.profile_picture ?? "/profile.svg"} // This should come from user data
            name={`${capitalize(payment?.user?.first_name) || "N/A"} ${capitalize(payment?.user?.last_name) || "N/A"}`}
            dateJoined={formatDate(payment?.user.email_verified_at ?? 'N/A')}
             customerId={`/customers/${payment.user.id}`}          />
        </div>
      </div> 

      {isPaymentListOpen && paymentId && (
        <PaymentListComponent
          onClose={() => setIsPaymentListOpen(false)}
          paymentId={Number(payment.property_plan_id)}
        />
      )}
    </div>
  );
}

// Helper function to convert property type number to string
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