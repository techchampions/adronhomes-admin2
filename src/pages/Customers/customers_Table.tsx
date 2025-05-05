import React from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import Pagination from "../../components/Pagination";

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
    <div>
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px]">
              Customer’s Name
            </th>
            <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px]">
              Marketer in Charge
            </th>
            <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] hidden lg:block">
              Date Joined
            </th>
            <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] ">
              Property Plans
            </th>
            <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px]">
              Saved Properties
            </th>
            <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] hidden lg:block">
              Phone Number
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="">
              <td className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[72px] truncate">
                {row.name}
              </td>
              <td className="pb-[31px] font-gotham font-[350] text-dark text-sm max-w-[85px] truncate ">
                {row.marketer}
              </td>
              <td className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[73px] truncate hidden lg:block">
                {row.dateJoined}
              </td>
              <td className="pb-[31px] font-gotham font-[325] text-dark text-sm">
                {row.propertyPlans}
              </td>
              <td className="pb-[31px] font-gotham font-[325] text-dark text-sm">
                {row.savedProperties}
              </td>
              <td className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[100px] truncate hidden lg:block">
                {row.phoneNumber}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination/>
     
    </div>
  );
}
