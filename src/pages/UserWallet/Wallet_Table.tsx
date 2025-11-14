// Wallet_Table.tsx
import React, { useState } from "react";
import Pagination from "../../components/Tables/Pagination";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../components/Redux/store";
import { setCurrentPage } from "../../components/Redux/wallet/walllet_slice";
import { fetchWalletTransactions } from "../../components/Redux/wallet/wallet_thunk";
import PaymentModal from "../../components/Modals/Transaction";
import { formatDate } from "../../utils/formatdate";

export interface WalletTransactionData {
  id: number;
  customerName: string;
  amount: string;
  status: any
  transactionDate: string;
  description: string;
  transactionType: "credit" | "debit";
  reference: string;
  transactionMethod: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    virtual_account?: {
      account_number: string;
      account_bank: string;
      account_balance: number;
    };
  };
}

interface WalletTableProps {
  data: WalletTransactionData[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export default function WalletTableComponent({ data, pagination }: WalletTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransactionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePageChange = async (page: number) => {
    await dispatch(setCurrentPage(page));
    // await dispatch(fetchWalletTransactions({ page }));
  };

  const handleRowClick = (transaction: WalletTransactionData) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Convert wallet transaction data to modal payment data format
  const getModalPaymentData = (transaction: WalletTransactionData) => {
    return {
      from: transaction.customerName,
      description: transaction.description,
      property: 'Wallet Transaction',
      type: transaction.transactionType,
      method: transaction.transactionMethod,
      amount: transaction.amount,
      reference: transaction.reference,
      status: transaction.status,
      paymentDate: transaction.transactionDate,
      director: 'N/A',
      user: transaction.user ? {
        name: transaction.customerName,
        email: transaction.user.email,
        phone: transaction.user.phone_number,
        virtualAccount: transaction.user.virtual_account ? {
          accountNumber: transaction.user.virtual_account.account_number,
          bank: transaction.user.virtual_account.account_bank,
          balance: transaction.user.virtual_account.account_balance
        } : undefined
      } : undefined
    };
  };

  const getStatusColor = (status: string, transactionType: string) => {
    if (status === "Approved") {
      return transactionType === "credit" ? "text-[#2E9B2E]" : "text-[#D70E0E]";
    }
    return "text-[#FF9131]";
  };

  const getAmountColor = (transactionType: string) => {
    return transactionType === "credit" ? "text-[#2E9B2E]" : "text-[#D70E0E]";
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] lg:min-w-0"> 
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[10px] max-w-[150px]">
                  <div className="truncate">Transaction ID</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[200px] max-w-[200px]">
                  <div className="truncate">Customer Name</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[200px] max-w-[200px]">
                  <div className="truncate">Description</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[100px] max-w-[100px]">
                  <div className="truncate">Type</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[150px] max-w-[150px]">
                  <div className="truncate">Amount</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[120px] max-w-[120px]">
                  <div className="truncate">Status</div>
                </th>
                <th className="py-4 pl-6 font-[325] text-[#757575] text-xs w-[120px] max-w-[120px]">
                  <div className="truncate">Transaction Date</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((transaction, index) => (
                <tr 
                  key={`transaction-${index}`}
                  onClick={() => handleRowClick(transaction)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[10px] max-w-[150px]">
                    <div className="truncate">{transaction.id}</div>
                  </td>
                  <td className="py-4 pr-6 font-medium text-dark text-sm w-[200px] max-w-[200px]">
                    <div className="truncate">{transaction.customerName}</div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[200px] max-w-[200px]">
                    <div className="truncate">{transaction.description}</div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[100px] max-w-[100px]">
                    <div className={`truncate capitalize ${
                      transaction.transactionType === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.transactionType}
                    </div>
                  </td>
                  <td className={`py-4 pr-6 font-[325] text-sm w-[150px] max-w-[150px] ${getAmountColor(transaction.transactionType)}`}>
                    <div className="truncate">
                      {transaction.transactionType === 'credit' ? '+' : '-'}₦{Number(transaction.amount).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[120px] max-w-[120px]">
                    <div className={`truncate ${getStatusColor(transaction.status, transaction.transactionType)}`}>
                      {transaction.status}
                    </div>
                  </td>
                  <td className="py-4 pl-6 font-[325] text-dark text-sm w-[120px] max-w-[120px]">
                    <div className="truncate">
                      {formatDate(transaction.transactionDate)}
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

      {/* Transaction Modal */}
      {selectedTransaction && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={closeModal}
          paymentData={getModalPaymentData(selectedTransaction)}
        />
      )}
    </>
  );
}