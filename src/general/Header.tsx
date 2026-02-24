import React, { useContext, useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import BulkSelectModal from "../pages/Properties/BasicDetails/BulkSelectModal";
import { PropertyContext } from "../MyContext/MyContext";
import PersonnelModal from "../pages/Personnel/createPersonnelModal";
import MassUploadModal from "../pages/Personnel/mass_upload";
import BulkPersonnelSelectModal from "../pages/Personnel/BulkPersonalSelectModal";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  history?: boolean;
  showBulkModal?: boolean;
  setShowBulkModal?: (show: boolean) => void;
  handleViewPurchaseFormClick?: () => void;
  showSearchAndButton?: boolean;
  viewForm?: boolean;
  personel?: boolean; // Add personel prop
  onPersonelButtonClick?: () => void; // Add personel button click handler
  Personnel_Text?: string;
}

export default function Header({
  title = "Properties",
  subtitle = "Manage the list of properties",
  searchPlaceholder = "Search",
  buttonText = "Add Property",
  onButtonClick,
  history = false,
  showSearchAndButton = true,
  viewForm = false,
  handleViewPurchaseFormClick,
  personel = false, // Default to false
  onPersonelButtonClick, // Personel button click handler
  Personnel_Text = "Create Personnel",
}: HeaderProps) {
  const {
    showBulkModal,
    setShowBulkModal,
    setIsBulk,
    isCancelState,
    setIsCancelState,
    showPersonnelModal,
    setPersonnelModal,
    isUserBulk,
    setIsUserBulk,
    role,
    setRole,
    isLandProperty,
    setIsLandProperty,
    resetFormData,
  } = useContext(PropertyContext)!;
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [createpersonnel, setcreatepersonnel] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isPersonnelPage = location.pathname === "/personnel";
  const isFormPage = location.pathname === "/properties/form";

  // Set cancel state based on URL when component mounts or location changes
  useEffect(() => {
    if (isFormPage) {
      setIsCancelState(true);
    } else {
      setIsCancelState(false);
    }
  }, [location.pathname, setIsCancelState]);

  const handleButtonClick = () => {
    if (onButtonClick) {
      setIsCancelState(false);
      onButtonClick();
    } else if (isCancelState || isFormPage) {
      // When in cancel state or on form page, navigate back
      navigate(isPersonnelPage ? "/personnel" : "/properties");
      setIsCancelState(false);
      resetFormData();
      setIsLandProperty(false);
    } else {
      // Normal state behavior
      if (isPersonnelPage) {
        // Personnel-specific action
        setcreatepersonnel(true);
      } else {
        // Property-specific action
        setShowBulkModal(true);
      }
    }
  };

  // Determine button text based on page and state
  const getButtonText = () => {
    if (isCancelState || isFormPage) return "Cancel";
    return isPersonnelPage ? "Create Personnel" : buttonText;
  };

  // Handle personel button click
  const handlePersonelButtonClick = () => {
    if (onPersonelButtonClick) {
      onPersonelButtonClick();
    }
  };

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row lg:flex-wrap justify-between it pt-16 pb-4 px-4 sm:p-6 md:pt-16 md:pb-8 md:px-8 lg:pr-[68px] lg:pl-[38px] relative overflow-hidden lg:overflow-visible">
        <div className="w-full sm:w-auto mb-4 sm:mb-0 lg:ml-0 ml-0 ">
          <h2 className="font-[325] text-xl sm:text-2xl md:text-3xl lg:text-[34px] leading-tight text-dark mb-2 break-words lg:break-normal">
            {title}
          </h2>
          <p className="leading-tight font-[325] text-sm md:text-base text-[#767676] break-words lg:break-normal">
            {subtitle}
          </p>
          {history && (
            <>
              <p
                onClick={() => navigate(-1)}
                className="cursor-pointer text-dark font-medium text-base lg:flex items-center mt-4 hidden"
              >
                <IoMdArrowBack className="mr-2" /> Back
              </p>
              <p
                onClick={() => navigate(-1)}
                className="cursor-pointer text-dark font-medium text-sm lg:text-base lg:hidden absolute top-4 right-4 items-center flex"
              >
                <IoMdArrowBack className="mr-1 lg:mr-2" /> Back
              </p>
            </>
          )}
        </div>

        <div className="w-full lg:w-auto flex flex-col lg:flex-row lg:flex-wrap items-center gap-3 lg:gap-4 mt-4 sm:mt-0">
          {showSearchAndButton && (
            <>
              {/* Search input is commented out as in original */}

              {/* Personel button - only shows when personel is true */}
              {personel && (
                <button
                  className="text-[#79B833] border-[#79B833] border bg-white   text-xs lg:text-sm font-bold rounded-full w-full sm:w-auto py-3 px-4 lg:px-6 md:px-10 transition-colors min-w-0 lg:min-w-[140px] sm:min-w-0 lg:sm:min-w-[185px] h-[45px] flex justify-center items-center whitespace-nowrap order-first lg:order-none mb-2 lg:mb-0"
                  onClick={handlePersonelButtonClick}
                >
                  {Personnel_Text}
                </button>
              )}

              <button
                className={`text-white text-xs lg:text-sm font-bold rounded-full w-full sm:w-auto py-3 px-4 lg:px-6 md:px-10 transition-colors min-w-0 lg:min-w-[140px] sm:min-w-0 lg:sm:min-w-[185px] h-[45px] flex justify-center items-center whitespace-nowrap ${
                  isCancelState || isFormPage
                    ? "bg-[#D70E0E] hover:bg-red-600"
                    : "bg-[#79B833] hover:bg-[#6aa22c]"
                }`}
                onClick={handleButtonClick}
              >
                {getButtonText()}
              </button>
            </>
          )}
          {viewForm && (
            <div>
              <button
                className="text-[#79B833] border-2 border-[#79B833] text-xs lg:text-sm font-bold rounded-full w-full sm:w-auto py-3 px-4 lg:px-6 md:px-10 transition-colors min-w-0 lg:min-w-[140px] sm:min-w-0 lg:sm:min-w-[185px] h-[45px] flex justify-center items-center whitespace-nowrap"
                onClick={() => handleViewPurchaseFormClick?.()}
              >
                View Subscription Form
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {!isPersonnelPage && showBulkModal && (
        <BulkSelectModal
          onSelect={(isBulk) => {
            navigate("/properties/form");
            setIsLandProperty(true);
            setShowBulkModal(false);
            setIsCancelState(true);
          }}
          onSelects={(isBulk) => {
            navigate("/properties/form");
            setShowBulkModal(false);
            setIsLandProperty(false);
            setIsCancelState(true);
          }}
          onClose={() => setShowBulkModal(false)}
          x={() => {
            setShowBulkModal(false);
            setIsCancelState(false);
          }}
        />
      )}
      {createpersonnel && (
        <BulkPersonnelSelectModal
          onSelect={(isBulk) => {
            setIsUserBulk(true);
            setPersonnelModal(true);
            setcreatepersonnel(false);
          }}
          onSelects={(isBulk) => {
            setIsUserBulk(false);
            setPersonnelModal(true);
            setcreatepersonnel(false);
          }}
          onClose={() => setcreatepersonnel(false)}
          x={() => setcreatepersonnel(false)}
        />
      )}
      {showPersonnelModal && (
        <>
          {isUserBulk ? (
            <MassUploadModal
              isOpen={showPersonnelModal}
              onClose={() => setPersonnelModal(false)}
              x={() => setPersonnelModal(false)}
            />
          ) : (
            <PersonnelModal
              isOpen={showPersonnelModal}
              onClose={() => setPersonnelModal(false)}
              role={role}
            />
          )}
        </>
      )}
    </>
  );
}
