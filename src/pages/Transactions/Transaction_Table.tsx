import React from "react";
import Pagination from "../../components/Tables/Pagination";
import { fetchTransactions } from "../../components/Redux/Transactions/Transactions_thunk";
import { useDispatch, useSelector } from "react-redux";
import { selectTransactionsPagination, setCurrentPage } from "../../components/Redux/Transactions/Transactions_slice";
import { AppDispatch } from "../../components/Redux/store";

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

  const handlePageChange = async (page: number) => {
    await dispatch(setCurrentPage(page));
    await dispatch(fetchTransactions());
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
                <tr key={`transaction-${index}`}>
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
                    <div className={`truncate ${
                      transaction.status === "Approved" ? "text-green-500" :
                      transaction.status === "Pending" ? "text-yellow-500" :
                      "text-red-500"
                    }`}>
                      {transaction.status}
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
    </>
  );
}