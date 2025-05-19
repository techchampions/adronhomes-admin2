import React, { useState } from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import Pagination from "../../components/Pagination";
import TransactionModal from "../../components/Modals/Transaction";

interface CustomersTable {
  id: string;
  name: string;
  marketer: string;
  dateJoined: string;
  propertyPlans: string;
  savedProperties: number;
  phoneNumber: string;
}

interface CustomersTableprop {
  data: CustomersTable[];
}

export default function CustomersTableComponent({ data }: CustomersTableprop) {

  return (
    <>
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] md:min-w-0"> 
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                Customer's Name
              </th>
              <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                Marketer in Charge
              </th>
              <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                Date Joined
              </th>
              <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                Property Plans
              </th>
              <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                Saved Properties
              </th>
              <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] whitespace-nowrap">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="cursor-pointer" >
                <td className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[72px] truncate whitespace-nowrap">
                  {row.name}
                </td>
                <td className="pb-[31px] font-gotham font-[350] text-dark text-sm max-w-[85px] truncate whitespace-nowrap">
                  {row.marketer}
                </td>
                <td className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[73px] truncate whitespace-nowrap">
                  {row.dateJoined}
                </td>
                <td className="pb-[31px] font-gotham font-[325] text-dark text-sm whitespace-nowrap">
                  {row.propertyPlans}
                </td>
                <td className="pb-[31px] font-gotham font-[325] text-dark text-sm whitespace-nowrap">
                  {row.savedProperties}
                </td>
                <td className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[100px] truncate whitespace-nowrap">
                  {row.phoneNumber}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div><div className="w-full">
        <Pagination />
      </div>

      </>
  );
}