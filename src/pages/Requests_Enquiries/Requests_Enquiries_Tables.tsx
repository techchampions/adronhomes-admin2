import React from "react";
import { PropertyRequest } from "../Properties/types/PropertyRequestTypes";
import { formatToNaira } from "../../utils/formatcurrency";
import { useNavigate } from "react-router-dom";

interface PropertyTableProps {
  data: PropertyRequest[];
}

export default function PropertyTableComponent({ data }: PropertyTableProps) {
  const navigate = useNavigate();
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
                <th className="py-4 px-2  font-[325]   text-[#757575] text-xs w-[140px]">
                  Price
                </th>
                <th className="py-4 px-2  font-[325]   text-[#757575] text-xs w-[140px]">
                  Total Requests
                </th>
                <th className="py-4 px-2  font-[325]   text-[#757575] text-xs w-[140px]">
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
                          src={"/default-property-image.jpg"}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate mb-1">
                          {property.name}
                        </div>
                        <div className="flex items-center text-[#757575] text-sm truncate">
                          <img src={"/location.svg"} className="mr-1" />
                          {property.lga} {property.state}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 font-[325] text-dark text-sm truncate max-w-[140px]">
                    {formatToNaira(property.price)}
                  </td>
                  <td className="py-4 px-2 font-[325] text-dark text-sm truncate max-w-[130px]">
                    {property.total_requests}
                  </td>
                  <td className="py-4 px-2 font-[325] text-dark text-sm truncate max-w-[140px]">
                    {property.total_pending_requests}
                  </td>
                  <td className="py-4  text-sm">
                    <button
                      onClick={() =>
                        navigate(`/requests-enquiries/${property.id}`)
                      }
                      className="bg-[#272727] cursor-pointer text-white px-4 py-2 rounded-full xl:text-xs  text-xs font-[350] hover:bg-gray-800 transition-colors"
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
    </>
  );
}
