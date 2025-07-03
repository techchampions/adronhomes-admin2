import React from 'react';
import { IoCaretBack, IoCaretForward } from 'react-icons/io5';
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
}

export interface PaginationProps {
  pagination: Pagination;
  onPageChange: (page: any) => void;
  className?: string;
}
const Pagination: React.FC<PaginationProps> = ({ 
  pagination, 
  onPageChange,
  className = ''
}) => {
  const { currentPage, totalPages } = pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    onPageChange(newPage);
  };
const renderPageIndicators = () => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        className={`w-8 h-8 rounded-full flex justify-center items-center text-sm ${
          page === currentPage 
            ? 'bg-primary text-white' 
            : 'bg-transparent text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </button>
    ));
  }

  let pages = [];
  // Always show first page
  pages.push(1);
  
  // Calculate middle pages
  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);
  
  // Add ellipsis if needed
  if (start > 2) pages.push('...');
  
  // Add middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  // Add ellipsis if needed
  if (end < totalPages - 1) pages.push('...');
  
  // Always show last page
  if (totalPages > 1) pages.push(totalPages);

  return pages.map((page, index) => (
    typeof page === 'number' ? (
      <button
        key={page}
        className={`w-8 h-8 rounded-full flex justify-center items-center text-sm ${
          page === currentPage 
            ? 'bg-primary text-white' 
            : 'bg-transparent text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </button>
    ) : (
      <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center">
        ...
      </span>
    )
  ));
};
  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
      <button
        className={`rounded-full w-8 h-8 border border-gray-200 flex justify-center items-center ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'
        }`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <IoCaretBack className="text-gray-500" />
      </button>
      
      <div className="flex gap-1">
        {renderPageIndicators()}
      </div>
      
      <button
        className={`rounded-full w-8 h-8 border border-gray-200 flex justify-center items-center ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <IoCaretForward className="text-gray-500" />
      </button>
    </div>
  );
};

export default Pagination;