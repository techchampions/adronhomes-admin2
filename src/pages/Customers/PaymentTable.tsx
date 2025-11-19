import React, { useState } from 'react';
import PaymentModal from '../../components/Modals/PaymentModal';

type PaymentStatus = 'Completed' | 'Pending' | 'Failed' | 'Missed';

interface PropertyData {
  name: string;
  price: number;
  size: string;
  image: string;
  address: string;
}

interface TransactionData {
  from: string;
  description: string;
  type: string;
  method: string;
  fees: string;
  reference: string;
  status: string;
  bankIcon: string;
  property: PropertyData;
}

interface PaymentCardProps {
  title: string;
  date: string;
  amount: string;
  status: PaymentStatus;
  index: number;
  transactionData: TransactionData;
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

export const PaymentCard: React.FC<PaymentCardProps> = ({
  title,
  date,
  amount,
  status,
  index,
  transactionData, 
}) => {
  const style = statusStyles[status];
  const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]';
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className={`grid grid-cols-3 gap-4 w-full px-6 py-4 rounded-[30px] ${bgColor} items-center overflow-auto min-w-[800px] md:min-w-0 cursor-pointer`}
        onClick={() => setIsModalOpen(true)}
      >
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
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paymentData={transactionData}
      />
    </>
  );
};