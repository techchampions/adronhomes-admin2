import React from "react";
import { IoCaretForwardSharp } from "react-icons/io5";

const websiteSettings = [
  {
    title: "Slider",
    description: "Manage the content on the homepage slider",
  },
  {
    title: "Pages Headers",
    description: "Manage page headers",
  },
  {
    title: "Site Information",
    description: "Manage site information",
  },
  {
    title: "Office Locations",
    description: "Update office locations",
  },
  {
    title: "Leadership",
    description: "Manage leadership information",
  },
];

const paymentSettings = [
  {
    title: "Add Payment Method",
    description: "Click to add a new payment method",
  },
  {
    title: "Add Account Details",
    description: "Click to add a bank account details",
  },
];

export default function CardTwo() {
  return (
    <div className="bg-white rounded-2xl md:rounded-[30px] px-4 md:px-[23px] py-6 md:py-[38px]">
      {/* Website Settings section */}
      <p className="font-bold text-base text-dark mb-4 md:mb-[18px] pl-4 md:pl-6">
        Website Settings
      </p>
      <div className="space-y-2 md:space-y-[10px] mb-8 md:mb-[50px]">
        {websiteSettings.map((item, index) => (
          <div
            key={index}
            className={`pl-4 md:pl-6 pr-6 md:pr-[36px] py-4 md:py-[18px] rounded-2xl md:rounded-[30px] ${
              index % 2 === 1 ? "bg-[#F5F5F5]" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium md:font-[325] text-base">
                  {item.title}
                </p>
                <p className="font-medium md:font-[325] text-sm text-[#767676] mt-1">
                  {item.description}
                </p>
              </div>
              <IoCaretForwardSharp className="mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Payment Settings section */}
      <p className="font-bold text-base text-dark mb-4 md:mb-[18px] pl-4 md:pl-6">
        Payment Settings
      </p>
      <div className="space-y-2 md:space-y-[10px] mb-8 md:mb-[50px]">
        {paymentSettings.map((item, index) => (
          <div
            key={index}
            className={`pl-4 md:pl-6 pr-6 md:pr-[36px] py-4 md:py-[18px] rounded-2xl md:rounded-[30px] ${
              index % 2 === 1 ? "bg-[#F5F5F5]" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium md:font-[325] text-base">
                  {item.title}
                </p>
                <p className="font-medium md:font-[325] text-sm text-[#767676] mt-1">
                  {item.description}
                </p>
              </div>
              <IoCaretForwardSharp className="mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}