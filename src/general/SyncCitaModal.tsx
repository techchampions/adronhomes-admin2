import React from "react";

interface SyncCitaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SyncCitaModal: React.FC<SyncCitaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex flex-col items-center">
          {/* Oscillating Loader */}
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-[#79B833] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#6aa22c] border-t-transparent rounded-full animate-spin-reverse"></div>
            </div>
          </div>

          {/* Message */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Syncing Cita
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Please wait while we sync your data with Cita. This may take a few moments...
          </p>

          {/* Optional: Progress bar or status updates
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div className="bg-[#79B833] h-2 rounded-full animate-pulse w-3/4"></div>
          </div>

          {/* Cancel Button */}
          {/* <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel Sync
          </button> */} 
        </div>
      </div>
    </div>
  );
};

export default SyncCitaModal;