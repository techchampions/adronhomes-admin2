import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Import the BulkSelectModal
import BulkSelectModal from '../pages/Properties/BasicDetails/BulkSelectModal';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  buttonText?: string;
  onButtonClick?: () => void; // This might be less relevant now with the modal logic
}

export default function DashboardHeader({
  title = "Properties",
  subtitle = "Super Admin",
  searchPlaceholder = "Search",
  buttonText = "Add Property",
  onButtonClick // Retained for flexibility, but primary action now through modal
}: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCancelState, setIsCancelState] = useState(false);
  // State for controlling the BulkSelectModal visibility
  const [showBulkModal, setShowBulkModal] = useState(false);
  // State for managing if it's a bulk operation (passed to modal and used for navigation)
  const [isBulk, setIsBulk] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // --- Button Click Logic ---
  const handleButtonClick = () => {
    if (isCancelState) {
      // If in cancel state, navigate back (or to a default page) and reset cancel state
      navigate(-1); // Or navigate('/properties') if you have a specific home for properties
      setIsCancelState(false);
      setShowBulkModal(false); // Close modal if open on cancel
    } else {
      // If not in cancel state, open the BulkSelectModal
      setIsCancelState(true); // This sets the button to "Cancel" while the modal is open
      setShowBulkModal(true); // Open the modal
      // Optionally call onButtonClick if there's a general click handler for 'add'
      if (onButtonClick) {
        onButtonClick();
      }
    }
  };

  // --- Dynamic Button Text ---
  const getButtonText = () => {
    return isCancelState ? "Cancel" : buttonText;
  };

  // Function to handle closing the modal (from 'x' or backdrop click)
  const handleModalClose = () => {
    setShowBulkModal(false);
    setIsCancelState(false); // Reset cancel state when modal is closed without selection
  };

  return (
    <>
      <div className="w-full flex-col lg:flex-row justify-between items-start gap-4 p-4 sm:p-6 md:pt-16 md:pb-8 md:px-8 lg:pr-[68px] lg:pl-[38px] flex overflow-hidden">
        {/* Title Section */}
        <div className="w-full sm:w-auto sm:mb-0 md:ml-0 ml-10">
          <h2 className="font-[325] text-2xl sm:text-3xl md:text-[34px] leading-tight text-dark mb-2 max-w-md">
            {title}
          </h2>
          <div className="flex items-center leading-tight font-[350] text-sm md:text-base text-dark">
            <img src='/batch.svg' alt="Badge" className="h-4 w-4 mr-2" />
            {subtitle}
          </div>
        </div>

        {/* Search and Button Container */}
        <div className="w-full lg:w-auto flex flex-col lg:flex-row items-center gap-4 mt-4 sm:mt-0">
          {/* Search Input */}
          <div className={`relative h-[51px] w-full sm:w-64 md:w-80 lg:w-[410px] flex-3/4 rounded-full border transition-all font-[400] ${
            isSearchFocused ? "border-[#79B833] shadow-sm" : "border-[#D8D8D8]"
          } bg-white overflow-hidden`}>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full h-full px-6 py-3 border-none bg-transparent text-[#878787] text-sm font-normal focus:outline-none placeholder:text-[#878787] placeholder:font-[400]"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          {/* Action Button */}
          <button
            className={`text-white md:text-sm text-xs font-bold rounded-full w-full sm:w-auto py-3 px-6 md:px-10 transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center flex-1/4 whitespace-nowrap ${
              isCancelState ? "bg-[#D70E0E] hover:bg-red-600" : "bg-[#79B833] hover:bg-[#6aa22c]"
            }`}
            onClick={handleButtonClick}
          >
            {getButtonText()}
          </button>
        </div>
      </div>

      {/* BulkSelectModal Conditional Rendering */}
      {showBulkModal && (
        <BulkSelectModal
          onSelect={(isBulkSelected) => { // User chose 'bulk'
            navigate("/properties/form");
            setIsBulk(true); // Set local bulk state
            setShowBulkModal(false); // Close modal
            setIsCancelState(true); // Stay in cancel state while on form
          }}
          onSelects={(isBulkSelected) => { // User chose 'individual'
            navigate("/properties/form");
            setIsBulk(false); // Set local individual state
            setShowBulkModal(false); // Close modal
            setIsCancelState(true); // Stay in cancel state while on form
          }}
          onClose={handleModalClose} // Handle closing from outside/backdrop
          x={handleModalClose} // Handle closing from 'x' button
        />
      )}
    </>
  );
}