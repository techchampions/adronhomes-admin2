import React, { useState } from "react";
import { formatDate } from "../../utils/formatdate";
import { useGetPartnerShipByID } from "../../utils/hooks/query";
import { PartnershipRequest } from "../Properties/types/ClientsTypes";
import SmallLoader from "../../components/SmallLoader";
import CopyButton from "../../components/CopyButton";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  item: PartnershipRequest | undefined;
}
const RequestCard: React.FC<ModalProps> = ({ isOpen, onClose, item }) => {
  const { data, isLoading } = useGetPartnerShipByID(item?.id);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-h-[95%] overflow-y-scroll scrollbar-hide max-w-lg sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10 px-10">
        {isLoading ? (
          <SmallLoader />
        ) : (
          <>
            <div className="flex justify-between items-center mb-1 sm:mb-2 md:mb-[10px]">
              <div className="flex flex-col">
                <h2 className="text-lg sm:text-xl md:text-2xl font-[350] text-dark">
                  {item?.fullname}
                </h2>
                <div className="text-xs text-gray-400">
                  From {item?.location}
                </div>
                <div className="text-xs text-gray-400">
                  Sent on {formatDate(item?.created_at)}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-base sm:text-lg md:text-base"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center justify-between mt-5">
              <p className="text-gray-600 text-xs mb-3 sm:mb-4 md:mb-6 flex gap-1 items-center">
                {item?.email}
                <CopyButton text={item?.email} />
              </p>
              <p className="text-gray-600 text-xs mb-3 sm:mb-4 md:mb-6 flex gap-1 items-center">
                {item?.phone_number}
                <CopyButton text={item?.phone_number} />
              </p>
            </div>
            <div className="bg-gray-100 rounded-3xl p-4 h-[200px] max-h-[350px] overflow-y-scroll scrollbar-hide">
              <p className="text-sm">{item?.message}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
