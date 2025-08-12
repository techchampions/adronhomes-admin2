import React from "react";
import { IoCaretForwardSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const websiteSettings = [
  {
    title: "Slider",
    slug: "sliders",
    description: "Manage the content on the homepage slider",
  },
  {
    title: "Pages Headers",
    slug: "page-headers",
    description: "Manage page headers",
  },
  {
    title: "Site Information",
    slug: "site-information",
    description: "Manage site information",
  },
  {
    title: "Office Locations",
    slug: "office-locations",
    description: "Update office locations",
  },
  {
    title: "Leadership",
    slug: "leadership",
    description: "Manage leadership information",
  },
  {
    title: "Testimonials",
    slug: "testimonials",
    description: "Manage Testmonials",
  },
  {
    title: "Frequently Asked Questions",
    slug: "faqs",
    description: "Manage FAQs",
  },
];

const paymentSettings = [
  // {
  //   title: "Add Payment Method",
  //   description: "Click to add a new payment method",
  //   slug: "add-payment",
  // },
  {
    title: "Add Account Details",
    description: "Click to add a bank account details",
    slug: "add-account",
  },
];

export default function CardTwo() {
  const navigate = useNavigate();
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
            className={`pl-4 cursor-pointer md:pl-6 pr-6 md:pr-[36px] py-4 md:py-[18px] rounded-2xl md:rounded-[30px] ${
              index % 2 === 1 ? "bg-[#F5F5F5]" : ""
            }`}
            onClick={() => navigate(`${item.slug}`)}
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
            className={`cursor-pointer pl-4 md:pl-6 pr-6 md:pr-[36px] py-4 md:py-[18px] rounded-2xl md:rounded-[30px] ${
              index % 2 === 1 ? "bg-[#F5F5F5]" : ""
            }`}
            onClick={() => navigate(`${item.slug}`)}
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
