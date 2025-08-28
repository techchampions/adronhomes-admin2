import React, { ReactNode, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

// Define the SortOption interface
interface SortOption {
  value: number;
  name: string;
}

interface ReusableTableProps {
  tabs?: string[];
  activeTab: string;
  searchPlaceholder?: string;
  sortOptions?: SortOption[];
  defaultSort?: number; // now refers to value
  children?: ReactNode;
  onTabChange?: (tab: string) => void;
  onSearch?: (query: string) => void;
  onSortChange?: (sortOption: SortOption) => void;
  sort?: boolean;
  // New prop to control visibility of tabs
  showTabs?: boolean;
}

export const ReusableTable: React.FC<ReusableTableProps> = ({
  tabs = ["All", "Approved", "Pending"],
  activeTab,
  searchPlaceholder = "Search Payment",
  sortOptions = [
    { value: 1, name: "Newest" },
    { value: 2, name: "Oldest" },
  ],
  defaultSort = 1,
  children,
  onTabChange,
  onSearch,
  onSortChange,
  sort = true,
  // Set default to true so it displays by default
  showTabs = true,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<SortOption>(
    sortOptions.find((opt) => opt.value === defaultSort) || sortOptions[0]
  );
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);

  const handleTabClick = (tab: string) => {
    onTabChange?.(tab);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleSortSelect = (option: SortOption) => {
    setSelectedSort(option);
    setIsSortOpen(false);
    onSortChange?.(option);
  };

  return (
    <div className="bg-white rounded-[30px] w-full pt-[20px] lg:pt-[30px] pb-[20px] lg:pl-[43px] lg:pr-[61px] pl-[15px] pr-[15px]">
      {/* Header */}
      <div className="w-full flex lg:flex-row items-start lg:items-center pb-[20px] lg:pb-[30px] justify-between gap-4 lg:gap-0 flex-col-reverse">
        {/* Tabs - Conditionally rendered */}
        {showTabs && (
          <div className="flex w-full overflow-x-auto flex-nowrap gap-[10px] lg:gap-[20px] pb-2 lg:pb-0 scrollbar-thin scrollbar-thumb-gray-300">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`font-gotham text-[14px] lg:text-[16px] leading-[100%] tracking-[0%] cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? "text-dark font-bold"
                    : "text-[#767676] font-[325]"
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Search and Sort - Conditionally rendered */}
      
          <div className="flex w-full lg:flex-row gap-3 lg:gap-[100px] lg:w-auto justify-between">
            {/* Search */}
            <div className="relative h-[39px] w-full lg:w-[296px] rounded-[40px] bg-[#F6F6F8] overflow-hidden flex-2/3">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full h-full italic px-[40px] py-0 border-none bg-transparent text-[#757575] text-[14px] font-[400] focus:outline-none placeholder:text-[#878787]"
              />
              <div className="absolute top-3 left-3 text-[#757575]">
                <IoSearch />
              </div>
            </div>

            {/* Sort Dropdown */}
              {sort && (
            <div className="w-full lg:w-auto flex-1/3 relative">
              <button
                className="lg:w-[130px] h-[42px] py-[13px] pr-[17px] pl-[20px] border border-[#272727] rounded-[50px] flex justify-center items-center text-sm text-dark"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                {selectedSort.name}
                <FaCaretDown
                  className={`w-[20px] h-[20px] ml-2 transition-transform ${
                    isSortOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {isSortOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        selectedSort.value === option.value
                          ? "bg-gray-100 font-medium"
                          : ""
                      }`}
                      onClick={() => handleSortSelect(option)}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>     )}
          </div>
   
      </div>

      <div className="w-full overflow-x-auto">{children}</div>
    </div>
  );
};
