import React from "react";
import Pagination from "../../../components/Pagination";

export interface PropertyData {
  name: string;
  location: string;
  price: string;
  type: string;
  days: number;
  units: number;
  imageUrl: string; // Added imageUrl to the interface
}

interface PropertyTableProps {
  data: PropertyData[];
}

export default function PropertyTableComponent({ data }: PropertyTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="text-left">
            <th className="py-4    pr-6  font-normal  text-[#757575] text-xs w-[220px]">
              Property Name
            </th>
            <th className="py-4    px-6  font-normal  text-[#757575] text-xs w-[120px]">
              Price
            </th>
            <th className="py-4    px-6  font-normal  text-[#757575] text-xs w-[100px]">
              Property Type
            </th>
            <th className="py-4    px-6  font-normal  text-[#757575] text-xs w-[80px]">
              Views
            </th>
            <th className="py-4    px-6  font-normal  text-[#757575] text-xs w-[80px]">
              Units
            </th>
            <th className="py-4 pl-4 font-normal  text-[#757575] text-xs w-[100px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((property, index) => (
            <tr 
              key={`property-${index}`} 
              className=""
            >
              <td className="py-4    pr-6  text-dark text-sm max-w-[220px]">
                <div className="flex items-center">
                  <div className="w-10 h-10 mr-3 overflow-hidden rounded-[15px] shrink-0 bg-gray-100">
                    <img 
                      src={property.imageUrl || '/default-property-image.jpg'} 
                      alt={property.name} 
                      className="w-full h-full object-cover"
                     
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-[350] truncate  mb-[12px]">{property.name}</div>
                    <div className="font-[325]  text-[#757575] text-xs truncate flex">
                     <img src={'/location.svg'} className="mr-1"/> {property.location}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4    px-6  font-[325] text-dark text-sm truncate max-w-[120px]">
                {property.price}
              </td>
              <td className="py-4    px-6  font-[325] text-dark text-sm truncate max-w-[100px]">
                {property.type}
              </td>
              <td className="py-4    px-6  font-[325] text-dark text-sm truncate max-w-[80px]">
                {property.days}
              </td>
              <td className="py-4    px-6  font-[325] text-dark text-sm truncate max-w-[80px]">
                {property.units}
              </td>
              <td className="py-4 pl-4 text-sm">
                <div className="flex space-x-2">
                  <button 
                    // className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label="Edit property"
                  >
                    <img src="/ic_round-edit.svg" className="w-[18px] h-[18px]"/>
                  </button>
                  <button 
                    // className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                    aria-label="Delete property"
                  >
                     <img src="mingcute_delete-fill.svg"  className="w-[18px] h-[18px]"/>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
}