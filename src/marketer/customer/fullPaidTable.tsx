import React, { useState } from "react";

const CustomersTableFullyPaid = () => {
  // Sample data from the image
  const sampleData = [
    {
      id: 1,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
    },
    {
      id: 2,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
    },
    {
      id: 3,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
    },
    {
      id: 4,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
    },
    {
      id: 5,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
    },
    {
      id: 6,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
    },
    {
      id: 7,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
    },
    {
      id: 8,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
    },
    {
      id: 9,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
    },
    {
      id: 10,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
    },
    {
      id: 11,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
    },
    {
      id: 12,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
    },
    {
      id: 13,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2Baruwa Estate DuluxBaruwa Estate DuluxBaruwa Estate DuluxBaruwa Estate DuluxBaruwa Estate Duluxvgiubhinjk;lm',,;kmnjbhvgkjbnlm...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
    },
    {
      id: 14,
      name: "Sarah Mka",
      property: "Baruwa Estate Duluxe 2...",
      dateStarted: "19.07.2025",
      dateFinished: "19.07.2025",
      totalAmount: "₦300,000,000,000",
      duration: "8 Months"
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
                  Property
                </th>
                <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                  Date Started
                </th>
                <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                  Date Finished
                </th>
                <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                  Total Amount
                </th>
                <th className="pb-6 font-[325] text-[#757575] whitespace-nowrap text-[12px]">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row) => (
                <tr key={row.id} className="cursor-pointer">
                  <td className="pr-6 max-w-[130px]">
                    <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">{row.name ?? 'N/A'}</div>
                  </td>
                  <td className="max-w-[200px] pr-6">
                    <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">{row.property ?? 'N/A'}</div>
                  </td>
                  <td className="pr-6 max-w-[130px]">
                    <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">{row.dateStarted ?? 'N/A'}</div>
                  </td>
                  <td className="pr-6 max-w-[130px]">
                    <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">{row.dateFinished ?? 'N/A'}</div>
                  </td>
                  <td className="pr-6 max-w-[130px]">
                    <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">{row.totalAmount ?? 'N/A'}</div>
                  </td>
                  <td className=" max-w-[130px]">
                    <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">{row.duration ?? 'N/A'}</div>
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

export default CustomersTableFullyPaid;