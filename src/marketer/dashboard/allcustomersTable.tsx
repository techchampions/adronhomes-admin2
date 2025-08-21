import React, { useState } from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../components/Redux/store";

import { fetchMarketerDashboard } from "../../components/Redux/Marketer/Dashboard_thunk";

import Pagination from "../../components/Tables/Pagination";
import { formatDate } from "../../utils/formatdate";
import { selectCompletedPlansPagination, setCompletedPlansCurrentPage } from "../../components/Redux/Marketer/Dashboard_slice";

const CustomersTableAll = ({currentItems}:{currentItems:any}) => {

  const dispatch = useDispatch<AppDispatch>();
  const pagination = useSelector(selectCompletedPlansPagination);
  // const activePlans = useSelector(selectActivePlans);

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
                 Customer’s Name
                </th>
               
                <th className="pb-6 font-[325] text-[#757575]  pr-6 whitespace-nowrap text-[12px]">
                  Date Joined
                </th>
                <th className="pb-6 font-[325] text-[#757575]  pr-6 whitespace-nowrap text-[12px]">
                  Property Plans
                </th>
                <th className="pb-6 font-[325] text-[#757575]  pr-6 whitespace-nowrap text-[12px]">
                  Saved Properties
                </th>
                {/* <th className="pb-6 font-[325] text-[#757575]  whitespace-nowrap text-[12px]">
                  Phone Number
                </th> */}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row:any) => (
                <tr key={row.id} className="cursor-pointer">
                    <td className="pb-8 font-[325]  text-dark text-sm max-w-xs truncate whitespace-nowrap">
                    {row.unique_customer_id ?? 'N/A'}
                  </td>
                  <td className="pb-8 font-[325]  text-dark text-sm max-w-xs truncate whitespace-nowrap">
                    {row.name ?? 'N/A'}
                  </td>
               
                  <td className="pb-8 font-[325]  text-dark text-sm max-w-xs truncate whitespace-nowrap">
                    {formatDate(row.dateJoined )?? 'N/A'}
                  </td>
                  <td className="pb-8 font-[325]  text-dark text-sm whitespace-nowrap">
                    {row.propertyPlans ?? 'N/A'} 
                  </td>
                  <td className="pb-8 font-[325]  text-dark text-sm whitespace-nowrap">
                    {row.savedProperties ?? 'N/A'}
                  </td>
                  {/* <td className="pb-8 font-[325]  text-dark text-sm max-w-xs truncate whitespace-nowrap">
                    {row.phoneNumber ?? 'N/A'}
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

export default CustomersTableAll