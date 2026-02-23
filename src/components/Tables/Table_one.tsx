import React, { ReactNode, useState, useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { FiRotateCcw } from "react-icons/fi";

// Define the SortOption interface
interface SortOption {
  value: any;
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
  onReset?: () => void; // New prop for reset functionality
  sort?: boolean;
  showTabs?: boolean;
  showSearchandSort?: boolean;
  showResetButton?: boolean; // Control reset button visibility
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
  onReset,
  sort = false,
  showTabs = true,
  showSearchandSort = true,
  showResetButton = true,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<SortOption>(
    sortOptions.find((opt) => opt.value === defaultSort) || sortOptions[0],
  );
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [originalValues] = useState({
    search: "",
    sort:
      sortOptions.find((opt) => opt.value === defaultSort) || sortOptions[0],
  });

  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabClick = (tab: string) => {
    onTabChange?.(tab);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Only trigger search immediately if we want backward compatibility
    // But we're changing to button-triggered search
  };

  const handleSearchSubmit = () => {
    onSearch?.(searchQuery.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch?.(""); // reset results when cleared
  };

  const handleReset = () => {
    // Reset search query
    setSearchQuery(originalValues.search);

    // Reset sort to original
    setSelectedSort(originalValues.sort);

    // Trigger onSearch with empty string to show original data
    onSearch?.(originalValues.search);

    // Trigger onSortChange with original sort value
    onSortChange?.(originalValues.sort);

    // Call the onReset callback if provided
    onReset?.();

    // Close sort dropdown if open
    setIsSortOpen(false);
  };

  const handleSortSelect = (option: SortOption) => {
    setSelectedSort(option);
    setIsSortOpen(false);
    onSortChange?.(option);
  };

  // Check if current state differs from original
  const hasChanges = () => {
    return (
      searchQuery !== originalValues.search ||
      selectedSort.value !== originalValues.sort.value
    );
  };

  return (
    <div className="bg-white rounded-[30px] w-full pt-[20px] lg:pt-[30px] pb-[20px] lg:pl-[43px] lg:pr-[61px] pl-[15px] pr-[15px]">
      {/* Header */}
      <div className="w-full flex lg:flex-row items-start lg:items-center pb-[20px] lg:pb-[30px] justify-between gap-4 lg:gap-0 flex-col-reverse">
        {/* Tabs - Conditionally rendered */}
        {showTabs && (
          <div className="flex w-full overflow-x-auto flex-nowrap gap-[10px] lg:gap-[20px] pb-2 lg:pb-0 scrollbar- scrollbar-thumb-gray-300 scrollbar-hide">
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
        {showSearchandSort && (
          <div className="flex w-full lg:flex-row gap-3 lg:gap-[20px] lg:w-auto justify-between items-center">
            {/* Search */}
            <div className="relative h-[39px] w-full lg:w-[296px] rounded-[40px] bg-[#F6F6F8] overflow-hidden flex items-center">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="w-full h-full italic px-[40px] py-0 border-none bg-transparent text-[#757575] text-[14px] font-[400] focus:outline-none placeholder:text-[#878787]"
              />
              <div className="absolute top-3 left-3 text-[#757575]">
                <IoSearch />
              </div>

              {/* Clear button - only shows when there's text */}
              {searchQuery && (
                <button
                  onClick={handleClear}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#272727] transition-colors "
                  title="Clear search"
                >
                  <MdClose size={16} />
                </button>
              )}

              {/* Search button */}
             {searchQuery && ( <button
                onClick={handleSearchSubmit}
                className="absolute items-center z-50 flex right-2 top-1/2 -translate-y-1/2 bg-[#79B833] text-white px-3 py-1 rounded-full text-xs hover:bg-[#79B833]/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!searchQuery.trim()}
              >
               <IoSearch className="mr-2" /> Go      
              </button>)}
            </div>

            {/* Sort Dropdown */}
            {sort && (
              <div
                className="w-full lg:w-auto flex-1/3 relative"
                ref={sortDropdownRef}
              >
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="
                    w-full
                    border border-[#272727]
                    rounded-full
                    flex items-center justify-between
                    px-4 py-2
                    sm:px-5 sm:py-2.5
                    md:px-6
                    text-xs sm:text-sm md:text-base
                    text-dark
                    transition-all duration-200
                    hover:bg-gray-100
                    focus:outline-none
                  "
                >
                  <span className="truncate">{selectedSort.name}</span>
                  <FaCaretDown
                    className={`
                      ml-2
                      w-4 h-4
                      sm:w-5 sm:h-5
                      transition-transform duration-200
                      ${isSortOpen ? "rotate-180" : ""}
                    `}
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
              </div>
            )}

            {/* Reset Button - Only shows when there are changes */}
            {showResetButton && hasChanges() && (
              <button
                onClick={handleReset}
                className="
                  flex items-center justify-center
                  w-9 h-9
                  rounded-full
                  bg-[#79B833]
                  text-white
                  hove:text-white
                  hover:bg-[#79B833]/60
                  transition-all duration-200
                  ml-2
                "
                title="Reset to original values"
              >
                <FiRotateCcw size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">{children}</div>
    </div>
  );
};
