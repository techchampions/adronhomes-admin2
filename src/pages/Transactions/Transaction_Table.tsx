import React, { useState } from "react";
import Pagination from "../../components/Tables/Pagination";
// import { fetchUserPayments } from "../../components/Redux/UserPayments/userPaymentsThunk";
import { useDispatch, useSelector } from "react-redux";
// import { selectUserPaymentsPagination, setCurrentPage } from "../../components/Redux/UserPayments/userPaymentsSlice";
import { AppDispatch } from "../../components/Redux/store";

import PaymentModal from "../../components/Modals/Transaction";
import { formatDate } from "../../utils/formatdate";
import { selectUserTransactionsPagination, setCurrentPage } from "../../components/Redux/Payment/userPayment/ userPaymentsSlice";
import { fetchUserTransactions } from "../../components/Redux/Payment/userPayment/usePaymentThunk";


export interface PaymentData {
  id: number;
  customerName: string;
  marketerInCharge: string;
  amount: string;
  status: "Approved" | "Pending" | "Rejected";
  transactionDate: string;
  description: string;
  payment_type: string;
  reference: string;
  property?: {
    name: string;
  };
  director?: {
    first_name: string;
    last_name: string;
  };
}

interface PaymentDatas {
  data: PaymentData[];
}

export default function PaymentTableComponent({ data,userId }: {data:any,userId:any}) {
  const dispatch = useDispatch<AppDispatch>();

  const pagination = useSelector(selectUserTransactionsPagination);
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePageChange = async (page: number) => {
    await dispatch(setCurrentPage(page));
    await dispatch(fetchUserTransactions({ userId: userId,page })); 
  };

  const handleRowClick = (payment: PaymentData) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  // Convert table payment data to modal payment data format
  const getModalPaymentData = (payment: PaymentData) => {
    return {
      from: payment.customerName,
      description: payment.description,
      property: payment.property?.name || 'N/A',
      type: payment.payment_type,
      method: payment.payment_type,
      amount: payment.amount,
      reference: payment.reference,
      status: payment.status === "Rejected" ? "Failed" : payment.status,
      transactionDate: payment.transactionDate,
      director: payment.director ? 
        `${payment.director.first_name} ${payment.director.last_name}` : 'N/A'
    };
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] lg:min-w-0"> 
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[10px] max-w-[150px]">
                  <div className="truncate">Payment ID</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[200px] max-w-[200px]">
                  <div className="truncate">Description</div>
                </th>
             
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[150px] max-w-[150px]">
                  <div className="truncate">Amount</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[120px] max-w-[120px]">
                  <div className="truncate">Status</div>
                </th>
                <th className="py-4 pl-6 font-[325] text-[#757575] text-xs w-[120px] max-w-[120px]">
                  <div className="truncate">Payment Date</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((payment:any, index:any) => (
                <tr 
                  key={`payment-${index}`}
                  onClick={() => handleRowClick(payment)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[10px] max-w-[150px]">
                    <div className="truncate">{payment.id}</div>
                  </td>
                  <td className="py-4 pr-6 font-medium text-dark text-sm w-[200px] max-w-[200px]">
                    <div className="truncate">{payment.description}</div>
                  </td>
                 
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[150px] max-w-[150px]">
                    <div className="truncate">₦{Number(payment.amount).toLocaleString()}</div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[120px] max-w-[120px]">
                    <div
                      className={`truncate ${
                        payment.status === "Approved"
                          ? "text-[#2E9B2E]":  
                        payment.status === "Rejected"
                          ? "text-[#D70E0E]"
                          : "text-[#FF9131]"
                      }`}
                    >
                      {payment.status === "Rejected" ? "Disapproved" : payment.status}
                    </div>
                  </td>
                  <td className="py-4 pl-6 font-[325] text-dark text-sm w-[120px] max-w-[120px]">
                    <div className="truncate">
                      {formatDate(payment.transactionDate)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full">
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          className="mt-8 mb-4"
        />
      </div>

      {/* Payment Modal */}
      {selectedPayment && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={closeModal}
          paymentData={getModalPaymentData(selectedPayment)}
        />
      )}
    </>
  );
}