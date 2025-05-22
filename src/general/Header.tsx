// Header.tsx
import React, { useContext, useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import BulkSelectModal from "../pages/Properties/BasicDetails/BulkSelectModal";
import { PropertyContext } from "../MyContext/MyContext";
import PersonnelModal from "../pages/Personnel/createPersonnelModal";
import MassUploadModal from "../pages/Personnel/mass_upload";
import BulkPersonnelSelectModal from "../pages/Personnel/BulkPersonalSelectModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../components/Redux/store";
import { getUser } from "../components/Redux/User/user_Thunk";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  history?: boolean;
  showBulkModal?: boolean;
  setShowBulkModal?: (show: boolean) => void;
}

export default function Header({
  title = "Properties",
  subtitle = "Manage the list of properties",
  searchPlaceholder = "Search",
  buttonText = "Add Property",
  onButtonClick,
  history = false,
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
  } = useContext(PropertyContext)!;
  const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [createpersonnel, setcreatepersonnel] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isPersonnelPage = location.pathname === "/personnel";

  const handleButtonClick = () => {
    if (isCancelState) {
      // When in cancel state, navigate back
      navigate(isPersonnelPage ? "/personnel" : "/properties");
      setIsCancelState(false);
    } else {
      // Normal state behavior
      if (onButtonClick) {
        onButtonClick();
      }

      if (isPersonnelPage) {
        // Personnel-specific action
        setcreatepersonnel(true);
      } else {
        // Property-specific action
        setIsCancelState(true);
        setShowBulkModal(true);
      }
    }
  };

  // Determine button text based on page and state
  const getButtonText = () => {
    if (isCancelState) return "Cancel";
    return isPersonnelPage ? "Create Personnel" : buttonText;
  };

  //  const {
  //   loading: userLoading,
  //   success: userSuccess,
  //   error: userError,
  //   user,
  // } = useSelector((state: RootState) => state.user);
 
  return (
    <>
      <div className="w-full flex-col lg:flex-row justify-between items-start gap-4 p-4 sm:p-6 md:pt-16 md:pb-8 md:px-8 lg:pr-[68px] lg:pl-[38px] flex overflow-hidden relative">
        <div className="w-full sm:w-auto -4 sm:mb-0 lg:ml-0 ml-10">
          <h2 className="font-[325] text-2xl sm:text-3xl md:text-[34px] leading-tight text-dark mb-2">
            {title}
          </h2>
          <p className="leading-tight font-[325] text-sm md:text-base text-[#767676]">
            {subtitle}
          </p>
          {history && (
            <>
              <p className="text-dark font-meduim text-base lg:flex items-center mt-4 hidden">
                <IoMdArrowBack className="mr-2" /> Back
              </p>
              <p className="text-dark font-meduim text-base lg:hidden absolute top-0 right-10 items-center mt-4 flex">
                <IoMdArrowBack className="mr-2" /> Back
              </p>
            </>
          )}
        </div>

        <div className="w-full lg:w-auto flex flex-row lg:flex-row items-center gap-4 mt-4 sm:mt-0">
          <div
            className={`relative h-[51px] w-full sm:w-64 lg:w-[410px] flex-3/4 rounded-full border transition-all font-[400] ${
              isSearchFocused
                ? "border-[#79B833] shadow-sm"
                : "border-[#D8D8D8]"
            } bg-white overflow-hidden`}
          >
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full h-full px-6 py-3 border-none bg-transparent text-[#878787] text-sm font-normal focus:outline-none placeholder:text-[#878787]"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          <button
            className={`text-white md:text-sm text-xs font-bold rounded-full w-full sm:w-auto py-3 px-6 md:px-10 transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center flex-1/4  whitespace-nowrap ${
              isCancelState
                ? "bg-[#D70E0E] hover:bg-red-600"
                : "bg-[#79B833] hover:bg-[#6aa22c]"
            }`}
            onClick={handleButtonClick}
          >
            {getButtonText()}
          </button>
        </div>
      </div>

      {!isPersonnelPage && showBulkModal && (
        <BulkSelectModal
          onSelect={(isBulk) => {
            navigate("/properties/form");
            setIsBulk(true);
            setShowBulkModal(false);
            setIsCancelState(true);
          }}
          onSelects={(isBulk) => {
            navigate("/properties/form");
            setIsBulk(false);
            setShowBulkModal(false);
            setIsCancelState(true);
          }}
          onClose={() => setShowBulkModal(false)}
          x={() => {
            setShowBulkModal(false);
            setIsCancelState(false);
          }}
        />
      )}
  {  createpersonnel &&  <BulkPersonnelSelectModal
        onSelect={(isBulk) => {
          setIsUserBulk(true);
          setPersonnelModal(true);
          setcreatepersonnel(false)
        }}
        onSelects={(isBulk) => {
          setIsUserBulk(false);
          setPersonnelModal(true);
          setcreatepersonnel(false)
        }}
        onClose={() => setcreatepersonnel(false)}
        x={()=>setcreatepersonnel(false)}
      />}
      {showPersonnelModal && (
        <>
          {isUserBulk ? (
            <MassUploadModal
              isOpen={showPersonnelModal}
              onClose={() => setPersonnelModal(false)}
              onSubmit={function (values: {
                files: FileList | null;
              }): Promise<void> {
                throw new Error("Function not implemented.");
              } } x={() => setPersonnelModal(false)}            />
          ) : (
            <PersonnelModal
              isOpen={showPersonnelModal}
              onClose={() => setPersonnelModal(false)}
            />
          )}
        </>
      )}
    </>
  );
}








// isUserBulk,
//       setIsUserBulk,




// // Header.tsx
// import React, { useContext, useState } from "react";
// import { IoMdArrowBack } from "react-icons/io";
// import { useNavigate, useLocation } from "react-router-dom";
// import BulkSelectModal from "../pages/Properties/BasicDetails/BulkSelectModal";
// import { PropertyContext } from "../MyContext/MyContext";
// import PersonnelModal from "../pages/Personnel/createPersonnelModal";
// import MassUploadModal from "../pages/Personnel/mass_upload";
// import BulkPersonnelSelectModal from "../pages/Personnel/BulkPersonalSelectModal";

// interface HeaderProps {
//   title?: string;
//   subtitle?: string;
//   searchPlaceholder?: string;
//   buttonText?: string;
//   onButtonClick?: () => void;
//   history?: boolean;
//   showBulkModal?: boolean;
//   setShowBulkModal?: (show: boolean) => void;
// }

// export default function Header({
//   title = "Properties",
//   subtitle = "Manage the list of properties",
//   searchPlaceholder = "Search",
//   buttonText = "Add Property",
//   onButtonClick,
//   history = false,
// }: HeaderProps) {
//   const {
//     showBulkModal,
//     setShowBulkModal,
//     setIsBulk,
//     isCancelState,
//     setIsCancelState,
//     showPersonnelModal,
//     setPersonnelModal,
//     isUserBulk,
//     setIsUserBulk,
//   } = useContext(PropertyContext)!;
//   const [isSearchFocused, setIsSearchFocused] = useState(false);
//   const [createpersonnel, setcreatepersonnel] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isPersonnelPage = location.pathname === "/personnel";
//   const isPropertiesPage = location.pathname.startsWith("/properties");

//   const handleButtonClick = () => {
//     if (isCancelState && isPropertiesPage) {
//       // When in cancel state and on properties page, navigate back
//       navigate("/properties");
//       setIsCancelState(false);
//     } else {
//       // Normal state behavior
//       if (onButtonClick) {
//         onButtonClick();
//       }

//       if (isPersonnelPage) {
//         // Personnel-specific action
//         setcreatepersonnel(true);
//       } else if (isPropertiesPage) {
//         // Property-specific action
//         setIsCancelState(true);
//         setShowBulkModal(true);
        
//       }
//     }
//   };

//   // Determine button text based on page and state
//   const getButtonText = () => {
//     if (isCancelState && isPropertiesPage) return "Cancel";
//     return isPersonnelPage ? "Create Personnel" : buttonText;
//   };

//   return (
//     <>
//       <div className="w-full flex-col lg:flex-row justify-between items-start gap-4 p-4 sm:p-6 md:pt-16 md:pb-8 md:px-8 lg:pr-[68px] lg:pl-[38px] flex overflow-hidden relative">
//         <div className="w-full sm:w-auto -4 sm:mb-0 lg:ml-0 ml-10">
//           <h2 className="font-[325] text-2xl sm:text-3xl md:text-[34px] leading-tight text-dark mb-2 text-ri">
//             {title}
//           </h2>
//           <p className="leading-tight font-[325] text-sm md:text-base text-[#767676]">
//             {subtitle}
//           </p>
//           {history && (
//             <>
//               <p className="text-dark font-meduim text-base lg:flex items-center mt-4 hidden">
//                 <IoMdArrowBack className="mr-2" /> Back
//               </p>
//               <p className="text-dark font-meduim text-base lg:hidden absolute top-0 right-10 items-center mt-4 flex">
//                 <IoMdArrowBack className="mr-2" /> Back
//               </p>
//             </>
//           )}
//         </div>

//         <div className="w-full lg:w-auto flex flex-row lg:flex-row items-center gap-4 mt-4 sm:mt-0">
//           <div
//             className={`relative h-[51px] w-full sm:w-64 lg:w-[410px] flex-3/4 rounded-full border transition-all font-[400] ${
//               isSearchFocused
//                 ? "border-[#79B833] shadow-sm"
//                 : "border-[#D8D8D8]"
//             } bg-white overflow-hidden`}
//           >
//             <input
//               type="text"
//               placeholder={searchPlaceholder}
//               className="w-full h-full px-6 py-3 border-none bg-transparent text-[#878787] text-sm font-normal focus:outline-none placeholder:text-[#878787]"
//               onFocus={() => setIsSearchFocused(true)}
//               onBlur={() => setIsSearchFocused(false)}
//             />
//           </div>

//           <button
//             className={`text-white md:text-sm text-xs font-bold rounded-full w-full sm:w-auto py-3 px-6 md:px-10 transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center flex-1/4  whitespace-nowrap ${
//               isCancelState && isPropertiesPage
//                 ? "bg-[#D70E0E] hover:bg-red-600"
//                 : "bg-[#79B833] hover:bg-[#6aa22c]"
//             }`}
//             onClick={handleButtonClick}
//           >
//             {getButtonText()}
//           </button>
//         </div>
//       </div>

//       {isPropertiesPage && showBulkModal && (
//         <BulkSelectModal
//           onSelect={(isBulk) => {
//             navigate("/properties/form");
//             setIsBulk(true);
//             setShowBulkModal(false);
//             setIsCancelState(true);
//           }}
//           onSelects={(isBulk) => {
//             navigate("/properties/form");
//             setIsBulk(false);
//             setShowBulkModal(false);
//             setIsCancelState(true);
//           }}
//           onClose={() => setShowBulkModal(false)}
//           x={() => {
//             setShowBulkModal(false);
//             setIsCancelState(false);
//           }}
//         />
//       )}
//       {createpersonnel && (
//         <BulkPersonnelSelectModal
//           onSelect={(isBulk) => {
//             setIsUserBulk(true);
//             setPersonnelModal(true);
//             setcreatepersonnel(false);
//           }}
//           onSelects={(isBulk) => {
//             setIsUserBulk(false);
//             setPersonnelModal(true);
//             setcreatepersonnel(false);
//           }}
//           onClose={() => setcreatepersonnel(false)}
//           x={() => setcreatepersonnel(false)}
//         />
//       )}
//       {showPersonnelModal && (
//         <>
//           {isUserBulk ? (
//             <MassUploadModal
//               isOpen={showPersonnelModal}
//               onClose={() => setPersonnelModal(false)}
//               onSubmit={function (values: {
//                 files: FileList | null;
//               }): Promise<void> {
//                 throw new Error("Function not implemented.");
//               }}
//               x={() => setPersonnelModal(false)}
//             />
//           ) : (
//             <PersonnelModal
//               isOpen={showPersonnelModal}
//               onClose={() => setPersonnelModal(false)}
//             />
//           )}
//         </>
//       )}
//     </>
//   );
// }