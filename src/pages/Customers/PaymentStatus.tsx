import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentListById } from "../../components/Redux/Payment/payment_thunk";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { clearPaymentList, selectPaymentListPagination, setPaymentListPage } from "../../components/Redux/Payment/fetchPaymentListById_slice";
import Pagination from "../../components/Tables/Pagination";
import NotFound from "../../components/NotFound";

// Define types
type PaymentStatus = "Completed" | "Pending" | "Failed" | "Missed" | "Paid";

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: PaymentStatus;
}

// Status styles
const statusStyles: Record<
  PaymentStatus,
  { text: string; bg: string; border: string }
> = {
  Completed: {
    text: "text-[#2E9B2E]",
    bg: "bg-[#ECFFEC]",
    border: "border-[#2E9B2E]",
  },
  Paid: {
    text: "text-[#2E9B2E]",
    bg: "bg-[#ECFFEC]",
    border: "border-[#2E9B2E]",
  },
  Pending: {
    text: "text-[#767676]",
    bg: "bg-[#EAEAEA]",
    border: "border-[#767676]",
  },
  Failed: {
    text: "text-[#D70E0E]",
    bg: "bg-white",
    border: "border-[#D70E0E]",
  },
  Missed: {
    text: "text-[#272727]",
    bg: "bg-[#EAEAEA]",
    border: "border-[#272727]",
  },
};

interface PaymentCardProps {
  title: string;
  date: string;
  amount: string;
  status: PaymentStatus;
  index: number;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  title,
  date,
  amount,
  status,
  index,
}) => {
  const style = statusStyles[status];
  const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F5F5F5]";

  return (
    <div
      className={`grid grid-cols-4 gap-4 w-full px-6 py-4 rounded-[30px] ${bgColor} items-center min-w-[800px]`}
    >
      <div className="min-w-0 col-span-1">
        <p className="text-base font-[325] text-dark truncate">{title}</p>
        <p className="font-[400] text-sm text-[#767676] truncate">{date}</p>
      </div>

      <div className="flex justify-center col-span-1">
        <button
          className={`text-sm font-[400] ${style.text} ${style.bg} border ${style.border} py-[11px] rounded-[30px] px-6 whitespace-nowrap`}
        >
          {status === "Paid" ? "Completed" : status}
        </button>
      </div>

      <p className="text-dark font-bold text-base text-right col-span-1 truncate">
        {amount}
      </p>

      <div className="flex justify-end col-span-1">
        {status === "Missed" ? (
          <button className="text-sm font-[400] text-white bg-[#272727] py-[11px] rounded-[30px] px-6 whitespace-nowrap">
            Mark as Paid
          </button>
        ) : null}
      </div>
    </div>
  );
};

interface PaymentListComponentProps {
  onClose: () => void;
  paymentId: number;
}

const PaymentListComponent: React.FC<PaymentListComponentProps> = ({ 
  onClose,
  paymentId 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.paymentList
  );
  const pagination = useSelector(selectPaymentListPagination);

  useEffect(() => {
    dispatch(fetchPaymentListById({ paymentId, currentPage: pagination.currentPage }));
    
    return () => {
      dispatch(clearPaymentList());
    };
  }, [dispatch, paymentId, pagination.currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(setPaymentListPage(page));
  };

  // Transform API data to match your UI format
  const transformedPayments: Payment[] = data.map(payment => ({
    id: payment.id.toString(),
    date: new Date(payment.created_at).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    description: payment.description,
    amount: `₦${payment.amount.toLocaleString()}`,
    status: payment.status === 1 ? "Paid" : "Pending",
  }));

  if (loading) return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[30px] p-8">
        <p>Loading payments...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[30px] p-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="space-y-[10px] bg-white rounded-[30px] px-4 sm:px-6 pb-6 max-w-full sm:max-w-[1000px] max-h-[90vh] sm:max-h-[700px] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center pt-6 px-2 sm:px-10">
          <p className="font-[350] text-[20px] text-dark">Payment List</p>
          <button
            onClick={onClose}
            className="text-xl font-bold leading-none focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 sm:px-6 space-y-2">
          {transformedPayments.length > 0 ? (
            transformedPayments.map((payment, index) => (
              <PaymentCard
                key={payment.id}
                index={index}
                title={payment.description}
                date={payment.date}
                amount={payment.amount}
                status={payment.status}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <NotFound/>
              <p>No payments found</p>
            </div>
          )}
        </div>

        {transformedPayments.length > 0 && (
          <div className="pb-4 px-2 sm:px-6">
            <Pagination 
              pagination={pagination} 
              onPageChange={handlePageChange} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentListComponent;