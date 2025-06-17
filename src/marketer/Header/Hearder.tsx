"use client";

import { useState } from "react";
import { BiCopy } from "react-icons/bi";

interface HeaderProps {
  searchPlaceholder?: string;
  copyCode?: string;
  Name?: string;
  role?: string;
}

export default function Header({
  searchPlaceholder = "Search",
  copyCode = "UDHFJK4748",
  Name = "Mike Wellington",
  role = "Marketer",
}: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(copyCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <header className="w-full flex-col lg:flex-row justify-between items-start gap-4 p-4 sm:p-6 md:pt-16 md:pb-8 md:px-8 lg:pr-[68px] lg:pl-[38px] flex overflow-hidden relative">
      {/* Left side - User info */}
      <div className="w-full sm:w-auto -4 sm:mb-0 lg:ml-0 ml-10">
        <h1 className="text-xl sm:text-2xl font-medium text-gray-900">
          {Name}
        </h1>
        <p className="text-sm text-gray-600">{role}</p>
      </div>

      {/* Center - Search bar */}
      <div
        className={`relative flex items-center w-full sm:w-64 md:w-80 h-10 sm:h-12 px-4 rounded-full border transition-all order-3 sm:order-none ${
          isSearchFocused ? "border-[#79B833] shadow-sm" : "border-[#D8D8D8]"
        } bg-gray-50`}
      >
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full h-full bg-transparent text-gray-700 text-sm focus:outline-none placeholder:text-gray-500"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </div>

      {/* Right side - Copy code */}
      <div
        className="w-full sm:w-auto -4 sm:mb-0 lg:ml-0 ml-10"
        onClick={handleCopyCode}
      >
        <div className="flex items-center gap-2">
          <BiCopy className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">
            {isCopied ? "Copied!" : `Copy ${copyCode}`}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{"Marketer's Code"}</p>
      </div>
    </header>
  );
}
