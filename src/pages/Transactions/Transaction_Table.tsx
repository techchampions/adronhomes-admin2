import React, { useState } from "react";
import Pagination from "../../components/Tables/Pagination";
import { fetchTransactions } from "../../components/Redux/Transactions/Transactions_thunk";
import { useDispatch, useSelector } from "react-redux";
import { selectTransactionsPagination, setCurrentPage } from "../../components/Redux/Transactions/Transactions_slice";
import { AppDispatch } from "../../components/Redux/store";
import TransactionModal from "../../components/Modals/Transaction";


export interface TransactionData {
  id: string;
  customerName: string;
  marketerInCharge: string;
  amount: string;
  status: "Approved" | "Pending" | "Rejected";
  paymentDate: string;
}

interface TransactionDatas {
  data: TransactionData[];
}

export default function TransactionTableComponent({ data }: TransactionDatas) {
  const dispatch = useDispatch<AppDispatch>();
  const pagination = useSelector(selectTransactionsPagination);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePageChange = async (page: number) => {
    await dispatch(setCurrentPage(page));
    await dispatch(fetchTransactions());
  };

  const handleRowClick = (transaction: TransactionData) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Convert table transaction data to modal transaction data format
  const getModalTransactionData = (transaction: TransactionData) => {
    return {
      from: transaction.customerName,
      description: "Property Investment", // You can customize this
      type: "Wallet Funding", // You can customize this
      method: "Bank Transfer", // You can customize this
      fees: "N0.00", // You can customize this
      reference: transaction.id,
      status: transaction.status === "Rejected" ? "Failed" : transaction.status,
      bankIcon: "/bank.svg", // You can customize this
    };
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] lg:min-w-0"> 
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[150px] max-w-[150px]">
                  <div className="truncate">Transaction ID</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[200px] max-w-[200px]">
                  <div className="truncate">Customer's Name</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[200px] max-w-[200px]">
                  <div className="truncate">Marketer in Charge</div>
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
              {data.map((transaction, index) => (
                <tr 
                  key={`transaction-${index}`}
                  onClick={() => handleRowClick(transaction)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[150px] max-w-[150px]">
                    <div className="truncate">{transaction.id}</div>
                  </td>
                  <td className="py-4 pr-6 font-medium text-dark text-sm w-[200px] max-w-[200px]">
                    <div className="truncate">{transaction.customerName}</div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-gray-800 text-sm w-[200px] max-w-[200px]">
                    <div className="truncate">{transaction.marketerInCharge}</div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[150px] max-w-[150px]">
                    <div className="truncate">{transaction.amount}</div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm w-[120px] max-w-[120px]">
                    <div
                      className={`truncate ${
                        transaction.status === "Approved"
                          ? "text-[#2E9B2E]":  transaction.status === "Rejected"
                          ? "text-[#D70E0E]"
                          : "text-[#FF9131]"
                      }`}
                    >
                      { transaction.status === "Rejected"?"Disapproved":transaction.status}
                    </div>
                  </td>
                  <td className="py-4 pl-6 font-[325] text-dark text-sm w-[120px] max-w-[120px]">
                    <div className="truncate">{transaction.paymentDate}</div>
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
        <TransactionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          transactionData={getModalTransactionData(selectedTransaction)}
        />
      )}
    </>
  );
}