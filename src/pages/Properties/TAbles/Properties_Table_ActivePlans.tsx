import React from "react";
import Pagination from "../../../components/Tables/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../components/Redux/store";
import { selectPropertiesagination, setPropertiesPage } from "../../../components/Redux/Properties/propertiesTable_slice";
import { fetchProperties } from "../../../components/Redux/Properties/properties_Thunk";

export interface PropertyDataActivePlan {
  name: string;
  location: string;
  Amount_Paid: string;
  Amount_Left: string;
  Duration: string;
  Due_Date: string;
  imageUrl: string;
  price: string;
}

interface PropertyTableProps {
  data: PropertyDataActivePlan[];
}

export default function PropertyTableComponentActivePlan({
  data,
}: PropertyTableProps) {
   const dispatch = useDispatch<AppDispatch>();
  const handlePageChange = async (page: number) => {
    await dispatch(setPropertiesPage(page));
    await dispatch(fetchProperties());
  };
  const pagination = useSelector(selectPropertiesagination);
  return (
    <><div className="w-full overflow-x-auto">
      <div className="min-w-[800px] md:min-w-0"> 
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="text-left">
            {/* Property Name - widest column */}
            <th className="py-4 pr-4 font-normal text-[#757575] text-xs w-[240px]">
              Property Name
            </th>
            {/* Price - based on "₦56,000,000" */}
            <th className="py-4 px-4 font-normal text-[#757575] text-xs w-[120px]">
              Price
            </th>
            {/* Amount Paid - based on "₦26,000,000" */}
            <th className="py-4 px-4 font-normal text-[#757575] text-xs w-[120px]">
              Amount Paid
            </th>
            {/* Amount Left - based on "₦30,000,000" */}
            <th className="py-4 px-4 font-normal text-[#757575] text-xs w-[120px]">
              Amount Left
            </th>
            {/* Duration - based on "12 Months" */}
            <th className="py-4 px-4 font-normal text-[#757575] text-xs w-[100px]">
              Duration
            </th>
            {/* Due Date - based on "32/09/2025" */}
            <th className="py-4 px-4 font-normal text-[#757575] text-xs w-[100px]">
              Due Date
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((property, index) => (
            <tr key={`property-${index}`}>
              {/* Property Name Cell */}
              <td className="py-4 pr-4 text-dark text-sm max-w-[240px] truncate">
                <div className="flex items-center">
                  <div className="w-10 h-10 mr-3 overflow-hidden rounded-[15px] shrink-0 bg-gray-100">
                    <img
                      src={property.imageUrl || "/default-property-image.jpg"}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-[350] truncate mb-[12px]">
                      {property.name}
                    </div>
                    <div className="font-[325] text-[#757575] text-xs truncate flex">
                      <img src={"/location.svg"} className="mr-1" />{" "}
                      {property.location}
                    </div>
                  </div>
                </div>
              </td>

              {/* Price Cell */}
              <td className="py-4 px-4 font-[325] text-dark text-sm max-w-[120px] truncate">
                {property.price}
              </td>

              {/* Amount Paid Cell */}
              <td className="py-4 px-4 font-[325] text-dark text-sm max-w-[120px] truncate">
                {property.Amount_Paid}
              </td>

              {/* Amount Left Cell */}
              <td className="py-4 px-4 font-[325] text-dark text-sm max-w-[120px] truncate">
                {property.Amount_Left}
              </td>

              {/* Duration Cell */}
              <td className="py-4 px-4 font-[325] text-dark text-sm max-w-[100px] truncate">
                {property.Duration}
              </td>

              {/* Due Date Cell */}
              <td className="py-4 px-4 font-[325] text-dark text-sm max-w-[100px] truncate">
                {property.Due_Date}
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
             </div></>
  );
}
