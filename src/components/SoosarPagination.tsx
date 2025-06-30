import React from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasPrev: boolean;
  hasNext: boolean;
  className?: string;
}

const SoosarPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasPrev,
  hasNext,
  className = "",
}) => {
  const handlePrev = () => {
    if (hasPrev) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (hasNext) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center mx-auto gap-3 justify-center mt-10">
      <button
        className={`border border-gray-300 rounded-full p-2 cursor-pointer ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gray-700"
        }`}
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        <IoArrowBack />
      </button>
      {/* <div className="text-sm">
        Page {page} of {totalPages}
      </div> */}
      <div className="flex gap-1 items-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={`cursor-pointer h-5 w-5 text-xs flex flex-col items-center justify-center rounded-full ${
              currentPage === i + 1
                ? "bg-gray-500 text-white"
                : "hover:bg-gray-200 border border-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        className={`border border-gray-300 rounded-full p-2 cursor-pointer ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gray-700"
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <IoArrowForward />
      </button>
    </div>
  );
};

export default SoosarPagination;
