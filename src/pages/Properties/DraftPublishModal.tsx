// Create a new file DraftPublishModal.tsx
import React from "react";

interface DraftPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: "draft" | "publish") => void;
  isSubmitting: boolean;
}

const DraftPublishModal: React.FC<DraftPublishModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000066] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-[40px] max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Save Property</h2>
        <p className="mb-6">Would you like to save as draft or publish now?</p>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => onSelect("draft")}
            disabled={isSubmitting}
            className={`bg-gray-200 text-gray-800 py-2 px-4 rounded-[40px] hover:bg-gray-300 transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Processing..." : "Save as Draft"}
          </button>
          
          <button
            onClick={() => onSelect("publish")}
            disabled={isSubmitting}
            className={`bg-[#79B833] text-white py-2 px-4 rounded-[40px] hover:bg-[#6aa22c] transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Processing..." : "Publish Now"}
          </button>
          
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className={`border border-gray-300 py-2 px-4 rounded-[40px] hover:bg-gray-100 transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftPublishModal;