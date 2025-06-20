import React, { ReactNode } from "react";
import { FaCaretDown } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

interface ReusableTableProps {
  tabs?: string[];
  activeTab: string; // Required prop to control active tab from parent
  searchPlaceholder?: string;
  sortButtonText?: string;
  children?: ReactNode;
  onTabChange?: (tab: string) => void;
  onSearch?: (query: string) => void;
  sort?: boolean; // New prop to control visibility of search and sort
}

export const ReusableTable: React.FC<ReusableTableProps> = ({
  tabs = ["All", "Approved", "Pending"],
  activeTab, // Controlled active tab from parent
  searchPlaceholder = "Search Payment",
  sortButtonText = "Newest",
  children,
  onTabChange,
  onSearch,
  sort = true, // Default to true for backward compatibility
}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="bg-white rounded-[30px] w-full pt-[20px] lg:pt-[30px] pb-[20px]  lg:pl-[43px]  lg:pr-[61px]  pl-[15px] pr-[15px] ">
      {/* Header */}
      <div className="w-full flex  lg:flex-row items-start lg:items-center pb-[20px] lg:pb-[30px] justify-between gap-4 lg:gap-0 flex-col-reverse">
        {/* Tabs */}
        <div className="flex space-x-[10px] lg:space-x-[20px]  pr-4 w-full lg:w-auto pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`font-gotham text-[14px] lg:text-[16px] leading-[100%] tracking-[0%] cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? "text-dark  font-bold"
                  : "text-[#767676]  font-[325]"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Sort - Conditionally rendered */}
        {sort && (
          <div className="flex   w-full  lg:flex-row gap-3 lg:gap-[100px]  lg:w-auto justify-between">
            {/* Search */}
            <div className="relative h-[39px] w-full lg:w-[296px] rounded-[40px] bg-[#F6F6F8] overflow-hidden flex-2/3">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full h-full px-[40px] py-0 border-none bg-transparent text-[#757575] text-[14px] font-[400] focus:outline-none placeholder:text-[#878787]"
              />
              <div className="absolute top-3 left-3 text-[#757575]">
                <IoSearch />
              </div>
            </div>

            {/* Sort Button */}
            <div className="w-full lg:w-auto flex-1/3">
              <button className=" lg:w-[130px] h-[42px] py-[13px] pr-[17px] pl-[20px] border border-[#272727] rounded-[50px] flex justify-center items-center text-sm text-dark">
                {sortButtonText}{" "}
                <FaCaretDown className="w-[20px] h-[20px] ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Body - Customizable through children prop */}
      <div className="w-full overflow-x-auto">{children}</div>
    </div>
  );
};
