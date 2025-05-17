// BulkSelectModal.tsx
import React from "react";

interface BulkSelectModalProps {
  onSelect: (isBulk: boolean) => void;
  onSelects: (isBulk: boolean) => void;
  onClose: () => void;
  x: any;
}

const BulkPersonnelSelectModal: React.FC<BulkSelectModalProps> = ({
  onSelect,
  onClose,
  onSelects,
  x,
}) => {
  return (
    <div className="fixed inset-0 bg-[#17191CBA] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] md:rounded-[30px] p-4 md:p-6 w-full max-w-md md:max-w-xl relative">
        <p
          className="absolute top-4 right-4 md:top-6 md:right-6 cursor-pointer text-lg md:text-base"
          onClick={() => {
            x();
          }}
        >
          ×
        </p>
        <h2 className="text-xl md:text-2xl font-[350] mb-1 md:mb-2 text-dark">
          Create Personnel
        </h2>
        <p className="mb-4 md:mb-[27px] text-dark text-sm md:text-base font-[325]">
          Select how you want to add a personnel
        </p>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-5 md:space-x-[20px]">
          <button
            onClick={() => onSelects(false)}
            className="p-3 md:p-[23px] shadow rounded-[20px] md:rounded-[30px] w-full"
          >
            <div className="flex flex-col items-start">
              <img
                src="/singlep.svg"
                className="mb-3 md:mb-[21px] w-12 h-12 md:w-[68px] md:h-[68px]"
                alt="Single Property"
              />
              <p className="mb-1 md:mb-[5px] text-dark font-[350] text-sm md:text-base">
                Single Personnel
              </p>
              <h1 className="text-dark font-[325] text-xs md:text-sm text-left">
                Create a single personnel profile.
              </h1>
            </div>
          </button>
          <button
            onClick={() => onSelect(true)}
            className="p-3 md:p-[23px] shadow rounded-[20px] md:rounded-[30px] w-full"
          >
            <div className="flex flex-col items-start">
              <img
                src="/bulkp.svg"
                className="mb-3 md:mb-[21px] w-12 h-12 md:w-[68px] md:h-[68px]"
                alt="Bulk Property"
              />
              <p className="mb-1 md:mb-[5px] text-dark font-[350] text-sm md:text-base">
                Bulk Personnel
              </p>
              <h1 className="text-dark font-[325] text-xs md:text-sm text-left">
                Create multiple personnel profiles.
              </h1>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkPersonnelSelectModal;
