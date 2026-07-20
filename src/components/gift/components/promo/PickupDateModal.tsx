// PickupDateModal.tsx
import React, { useState } from 'react';
import { FaCalendar, FaTimes, FaCheck } from 'react-icons/fa';

interface PickupDateModalProps {
  isOpen: boolean;
  requestId: number | null;
  userName: string;
  propertyName: string;
  isForApproved?: boolean;
  onClose: () => void;
  onConfirm: (pickupDate: string) => void;
  loading?: boolean;
}

export const PickupDateModal: React.FC<PickupDateModalProps> = ({
  isOpen,
  requestId,
  userName,
  propertyName,
  isForApproved = false,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  if (!isOpen || !requestId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickupDate && pickupTime) {
      const formattedDateTime = `${pickupDate} ${pickupTime}:00`;
      onConfirm(formattedDateTime);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Get minimum time (current time + 1 hour)
  const getMinTime = () => {
    const now = new Date();
    const minHour = now.getHours() + 1;
    const minTime = `${String(minHour).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return minTime;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-[30px] shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FaCalendar className="text-[#79B833] text-xl" />
              <h2 className="text-xl font-semibold text-gray-900">
                {isForApproved ? 'Set Pickup Date & Time' : 'Schedule Pickup Date & Time'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Info Cards */}
              <div className="bg-[#79B833]/90 rounded-lg p-3 space-y-2">
                <div className="text-sm text-white font-medium">
                  <span className="font-medium">User:</span> {userName}
                </div>
                <div className="text-sm text-white font-medium">
                  <span className="font-medium">Property:</span> {propertyName}
                </div>
              </div>

              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date *
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={today}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#79B833] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              {/* Time Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Time *
                </label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  min={getMinTime()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#79B833] focus:border-transparent outline-none transition-all"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Please set a time at least 1 hour from now
                </p>
              </div>

              {/* Info Note */}
              <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-800">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>User will be notified about the pickup date/time</li>
                  <li>Make sure the property is available for pickup at this time</li>
                  <li>Pickup must be scheduled at least 1 hour in advance</li>
                  {!isForApproved && (
                    <li>This will approve the request and schedule pickup</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-[30px] font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !pickupDate || !pickupTime}
                className="flex-1 px-4 py-2 bg-[#79B833] hover:bg-[#6aa22c] text-white rounded-[30px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <FaCheck />
                    {isForApproved ? 'Set Pickup Date' : 'Approve & Schedule'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};