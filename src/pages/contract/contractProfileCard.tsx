import React from "react";

// Define props type for UserProfileCard
interface UserProfileCardProps {
  name: any;
  joinDate: any;
  documentLinkText: string;
  viewActionText: string;
  hasContractDocuments: any;
  openDoc: any;
  name2: any;
  marketer: any;
  businestype: any;
  jointType: any;
}

// UserProfileCard component with props type
export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name,
  joinDate,
  documentLinkText,
  viewActionText,
  hasContractDocuments,
  openDoc,
  name2,
  marketer,
  businestype,
  jointType,
}) => {
  return (
    <div className="bg-white rounded-2xl  p-6 md:p-8 flex items-center justify-between w-full  flex-wrap gap-4">
      {/* User Info Section */}
      <div className="flex items-center gap-4 flex-grow">
        {/* User Avatar Placeholder */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-300 rounded-full flex-shrink-0">
          <svg
            className="w-full h-full text-gray-500 p-2"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        {/* Name and Date */}
        <div>
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              {name}
            </h2>
            {jointType && (
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                {name2}
              </h2>
            )}
            <p className="text-sm md:text-base text-gray-600">
              Initial PaymentDate: {joinDate}
            </p>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            Marketer: {marketer}
          </p>
          <p className="text-sm md:text-base text-gray-600">
            Business Type: {businestype}
          </p>
        </div>
      </div>

      {/* Actions Section */}
      {hasContractDocuments && (
        <div
          className="flex flex-col items-end gap-2 flex-shrink-0"
          onClick={() => openDoc()}
        >
          <button className="text-[#79B833] hover:text-[#79B833] font-medium flex items-center gap-1 text-sm md:text-base">
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
            </svg>
            {documentLinkText}
          </button>

          <button className="text-blue-600 hover:text-blue-700 font-semibold text-base md:text-lg">
            {viewActionText}
          </button>
        </div>
      )}
    </div>
  );
};
