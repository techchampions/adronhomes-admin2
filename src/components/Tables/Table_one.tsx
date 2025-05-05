import React, { ReactNode } from 'react'
import { FaCaretDown } from 'react-icons/fa'
import { IoSearch } from 'react-icons/io5'

interface ReusableTableProps {
  tabs?: string[]
  activeTab: string // Required prop to control active tab from parent
  searchPlaceholder?: string
  sortButtonText?: string
  children?: ReactNode
  onTabChange?: (tab: string) => void
  onSearch?: (query: string) => void
}

export const ReusableTable: React.FC<ReusableTableProps> = ({
  tabs = ['All', 'Approved', 'Pending'],
  activeTab, // Controlled active tab from parent
  searchPlaceholder = 'Search Payment',
  sortButtonText = 'Newest',
  children,
  onTabChange,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>('')

  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <div className='bg-white rounded-[30px] max-w-[1] pt-[30px] pl-[43px] pr-[61px]'>
      {/* Header */}
      <div className='w-full flex items-center pb-[30px] justify-between '>
        {/* Tabs */}
        <div className='flex space-x-[20px]'>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`font-gotham font-[325] text-[16px] leading-[100%] tracking-[0%] cursor-pointer ${
                activeTab === tab ? 'text-dark' : 'text-[#767676]'
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Search and Sort */}
        <div className='flex space-x-[100px] justify-between '>
          {/* Search */}
          <div className="relative h-[39px] w-[296px] rounded-[40px] bg-[#F6F6F8] overflow-hidden">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-full px-[40px] py-0 border-none bg-transparent text-[#757575] text-[14px] font-[400] focus:outline-none placeholder:text-[#878787]"
            />
            <div className='absolute top-3 left-3 text-[#757575]'>
              <IoSearch />
            </div>
          </div>
          
          {/* Sort Button */}
          <div>
            <button className='w-[130px] h-[42px] py-[13px] pr-[17px] pl-[20px] border border-[#272727] rounded-[50px] flex justify-center items-center text-sm text-dark'>
              {sortButtonText} <FaCaretDown className='w-[20px] h-[20px] ml-2'/>
            </button>
          </div>
        </div>
      </div>
      
      {/* Table Body - Customizable through children prop */}
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}