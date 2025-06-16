import React, { useState } from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import Pagination from "../../components/Pagination";

const PaymentsTableAll = () => {
  // Data extracted from the image
  const paymentData = [
    {
      id: "1",
      month: "January",
      totalUsers: "17",
      totalPayments: "29",
      totalAmount: "₦57,600,000"
    },
    {
      id: "2",
      month: "January",
      totalUsers: "17",
      totalPayments: "29",
      totalAmount: "₦57,600,000"
    },
    {
      id: "3",
      month: "January",
      totalUsers: "17",
      totalPayments: "29",
      totalAmount: "₦57,600,000"
    },
    {
      id: "4",
      month: "January",
      totalUsers: "17",
      totalPayments: "29",
      totalAmount: "₦57,600,000"
    },
    {
      id: "5",
      month: "January",
      totalUsers: "17",
      totalPayments: "29",
      totalAmount: "₦57,600,000"
    },
    {
      id: "6",
      month: "January",
      totalUsers: "17",
      totalPayments: "29",
      totalAmount: "₦57,600,000"
    },
    {
      id: "7",
      month: "January",
      totalUsers: "17",
      totalPayments: "29",
      totalAmount: "₦57,600,000"
    },
    {
      id: "8",
      month: "January",
      totalUsers: "17",
      totalPayments: "29",
      totalAmount: "₦57,600,000"
    },
    {
      id: "9",
      month: "January",
      totalUsers: "17",
      totalPayments: "29",
      totalAmount: "₦57,600,000"
    },
    {
      id: "10",
      month: "January",
      totalUsers: "17",
      totalPayments: "29",
      totalAmount: "₦57,600,000"
    },
    {
      id: "11",
      month: "January",
      totalUsers: "17",
      totalPayments: "29",
      totalAmount: "₦57,600,000"
    },
    {
      id: "12",
      month: "January",
      totalUsers: "17",
      totalPayments: "29",
      totalAmount: "₦57,600,000"
    }
  ];

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(paymentData.length / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = paymentData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left ">
                <th className="pb-6 font-[325] text-[#757575]  pr-6 whitespace-nowrap text-[12px] ">
                  Month
                </th>
                <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowra text-[12px]">
                  Total Users
                </th>
                <th className="pb-6 font-[325] text-[#757575]  pr-6 whitespace-nowrap text-[12px]">
                  Total Payments
                </th>
                <th className="pb-6 font-[325] text-[#757575]  whitespace-nowrap text-[12px]">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row) => (
                <tr key={row.id} className="cursor-pointer">
                  <td className="pb-8 font-[325]  text-dark text-sm max-w-xs truncate whitespace-nowrap">
                    {row.month}
                  </td>
                  <td className="pb-8 font-[350]  text-dark text-sm max-w-xs truncate whitespace-nowrap">
                    {row.totalUsers}
                  </td>
                  <td className="pb-8 font-[325]  text-dark text-sm max-w-xs truncate whitespace-nowrap">
                    {row.totalPayments}
                  </td>
                  <td className="pb-8 font-[325]  text-dark text-sm whitespace-nowrap">
                    {row.totalAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination />
    </div>
  );
};

export default PaymentsTableAll;