import React, { useState } from "react";

const CustomersTableAll = () => {
  // Sample data from the image
  const sampleData = [
    {
      id: 1,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    },
    {
      id: 2,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    },
    {
      id: 3,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    },
    {
      id: 4,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    },
    {
      id: 5,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    },
    {
      id: 6,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    },
    {
      id: 7,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    },
    {
      id: 8,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    },
    {
      id: 9,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    },
    {
      id: 10,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    },
    {
      id: 11,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    },
    {
      id: 12,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    },
    {
      id: 13,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    },
    {
      id: 14,
      name: "Sarah Mka",
      dateJoined: "19.07.2025",
      propertyPlans: 3,
      savedProperties: 4,
      phoneNumber: "08094563678"
    }
  ];



        


  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                  Customer's Name
                </th>
                <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                  Date Joined
                </th>
                <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                  Property Plans
                </th>
                <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                  Saved Properties
                </th>
                <th className="pb-6 font-[325] text-[#757575] whitespace-nowrap text-[12px]">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row) => (
                <tr key={row.id} className="cursor-pointer">
                  <td className="pr-6 max-w-[130px]">
                    <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                      {row.name ?? "N/A"}
                    </div>
                  </td>
                  <td className="max-w-[130px] pr-6">
                    <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                      {row.dateJoined ?? "N/A"}
                    </div>
                  </td>
                  <td className="pr-6 max-w-[130px]">
                    <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                      {row.propertyPlans ?? "N/A"}
                    </div>
                  </td>
                  <td className="pr-6 max-w-[130px]">
                    <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                      {row.savedProperties ?? "N/A"}
                    </div>
                  </td>
                  <td className="pr-6 max-w-[130px]">
                    <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                      {row.phoneNumber ?? "N/A"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CustomersTableAll;