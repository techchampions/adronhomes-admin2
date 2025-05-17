import React, { ReactNode } from "react";

interface ForPropertiesProps {
  tab: string;
  children: ReactNode;
}

export default function ForProperties({ tab, children }: ForPropertiesProps) {
  return (
    <div className="bg-white rounded-[30px] w-full pt-[20px] md:pb-[42px] pb-[20px] lg:pt-[34px]  lg:pl-[42px]  lg:pr-[42px]  pl-[15px] pr-[15px] ">
      <div className="flex space-x-[10px] lg:space-x-[20px]  w-full lg:w-auto md:mb-[30px] mb-2 lg:pb-0">
        <button
          className="font-gotham text-[14px] lg:text-[16px] leading-[100%] tracking-[0%] cursor-pointer whitespace-nowrap text-dark font-bold"
        >
          {tab}
        </button>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
