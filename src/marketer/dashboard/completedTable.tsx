import React, { useState } from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import Pagination from "../../components/Tables/Pagination";

import { fetchMarketerDashboard } from "../../components/Redux/Marketer/Dashboard_thunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../components/Redux/store";
import {
  selectActivePlansPagination,
  selectCompletedPlansPagination,
  setActivePlansCurrentPage,
  setCompletedPlansCurrentPage,
} from "../../components/Redux/Marketer/Dashboard_slice";
import { formatDate } from "../../utils/formatdate";
import { formatAsNaira } from "../../utils/formatcurrency";
import { useNavigate } from "react-router-dom";

const CompletedPlans = ({ customerData }: { customerData?: any }) => {
  const dispatch = useDispatch<AppDispatch>();
  const pagination = useSelector(selectCompletedPlansPagination);

  // Use the sample data from image if no customerData is provided
const navigate=useNavigate()
  const handlePageChange = (page: number) => {
    dispatch(setCompletedPlansCurrentPage(page));
    dispatch(fetchMarketerDashboard({ currentpage: page }));
  };

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left ">
                 <th className="pb-6 font-[325] text-[#757575]  pr-6 whitespace-nowrap text-[12px] ">
                 Customer's Contract_id
                </th>
                <th className="pb-6 font-[325] text-[#757575]  pr-6 whitespace-nowrap text-[12px] ">
                  Customer's Name
                </th>
                <th className="pb-6 font-[325] text-[#757575]  pr-6 whitespace-nowrap text-[12px]">
                  Start Date
                </th>
                <th className="pb-6 font-[325] text-[#757575]  pr-6 whitespace-nowrap text-[12px]">
               End Date
                </th>
                <th className="pb-6 font-[325] text-[#757575]  pr-6 whitespace-nowrap text-[12px]">
                 Paid Amount
                </th>
                {/* <th className="pb-6 font-[325] text-[#757575]  whitespace-nowrap text-[12px]">
                  Phone Number
                </th> */}
              </tr>
            </thead>
          <tbody>
  {customerData.map((row: any) => (
    <tr
      key={row.id}
      className="cursor-pointer"
      onClick={() =>
        navigate(`/marketer-payment/${row.plan_id}/${row.user_id}`)
      }
    >
     
      <td className="pr-2 max-w-xs">
           <td className="pr-2 max-w-xs">
        <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
          {row.unique_customer_id}
        </div>
      </td>
        <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
          {row.name ?? "N/A"}
        </div>
      </td>
      <td className="pr-2 max-w-xs">
        <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
          {formatDate(row.StartDate)}
        </div>
      </td>
      <td className="pr-2 max-w-xs">
        <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
          {formatDate(row.EndDate)}
        </div>
      </td>
      <td className="pr-2 whitespace-nowrap">
        <div className="pb-8 font-[325] text-dark text-sm">
          {formatAsNaira(row.paid_amount) ?? "N/A"}
        </div>
      </td>
      {/* <td className="pr-2 max-w-xs">
        <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
          {row.phoneNumber ?? "N/A"}
        </div>
      </td> */}
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
        className="mt-8 mb-4"
      />
    </div>
  );
};

export default CompletedPlans;
