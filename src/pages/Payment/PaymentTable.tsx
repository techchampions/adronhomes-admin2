import React from "react";
import Pagination from "../../components/Pagination";

export interface PaymentData {
  id: string;
  customerName: string;
  marketerInCharge: string;
  amount: string;
  status: "Approved" | "Pending";
  paymentDate: string;
}

interface PaymentTableProps {
  data: PaymentData[];
}

export default function PaymentTableComponent({ data }: PaymentTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th className="py-4   pr-6   font-[325]    text-[#757575] text-xs w-[180px] max-w-[180px]">
              <div className="truncate">Payment ID</div>
            </th>
            <th className="py-4   pr-6   font-[325]    text-[#757575] text-xs w-[200px] max-w-[200px]">
              <div className="truncate">Customer's Name</div>
            </th>
            <th className="py-4   pr-6   font-[325]    text-[#757575] text-xs w-[200px] max-w-[200px]">
              <div className="truncate">Marketer in Charge</div>
            </th>
            <th className="py-4   pr-6   font-[325]    text-[#757575] text-xs w-[150px] max-w-[150px]">
              <div className="truncate">Amount</div>
            </th>
            <th className="py-4   pr-6   font-[325]    text-[#757575] text-xs w-[120px] max-w-[120px]">
              <div className="truncate">Status</div>
            </th>
            <th className="py-4   pr-6   font-[325]    text-[#757575] text-xs w-[120px] max-w-[120px]">
              <div className="truncate">Payment Date</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((payment) => (
            <tr key={payment.id + payment.status}>
              <td className="py-4   pr-6 font-[325px] text-dark text-sm w-[180px] max-w-[180px]">
                <div className="truncate">{payment.id}</div>
              </td>
              <td className="py-4   pr-6 font-[325px] text-dark text-sm w-[200px] max-w-[200px]">
                <div className="truncate">{payment.customerName}</div>
              </td>
              <td className="py-4   pr-6 font-[325px] text-dark text-sm w-[200px] max-w-[200px]">
                <div className="truncate">{payment.marketerInCharge}</div>
              </td>
              <td className="py-4   pr-6 font-[325px] text-dark text-sm w-[150px] max-w-[150px]">
                <div className="truncate">{payment.amount}</div>
              </td>
              <td className="py-4   pr-6 font-[325px] text-sm w-[120px] max-w-[120px]">
                <div
                  className={`truncate ${
                    payment.status === "Approved"
                      ? "text-[#2E9B2E]"
                      : "text-[#FF9131]"
                  }`}
                >
                  {payment.status}
                </div>
              </td>
              <td className="py-4   pr-6 font-[325px] text-text-dark text-sm w-[120px] max-w-[120px]">
                <div className="truncate">{payment.paymentDate}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <Pagination />
    </div>
  );
}
