import React from "react";
import Pagination from "../../components/Pagination";

export interface CustomerData {
  customerName: string;
  marketerInCharge: string;
  dateJoined: string;
  propertyPlans: number;
  savedProperties: number;
  phoneNumber: string;
}
interface CustomerDatas {
  data: CustomerData[];
}
export default function CustomerTableComponent({ data }: CustomerDatas) {
  // Data from the provided customer table
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th className="py-4   pr-6    font-[325]    text-[#757575] text-xs w-[200px] max-w-[200px]">
              <div className="truncate">Customer's Name</div>
            </th>
            <th className="py-4   pr-6    font-[325]    text-[#757575] text-xs w-[200px] max-w-[200px]">
              <div className="truncate">Marketer in Charge</div>
            </th>
            <th className="py-4   pr-6    font-[325]    text-[#757575] text-xs w-[120px] max-w-[120px]">
              <div className="truncate">Date Joined</div>
            </th>
            <th className="py-4   pr-6    font-[325]    text-[#757575] text-xs w-[120px] max-w-[120px]">
              <div className="truncate">Property Plans</div>
            </th>
            <th className="py-4   pr-6    font-[325]    text-[#757575] text-xs w-[120px] max-w-[120px]">
              <div className="truncate">Saved Properties</div>
            </th>
            <th className="py-4   pl-6    font-[325]    text-[#757575] text-xs w-[150px] max-w-[150px]">
              <div className="truncate">Phone Number</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((customer, index) => (
            <tr key={`customer-${index}`}>
              <td className="py-4   pr-6    font-[325]  text-dark text-sm w-[200px] max-w-[200px]">
                <div className="truncate">{customer.customerName}</div>
                
              </td>
              <td className="py-4   pr-6  font-medium text-dark text-sm w-[200px] max-w-[200px]">
                <div className="truncate">{customer.marketerInCharge}</div>
              </td>
              <td className="py-4   pr-6    font-[325]  text-gray-800 text-sm w-[120px] max-w-[120px]">
                <div className="truncate">{customer.dateJoined}</div>
              </td>
              <td className="py-4   pr-6    font-[325]  text-dark text-sm w-[120px] max-w-[120px]">
                <div className="truncate">{customer.propertyPlans}</div>
              </td>
              <td className="py-4   pr-6    font-[325]  text-dark text-sm w-[120px] max-w-[120px]">
                <div className="truncate">{customer.savedProperties}</div>
              </td>
              <td className="py-4   pl-6    font-[325]  text-dark text-sm w-[150px] max-w-[150px]">
                <div className="truncate">{customer.phoneNumber}</div>
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