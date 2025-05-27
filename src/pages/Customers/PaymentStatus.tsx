import React, { useState } from "react";

// Define types
type PaymentStatus = "Completed" | "Pending" | "Failed" | "Missed" | "Paid";

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: PaymentStatus;
}

// Extend status styles to include 'Paid' (which we'll map to 'Completed')
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
      className={`grid grid-cols-4 gap-4 w-full px-6 py-4 rounded-[30px] ${bgColor} items-center overflow- min-w-[800px]`}
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
}

const PaymentListComponent: React.FC<PaymentListComponentProps> = ({ onClose }) => {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      date: "Tuesday March 18th, 2024",
      description: "Treasure Parks and Gardens Payment",
      amount: "₦5,000,000",
      status: "Paid",
    },
    {
      id: "2",
      date: "Tuesday March 18th, 2024",
      description: "Treasure Parks and Gardens Payment",
      amount: "₦5,000,000",
      status: "Missed",
    },
    {
      id: "3",
      date: "Tuesday March 18th, 2024",
      description: "Treasure Parks and Gardens Payment",
      amount: "₦5,000,000",
      status: "Paid",
    },
    {
      id: "4",
      date: "Tuesday March 18th, 2024",
      description: "Treasure Parks and Gardens Payment",
      amount: "₦5,000,000",
      status: "Missed",
    },
    {
      id: "5",
      date: "Tuesday March 18th, 2024",
      description: "Treasure Parks and Gardens Payment",
      amount: "₦5,000,000",
      status: "Paid",
    },
    {
      id: "6",
      date: "Tuesday March 18th, 2024",
      description: "Treasure Parks and Gardens Payment",
      amount: "₦5,000,000",
      status: "Pending",
    },
    {
      id: "7",
      date: "Tuesday March 18th, 2024",
      description: "Treasure Parks and Gardens Payment",
      amount: "₦5,000,000",
      status: "Pending",
    },
  ]);

  const handleMarkAsPaid = (id: string) => {
    setPayments(payments.map(payment => 
      payment.id === id ? {...payment, status: "Paid"} : payment
    ));
  };

  return (
        <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
  <div className="space-y-[10px] bg-white rounded-[30px] px-4 sm:px-6 pb-[96px] max-w-full sm:max-w-[1000px] max-h-[90vh] sm:max-h-[700px]">
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

    <div className="overflow-y-auto px-2 sm:px-6 pb-6 space-y-2 max-h-[calc(90vh-100px)]">
      {payments.map((payment, index) => (
        <PaymentCard
          key={payment.id}
          index={index}
          title={payment.description}
          date={payment.date}
          amount={payment.amount}
          status={payment.status}
        />
      ))}
    </div>
  </div>
</div>

  );
};

export default PaymentListComponent;