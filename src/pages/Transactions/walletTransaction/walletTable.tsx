import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../components/Redux/store";
import { fetchWalletTransactions } from "../../../components/Redux/customers/wallet_Transactions_thunk";
import {
  selectWalletTransactionsPagination,
  setWalletTransactionsPage,
} from "../../../components/Redux/customers/wallet_Transaction_Slice";
import { formatDate } from "../../../utils/formatdate";
import Pagination from "../../../components/Tables/Pagination";
import WalletTransactionModal from "./WalletTransactionModal";

export interface WalletTransactionData {
  id: number;
  property_id: number | null;
  user_id: number;
  plan_id: number | null;
  amount: number;
  transaction_type: "credit" | "debit";
  created_at: string;
  updated_at: string;
  status: number;
  description: string;
  marketer_id: number | null;
  transaction_method: string;
  is_payment: number;
  reference: string | null;
}

interface WalletTransactionsProps {
  data: WalletTransactionData[];
  userId: any;
}

export default function WalletTransactionsTable({
  data,
  userId,
}: WalletTransactionsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const pagination = useSelector(selectWalletTransactionsPagination);
  const [selectedTransaction, setSelectedTransaction] =
    useState<WalletTransactionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePageChange = async (page: number) => {
    await dispatch(setWalletTransactionsPage(page));
    await dispatch(fetchWalletTransactions(userId));
  };

  const handleRowClick = (transaction: WalletTransactionData) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const getModalTransactionData = (transaction: WalletTransactionData) => {
    return {
      amount: transaction.amount.toString(),
      type: transaction.transaction_type,
      method: transaction.transaction_method,
      description: transaction.description,
      reference: transaction.reference || "N/A",
      status: transaction.status === 1 ? "Completed" : "Failed",
      date: transaction.created_at,
      isPayment: transaction.is_payment === 1,
    };
  };

  const getStatusText = (status: number) => {
    return status === 1 ? "Completed" : "Failed";
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? "#2E9B2E" : "#D70E0E";
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] lg:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="py-4 pr-4 font-[325] text-[#757575] text-xs w-[120px] max-w-[120px]">
                  <div className="truncate">Transaction ID</div>
                </th>
                <th className="py-4 pr-4 font-[325] text-[#757575] text-xs w-[250px] max-w-[250px]">
                  <div className="truncate">Description</div>
                </th>
                <th className="py-4 pr-4 font-[325] text-[#757575] text-xs w-[80px] max-w-[80px]">
                  <div className="truncate">Type</div>
                </th>
                <th className="py-4 pr-4 font-[325] text-[#757575] text-xs w-[120px] max-w-[120px]">
                  <div className="truncate">Amount</div>
                </th>
                <th className="py-4 pr-4 font-[325] text-[#757575] text-xs w-[100px] max-w-[100px]">
                  <div className="truncate">Status</div>
                </th>
                <th className="py-4 pl-4 font-[325] text-[#757575] text-xs w-[100px] max-w-[100px]">
                  <div className="truncate">Date</div>
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
                  <td className="py-4 pr-4 font-[325] text-dark text-sm w-[120px] max-w-[120px]">
                    <div className="truncate">{transaction.id}</div>
                  </td>
                  <td className="py-4 pr-4 font-[325] text-gray-800 text-sm w-[250px] max-w-[250px]">
                    <div className="truncate">{transaction.description}</div>
                  </td>
                  <td className="py-4 pr-4 font-[325] text-dark text-sm w-[80px] max-w-[80px]">
                    <div
                      className={`truncate capitalize ${
                        transaction.transaction_type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.transaction_type}
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-[325] text-dark text-sm w-[120px] max-w-[120px]">
                    <div
                      className={`truncate ${
                        transaction.transaction_type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.transaction_type === "credit" ? "+" : "-"}₦
                      {Math.abs(transaction.amount).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-[325] text-dark text-sm w-[100px] max-w-[100px]">
                    <div
                      className="truncate"
                      style={{ color: getStatusColor(transaction.status) }}
                    >
                      {getStatusText(transaction.status)}
                    </div>
                  </td>
                  <td className="py-4 pl-4 font-[325] text-dark text-sm w-[100px] max-w-[100px]">
                    <div className="truncate">
                      {formatDate(transaction.created_at)}
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

      {selectedTransaction && (
        <WalletTransactionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          transactionData={getModalTransactionData(selectedTransaction)}
        />
      )}
    </>
  );
}