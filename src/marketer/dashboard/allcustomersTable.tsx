import React, { useState } from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import Pagination from "../../components/Pagination";

const CustomersTableAll = () => {
  // Data extracted from the image
  const customerData = [
    {
      id: "1",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    },
    {
      id: "2",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    },
    {
      id: "3",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    },
    {
      id: "4",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    },
    {
      id: "5",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    },
    {
      id: "6",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    },
    {
      id: "7",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    },
    {
      id: "8",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    },
    {
      id: "9",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    },
    {
      id: "10",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    },
    {
      id: "11",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    },
    {
      id: "12",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    },
    {
      id: "13",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    },
    {
      id: "14",
      name: "Sarah Mka",
      marketer: "Mikel Otega",
      dateJoined: "19.07.2025",
      propertyPlans: "3",
      savedProperties: "4",
      phoneNumber: "08094563678"
    }
  ];

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(customerData.length / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = customerData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };



    
  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left ">
                <th className="pb-6 font-[325] text-[#757575]  pr-6 whitespace-nowrap text-[12px] ">
                  Customer's Name
                </th>
                <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowra text-[12px]">
                  Marketer in Charge
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
                <th className="pb-6 font-[325] text-[#757575]  whitespace-nowrap text-[12px]">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row) => (
                <tr key={row.id} className="cursor-pointer">
                  <td className="pb-8 font-[325]  text-dark text-sm max-w-xs truncate whitespace-nowrap">
                    {row.name}
                  </td>
                  <td className="pb-8 font-[350]  text-dark text-sm max-w-xs truncate whitespace-nowrap">
                    {row.marketer}
                  </td>
                  <td className="pb-8 font-[325]  text-dark text-sm max-w-xs truncate whitespace-nowrap">
                    {row.dateJoined}
                  </td>
                  <td className="pb-8 font-[325]  text-dark text-sm whitespace-nowrap">
                    {row.propertyPlans}
                  </td>
                  <td className="pb-8 font-[325]  text-dark text-sm whitespace-nowrap">
                    {row.savedProperties}
                  </td>
                  <td className="pb-8 font-[325]  text-dark text-sm max-w-xs truncate whitespace-nowrap">
                    {row.phoneNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination />
    </div>
  );
};

export default CustomersTableAll