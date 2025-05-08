import React, { useState } from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function DashboardHeader({
  title = "Properties",
  subtitle = "Super Admin",
  searchPlaceholder = "Search",
  buttonText = "Add Property",
  onButtonClick
}: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="w-full  flex-col lg:flex-row justify-between items-start gap-4 p-4 sm:p-6 md:pt-16 md:pb-8 md:px-8 lg:pr-[68px] lg:pl-[38px]  flex overflow-hidden">
      {/* Title Section */}
      <div className="w-full sm:w-auto -4 sm:mb-0  md:ml-0   ml-10">
        <h2 className=" font-light text-2xl sm:text-3xl md:text-[34px] leading-tight text-dark mb-2 text-ri">
          {title}
        </h2>
        <div className="flex items-center leading-tight font-light text-sm md:text-base text-dark">
          <img src='/batch.svg' alt="Badge" className="h-4 w-4 mr-2" />
          {subtitle}
        </div>
      </div>

     {/* Search and Button Container */}
     <div className="w-full lg:w-auto flex flex-row lg:flex-row items-center gap-4 mt-4 sm:mt-0">
        {/* Search Input */}
        <div className={`relative h-[51px] w-full sm:w-64 md:w-80 lg:w-[410px] flex-3/4 rounded-full border transition-all ${
          isSearchFocused ? "border-[#79B833] shadow-sm" : "border-[#D8D8D8]"
        } bg-white overflow-hidden`}>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full h-full px-6 py-3 border-none bg-transparent text-[#878787] text-sm font-normal focus:outline-none placeholder:text-[#878787]"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>

        {/* Action Button */}
        <button 
          className="bg-[#79B833] text-white text-sm font-bold rounded-full w-full sm:w-auto py-3 px-6 md:px-10 hover:bg-[#6aa22c] transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center flex-1/4"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}