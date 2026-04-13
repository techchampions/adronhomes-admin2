import React, { useState } from "react";
import Pagination from "../../components/Tables/Pagination";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../components/Redux/store";
// import { setCurrentPage } from "../../components/Redux/contractPayments/contract_payments_slice";
import PaymentModal from "../../components/Modals/Transaction";
import { formatDate } from "../../utils/formatdate";
import { setCurrentPage } from "../../components/Redux/Contract/contract_payments_slice";

export interface ContractPaymentData {
  id: number;
  contract_id: number;
  erp_contract_id: string;
  user_id: number;
  amount_paid: number;
  payment_type: string; // "virtual_wallet" or "interswitch"
  status: number;
  reference: string;
  created_at: string;
  updated_at: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  propertyName: string;
  contract: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    propertyName: string;
    propertyEstate: string;
    propertyNetValue: string;
    currentbalance: string;
  } | null;
}

interface ContractPaymentsTableProps {
  data: ContractPaymentData[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export default function ContractPaymentsTableComponent({ data, pagination }: ContractPaymentsTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedPayment, setSelectedPayment] = useState<ContractPaymentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePageChange = async (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleRowClick = (payment: ContractPaymentData) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 1:
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>;
      case 2:
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Failed</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const getPaymentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      virtual_wallet: "bg-purple-100 text-purple-800",
      interswitch: "bg-blue-100 text-blue-800",
    };
    const displayNames: Record<string, string> = {
      virtual_wallet: "Wallet",
      interswitch: "Interswitch",
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[type] || "bg-gray-100 text-gray-800"}`}>
        {displayNames[type] || type?.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const getModalPaymentData = (payment: ContractPaymentData) => {
    return {
      from: payment.customerName,
      description: `Payment for contract ${payment.erp_contract_id}`,
      property: payment.propertyName || "Property Payment",
      type: "debit",
      method: payment.payment_type === "virtual_wallet" ? "Wallet" : "Interswitch",
      amount: payment.amount_paid.toString(),
      reference: payment.reference,
      status: payment.status === 0 ? "Pending" : payment.status === 1 ? "Approved" : "Failed",
      paymentDate: payment.created_at,
      transactionDate: payment.created_at,
      director: "N/A",
      user: {
        name: payment.customerName,
        email: payment.customerEmail,
        phone: payment.customerPhone,
      }
    };
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] lg:min-w-0"> 
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[80px] max-w-[80px]">
                  <div className="truncate">Payment ID</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[180px] max-w-[180px]">
                  <div className="truncate">Customer Name</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[150px] max-w-[150px]">
                  <div className="truncate">Contract ID</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[120px] max-w-[120px]">
                  <div className="truncate">Amount</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[130px] max-w-[130px]">
                  <div className="truncate">Payment Type</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[120px] max-w-[120px]">
                  <div className="truncate">Reference</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[100px] max-w-[100px]">
                  <div className="truncate">Status</div>
                </th>
                <th className="py-4 pl-6 font-[325] text-[#757575] text-xs w-[150px] max-w-[150px]">
                  <div className="truncate">Payment Date</div>
                </th>
               </tr>
            </thead>
            <tbody>
              {data.map((payment, index) => (
                <tr 
                  key={`payment-${index}`}
                  onClick={() => handleRowClick(payment)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[80px] max-w-[80px]">
                    <div className="truncate">{payment.id}</div>
                   </td>
                  <td className="py-4 pr-6 font-medium text-dark text-sm w-[180px] max-w-[180px]">
                    <div className="truncate">{payment.customerName}</div>
                   </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[150px] max-w-[150px]">
                    <div className="truncate">{payment.erp_contract_id}</div>
                   </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[120px] max-w-[120px]">
                    <div className="truncate  text-green-600">
                      ₦{Number(payment.amount_paid).toLocaleString()}
                    </div>
                   </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[130px] max-w-[130px]">
                    <div className="truncate">{getPaymentTypeBadge(payment.payment_type)}</div>
                   </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[120px] max-w-[120px]">
                    <div className="truncate text-xs font-mono">{payment.reference}</div>
                   </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[100px] max-w-[100px]">
                    <div className="truncate">{getStatusBadge(payment.status)}</div>
                   </td>
                  <td className="py-4 pl-6 font-[325] text-dark text-sm w-[150px] max-w-[150px]">
                    <div className="truncate">
                      {formatDate(payment.created_at)}
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