import React from "react";
import Pagination from "../../components/Pagination";

export interface PropertyData {
  name: string;
  location: string;
  price: string;
  totalRequests: number;
  pendingRequests: number;
  imageUrl: string;
}

interface PropertyTableProps {
  data: PropertyData[];
}

export default function PropertyTableComponent({ data }: PropertyTableProps) {
  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="text-left">
                <th className="py-4 pr-6  font-[325]   text-[#757575] text-xs w-[300px]">
                  Property Name
                </th>
                <th className="py-4 px-6  font-[325]   text-[#757575] text-xs w-[140px]">
                  Price
                </th>
                <th className="py-4 px-6  font-[325]   text-[#757575] text-xs w-[130px]">
                  Total Requests
                </th>
                <th className="py-4 px-6  font-[325]   text-[#757575] text-xs w-[140px]">
                  Pending Requests
                </th>
                <th className="py-4 pl-4  font-[325]   text-[#757575] text-xs w-[120px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((property, index) => (
                <tr key={`property-${index}`} className="">
                  <td className="py-4 pr-6 text-dark text-sm max-w-[300px]">
                    <div className="flex items-center">
                    <div className="w-10 h-10 mr-3 overflow-hidden rounded-[15px] shrink-0 bg-gray-100">
                    <img 
                      src={property.imageUrl || '/default-property-image.jpg'} 
                      alt={property.name} 
                      className="w-full h-full object-cover"
                     
                    />
                  </div>
                      <div className="min-w-0">
                        <div className="font-medium text-base truncate mb-1">
                          {property.name}
                        </div>
                        <div className="flex items-center text-[#757575] text-sm truncate">
                        <img src={'/location.svg'} className="mr-1"/>
                          {property.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6  font-[325]   text-dark text-sm truncate max-w-[140px]">
                    {property.price}
                  </td>
                  <td className="py-4 px-6  font-[325]   text-dark text-sm truncate max-w-[130px]">
                    {property.totalRequests}
                  </td>
                  <td className="py-4 px-6  font-[325]   text-dark text-sm truncate max-w-[140px]">
                    {property.pendingRequests}
                  </td>
                  <td className="py-4  text-sm">
                    <button
                      className="bg-[#272727] text-white px-4 py-2 rounded-full xl:text-xs  text-xs font-[350] hover:bg-gray-800 transition-colors"
                      aria-label="View requests"
                    >
                      View Requests
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full">
        <Pagination />
      </div>
    </>
  );
}
