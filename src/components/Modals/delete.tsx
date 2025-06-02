import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  subjectName?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  subjectName,
  onClose,
  onConfirm,
  loading = false,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[30px] w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="mb-6 flex flex-col text-center gap-4">
            {description} 
            {subjectName && <strong>{subjectName}</strong>}.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-[60px]"
            >
              {cancelButtonText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`lg:px-[66px] lg:py-[15px] py-2 px-3 bg-red-600 text-sm font-bold text-white rounded-[60px] ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
