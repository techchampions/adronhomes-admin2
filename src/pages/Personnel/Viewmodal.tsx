import React, { useState, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { IoCopyOutline } from "react-icons/io5";
import { FiShare2 } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { MdEmail, MdWorkOutline, MdDateRange } from "react-icons/md";

interface PersonnelData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  joinDate: string;
  lastActive: string;
  status: "Active" | "Inactive" | "Suspended";
  avatar?: string;
  referral_code?:string
}

interface PersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  personnelData?: PersonnelData;
}

const PersonnelModal: React.FC<PersonnelModalProps> = ({


  isOpen,
  onClose,
  personnelData = {
    id: "usr_01hws5tdgy677782hdgeg3",
    fullName: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
    joinDate: "2023-10-15",
   referral_code:"N/A",
    avatar: "/default-avatar.png",
  },
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };


// Generate initials from full name
const getInitials = (fullName: string) => {
  const names = fullName.split(' ');
  const first = names[0]?.charAt(0).toUpperCase() || '';
  const last = names[names.length - 1]?.charAt(0).toUpperCase() || '';
  return first + last;
};

// Generate a consistent color from a string
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = '#' + ((hash >> 24) & 0xff).toString(16).padStart(2, '0') +
                      ((hash >> 16) & 0xff).toString(16).padStart(2, '0') +
                      ((hash >> 8) & 0xff).toString(16).padStart(2, '0');
  return color.slice(0, 7);
};


  if (!isOpen) return null;

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
        return "#2ECE2E";
      case "inactive":
        return "#FFA500";
      case "suspended":
        return "#FF0000";
      default:
        return "#2ECE2E";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(102,102,102,0.2)] p-2 sm:p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[95vw] sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 relative animate-fadeIn overflow-y-auto max-h-[95vh]"
      >
        <div className="w-full items-center justify-between flex mb-4 sm:mb-6">
          <p className="font-medium text-lg sm:text-xl md:text-2xl">Personnel Details</p>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-1 sm:p-2 rounded-full transition-colors"
          >
            <FaXmark size={14} />
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
            {/* {personnelData.avatar 
            ? (
  <img 
    src={personnelData.avatar} 
    alt={`${personnelData.fullName}'s avatar`}
    className="w-full h-full object-cover"
  />
) :
 */}

{(
  <div
    className="w-full h-full flex items-center justify-center text-white text-xl font-semibold"
    style={{ backgroundColor: stringToColor(personnelData.fullName) }}
  >
    {getInitials(personnelData.fullName)}
  </div>
)}

          </div>
          <h2 className="font-semibold text-lg sm:text-xl text-center">{personnelData.fullName}</h2>
          <p className="text-gray-600 text-sm sm:text-base">{personnelData.role}</p>
        </div>

        {/* Personnel ID */}
        <div className="grid grid-cols-2 border-b border-b-gray-200 py-3 sm:py-4 w-full items-center">
          <div>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600 flex items-center">
              <MdEmail className="mr-2" />    Referral ID
            </p>
            <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base truncate pr-1 sm:pr-2">
              {personnelData?.referral_code??'N/A'}
            </h1>
          </div>
          <div className="w-full flex justify-end">
            <button
              onClick={() => handleCopy(personnelData?.referral_code??'N/A')}
              className="flex items-center hover:bg-gray-100 p-1 sm:px-2 rounded transition-colors text-xs sm:text-sm"
            >
              <IoCopyOutline className="mr-1" size={14} />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Email */}
        <div className="grid grid-cols-1 border-b border-b-gray-200 py-3 sm:py-4 w-full">
          <div>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600 flex items-center">
              <MdEmail className="mr-2" /> Email
            </p>
            <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
              {personnelData.email}
            </h1>
          </div>
        </div>

        {/* Role */}
        <div className="grid grid-cols-1 border-b border-b-gray-200 py-3 sm:py-4 w-full">
          <div>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600 flex items-center">
              <MdWorkOutline className="mr-2" /> Role
            </p>
            <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
              {personnelData.role}
            </h1>
          </div>
        </div>

        {/* Join Date */}
        <div className="grid grid-cols-1 border-b border-b-gray-200 py-3 sm:py-4 w-full">
          <div>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600 flex items-center">
              <MdDateRange className="mr-2" /> Join Date
            </p>
            <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
              {new Date(personnelData.joinDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h1>
          </div>
        </div>

        {/* Last Active
        <div className="grid grid-cols-1 border-b border-b-gray-200 py-3 sm:py-4 w-full">
          <div>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600 flex items-center">
              <MdDateRange className="mr-2" /> Last Active
            </p>
            <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
              {new Date(personnelData.lastActive).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </h1>
          </div>
        </div> */}

        {/* Status */}
        {/* <div className="grid grid-cols-1 py-3 sm:py-4 w-full items-center">
          <div>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">Status</p>
            <div className="flex items-center">
              <span 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: getStatusColor(personnelData.status) }}
              ></span>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                {personnelData.status}
              </h1>
            </div>
          </div>
        </div> */}

        {/* Actions */}
       {/* Actions: Cancel and Done */}
<div className="grid grid-cols-3 mt-2 justify-end w-full ">
      <div className="col-span-1 flex items-center w-full justify-end">
  <button
    onClick={onClose}
    className="flex items-center text-xs sm:text-base font-medium text-gray-900 hover:underline"
  >
    Cancel
  </button></div>
    <div className="col-span-2 flex justify-end">
  <button
    onClick={onClose}
  className="flex items-center bg-gray-900 text-white font-medium text-xs sm:text-sm md:text-base py-2 sm:py-3 px-4 sm:px-6 md:px-10 rounded-full hover:bg-gray-800 transition-colors"
  >
    Done
  </button></div>
</div>

      </div>
    </div>
  );
};

export default PersonnelModal;

const roleOptions = [
  { value: "1", label: "Admin" },
  { value: "2", label: "Marketer" },
  { value: "3", label: "Director" },
  { value: "4", label: "Accountant" },
  { value: "5", label: "Hr" },
];

const getRole = (value:any) => {
  const role = roleOptions.find((r) => r.value === value);
  return role ? role.label : "Unknown";
};
