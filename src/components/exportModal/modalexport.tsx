// components/ExportModal.tsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { X, Calendar, FileDown, AlertCircle, User, CreditCard, Download } from 'lucide-react';

export interface ExportModalRef {
  openModal: () => void;
  closeModal: () => void;
}

interface ExportModalProps {
  modalTitle: string;
  description: string;
  exportType: 'payments' | 'customers';
  onExport: (startDate: string, endDate: string) => void;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  downloadUrl: string | null;
  lastExportDate: string | null;
  resetExportState: () => void;
  clearDownloadUrl: () => void;
  baseUrl?: string;
}

const ExportModal = forwardRef<ExportModalRef, ExportModalProps>(({
  modalTitle,
  description,
  exportType,
  onExport,
  isLoading,
  error,
  success,
  downloadUrl,
  lastExportDate,
  resetExportState,
  clearDownloadUrl,
  baseUrl = ''
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState('2025-05-14');
  const [endDate, setEndDate] = useState('2025-06-04');

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    openModal: () => setIsOpen(true),
    closeModal: () => {
      setIsOpen(false);
      resetExportState();
    }
  }));

  // Handle successful export and auto-download
  useEffect(() => {
    if (success && downloadUrl) {
      // Create full URL for download
      const fullDownloadUrl = downloadUrl.startsWith('http') 
        ? downloadUrl 
        : `${baseUrl}${downloadUrl}`;
      
      // Trigger download
      const link = document.createElement('a');
      link.href = fullDownloadUrl;
      link.download = downloadUrl.split('/').pop() || `${exportType}_export_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Close modal and reset state after successful download
      setTimeout(() => {
        setIsOpen(false);
        clearDownloadUrl();
        resetExportState();
      }, 1000);
    }
  }, [success, downloadUrl, resetExportState, clearDownloadUrl, baseUrl, exportType]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      resetExportState();
    }
  }, [isOpen, resetExportState]);

  const handleExport = () => {
    if (!isValidDateRange()) return;
    onExport(startDate, endDate);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    resetExportState();
  };

  const isValidDateRange = () => {
    return startDate && endDate && new Date(startDate) <= new Date(endDate);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getIcon = () => {
    return exportType === 'payments' ? <CreditCard size={20} /> : <User size={20} />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000066] bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal Content */}
      <div className="bg-white rounded-[60px] shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#79B833] rounded-lg flex items-center justify-center">
              {getIcon()}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{modalTitle}</h2>
          </div>
          <button
            onClick={handleCloseModal}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-gray-600">
            {description}
          </p>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-500 mt-0.5" size={16} />
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          {/* Success Message */}
          {success && downloadUrl && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-700 text-sm font-medium">
                Export completed successfully! Download will start automatically.
              </div>
            </div>
          )}

          {/* Start Date Input */}
          <div className="space-y-2">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#79B833] focus:border-[#79B833] outline-none transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* End Date Input */}
          <div className="space-y-2">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#79B833] focus:border-[#79B833] outline-none transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Date Range Validation Message */}
          {!isValidDateRange() && startDate && endDate && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              End date must be after start date
            </div>
          )}

          {/* Date Range Preview */}
          {isValidDateRange() && !isLoading && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Export Preview</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Start Date: <span className="font-medium">{formatDate(startDate)}</span></div>
                <div>End Date: <span className="font-medium">{formatDate(endDate)}</span></div>
                <div>Duration:<span className="font-medium">
  {
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1
  } days
</span>
</div>
                <div className="text-xs text-gray-500 mt-2">
                  File format: Excel (.xlsx)
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#79B833] border-t-transparent rounded-full animate-spin"></div>
              <div className="text-blue-700 text-sm">
                Generating export file... This may take a few moments.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          {/* <button
            onClick={handleCloseModal}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button> */}
          <button
            onClick={handleExport}
            disabled={!isValidDateRange() || isLoading}
            className="px-6 py-2 bg-[#272727] text-white rounded-full  disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ExportModal.displayName = 'ExportModal';

export default ExportModal;