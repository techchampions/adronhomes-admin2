import React from "react";
import Pagination from "../../components/Tables/Pagination";
import { payments } from "../../components/Redux/Payment/payment_thunk";
import { AppDispatch } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPaymentsPagination,
  setCurrentPage,
} from "../../components/Redux/Payment/payment_slice";
import { useNavigate } from "react-router-dom";

export default function PaymentTableComponent({ data }: { data: any }) {
  const Navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const handlePageChange = async (page: number) => {
    await dispatch(setCurrentPage(page));
    await dispatch(payments());
  };
  const pagination = useSelector(selectPaymentsPagination);
  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="py-4   pr-6   font-[325]    text-[#757575] text-xs w-[180px] max-w-[180px]">
                  <div className="truncate">Payment ID</div>
                </th>
                <th className="py-4   pr-6   font-[325]    text-[#757575] text-xs w-[200px] max-w-[200px]">
                  <div className="truncate">Customer's Name</div>
                </th>
                {/* <th className="py-4   pr-6   font-[325]    text-[#757575] text-xs w-[200px] max-w-[200px]">
                  <div className="truncate">Marketer in Charge</div>
                </th> */}
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
              {data.map((payment: any) => (
                <tr
                  key={payment.id.replace(/^#/, "") + payment.status}
                  onClick={() =>
                    Navigate(`/payments/status/${payment.id.replace(/^#/, "")}`)
                  }
                  className="cursor-pointer"
                >
                  <td className="py-4   pr-6 font-[325] text-dark text-sm w-[180px] max-w-[180px]">
                    <div className="truncate">{payment.id}</div>
                  </td>
                  <td className="py-4   pr-6 font-[325] text-dark text-sm w-[200px] max-w-[200px]">
                    <div className="truncate">{payment.customerName}</div>
                  </td>
                  {/* <td className="py-4   pr-6 font-[350] text-dark text-sm w-[200px] max-w-[200px]">
                    <div className="truncate">{payment.marketerInCharge}</div>
                  </td> */}
                  <td className="py-4   pr-6 font-[325] text-dark text-sm w-[150px] max-w-[150px]">
                    <div className="truncate">{payment.amount}</div>
                  </td>
                  <td className="py-4   pr-6 font-[325] text-sm w-[120px] max-w-[120px]">
                    <div
                      className={`truncate ${
                        payment.status === "Approved"
                          ? "text-[#2E9B2E]":  payment.status === "Rejected"
                          
                           
                          ? "text-[#D70E0E]"
                          : "text-[#FF9131]"
                      }`}
                    >
                      { payment.status === "Rejected"?"Disapproved":payment.status}
                    </div>
                  </td>
                  <td className="py-4   pr-6 font-[325px] text-text-dark text-sm w-[120px] max-w-[120px]">
                    <div className="truncate">{payment.paymentDate}</div>
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
