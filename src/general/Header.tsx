import React, { useState } from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function Header({
  title = "Properties",
  subtitle = "Manage the list of properties",
  searchPlaceholder = "Search",
  buttonText = "Add Property",
  onButtonClick
}: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-4 p-4 sm:p-6 md:pt-16 md:pb-8  px-[38px] md:px-[38px] lg:px-[38px] flex-wrap overflow-hidden">
      {/* Title Section */}
      <div className="w-full sm:w-auto">
        <h1 className="font-gotham font-light text-2xl sm:text-3xl md:text-[34px] leading-tight text-dark mb-1 md:mb-2">
          {title}
        </h1>
        <p className="leading-tight font-light text-sm md:text-base text-[#767676]">
          {subtitle}
        </p>
      </div>

      {/* Search and Button Container */}
      <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
        {/* Search Input */}
        <div className={`relative h-[51px] w-full sm:w-64 md:w-80 lg:w-[410px] rounded-full border transition-all ${
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
          className="bg-[#79B833] text-white text-sm font-bold rounded-full w-full sm:w-auto py-3 px-6 md:px-10 hover:bg-[#6aa22c] transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}