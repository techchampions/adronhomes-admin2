import React, { useState } from 'react';
import TransactionModal from '../../components/Modals/Transaction';

type PaymentStatus = 'Completed' | 'Pending' | 'Failed' | 'Missed';

interface PaymentCardProps {
  title: string;
  date: string;
  amount: string;
  status: PaymentStatus;
  index: number;
}

const statusStyles: Record<PaymentStatus, { text: string; bg: string; border: string }> = {
  Completed: {
    text: 'text-[#2E9B2E]',
    bg: 'bg-[#ECFFEC]',
    border: 'border-[#2E9B2E]',
  },
  Pending: {
    text: 'text-[#767676]',
    bg: 'bg-[#EAEAEA]',
    border: 'border-[#767676]',
  },
  Failed: {
    text: 'text-[#D70E0E]',
    bg: 'bg-white',
    border: 'border-[#D70E0E]',
  },
  Missed: {
    text: 'text-[#272727]',
    bg: 'bg-[#EAEAEA]',
    border: 'border-[#272727]',
  },
};

const PaymentCard: React.FC<PaymentCardProps> = ({ title, date, amount, status, index }) => {
  const style = statusStyles[status];
  const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]';
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Example transaction data
  const transactionData = {
    from: "Chuks Federick Bomboclatt (Polaris Bank)",
    description: "Property Investment",
    type: "Wallet Funding",
    method: "Local Fund Transfer",
    fees: "N0.00",
    reference: "01hws5tdgy677782hdgeg3",
    status: "Completed",
    bankIcon: "/bank.svg"
  };
  return (
//     <div
//     className={`w-full justify-between flex overflow-auto min-w-[800px] md:min-w-0 px-[23px] py-[18px] rounded-[30px] ${bgColor} items-center`}
//   >
    <>
    
      <div className={`grid grid-cols-3 gap-4 w-full px-6 py-4 rounded-[30px] ${bgColor} items-center overflow-auto min-w-[800px] md:min-w-0 cursor-pointer`} onClick={()=>setIsModalOpen(true)}>
        <div className="min-w-0">
          <p className="text-base font-[325] text-dark truncate">{title}</p>
          <p className="font-[400] text-sm text-[#767676] truncate">{date}</p>
        </div>

        <div className="flex justify-center">
          <button
            className={`text-sm font-[400] ${style.text} ${style.bg} border ${style.border} py-[11px] rounded-[30px] px-6 whitespace-nowrap`}
          >
            {status}
          </button>
        </div>

        <p className="text-dark font-bold text-base text-right truncate">{amount}</p>
      </div><TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionData={transactionData} /></>
  );
};

export default PaymentCard;







// const [payments, setPayments] = useState<Payment[]>([
//     { id: '1', date: 'Tuesday March 18th, 2024', description: 'Treasure Parks and Gardens Payment', amount: '₦5,000,000', status: 'Paid' },
//     { id: '2', date: 'Tuesday March 18th, 2024', description: 'Treasure Parks and Gardens Payment', amount: '₦5,000,000', status: 'Missed' },
//     { id: '3', date: 'Tuesday March 18th, 2024', description: 'Treasure Parks and Gardens Payment', amount: '₦5,000,000', status: 'Paid' },
//     { id: '4', date: 'Tuesday March 18th, 2024', description: 'Treasure Parks and Gardens Payment', amount: '₦5,000,000', status: 'Missed' },
//     { id: '5', date: 'Tuesday March 18th, 2024', description: 'Treasure Parks and Gardens Payment', amount: '₦5,000,000', status: 'Paid' },
//     { id: '6', date: 'Tuesday March 18th, 2024', description: 'Treasure Parks and Gardens Payment', amount: '₦5,000,000', status: 'Pending' },
//     { id: '7', date: 'Tuesday March 18th, 2024', description: 'Treasure Parks and Gardens Payment', amount: '₦5,000,000', status: 'Pending' },
//   ]);