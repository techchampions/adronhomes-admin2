import React from "react";
import Pagination from "../../components/Tables/Pagination";

export type PaymentStatus = "Pending" | "Completed" | "Rejected";

interface PaymentModalProps {
  title: string;
  date: string;
  amount: any;
  status: PaymentStatus;
  index: number;
  onClose: () => void;
}

const statusStyles: Record<PaymentStatus, { text: string; bg: string; border: string }> = {
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

const PaymentModal: React.FC<PaymentModalProps> = ({
  title,
  date,
  amount,
  status,
  index,
  onClose,
}) => {
  const style = statusStyles[status];
  const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F5F5F5]";

  return (
    <div className="fixed inset-0 bg-[#00000066] bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-[30px] ${bgColor} p-6 w-full max-w-4xl min-w-[800px]`}>
        <div className="grid grid-cols-4 gap-4 w-full items-center">
          {/* Title and Date */}
          <div className="min-w-0 col-span-1">
            <p className="text-base font-[325] text-dark truncate">{title}</p>
            <p className="font-[400] text-sm text-[#767676] truncate">{date}</p>
          </div>

          {/* Status Button */}
          <div className="flex justify-center col-span-1">
            <button
              className={`text-sm font-[400] ${style.text} ${style.bg} border ${style.border} py-[11px] rounded-[30px] px-6 whitespace-nowrap`}
            >
              {status}
            </button>
          </div>

          {/* Amount */}
          <p className="text-dark font-bold text-base text-right col-span-1 truncate">
            {amount}
          </p>

          {/* Action Button */}
          <div className="flex justify-end col-span-1">
            {status === "Rejected" ? (
              <button className="text-sm font-[400] text-white bg-[#272727] py-[11px] rounded-[30px] px-6 whitespace-nowrap">
                Mark as Paid
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="text-sm font-[400] text-[#767676] bg-transparent py-[11px] rounded-[30px] px-6 whitespace-nowrap hover:bg-[#EAEAEA]"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default PaymentModal;
