import React, { useState } from "react";
import Pagination from "../Pagination";

type Notification = {
  id: number;
  title: string;
  description: string;
  date: string;
};

export default function NotificationsTable() {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const updates: Notification[] = [
    {
      id: 1,
      title: "New update on Markaba Property",
      description:
        "Markaba Property is now on 20% sale discount with 7 plots going for as low as $10,000. This limited-time offer is valid until the end of the month. Don't miss this opportunity to invest in prime real estate with excellent growth potential. Our team is available 24/7 to answer any questions you might have about this property.",
      date: "15th May, 2024: 9:00PM",
    },
    {
      id: 2,
      title: "Maintenance Schedule Update",
      description:
        "The scheduled maintenance for all properties in the Markaba complex has been moved to next week. The new dates are June 5-7, 2024. During this time, some amenities might be temporarily unavailable. We apologize for any inconvenience this might cause and appreciate your understanding as we work to improve your living experience.",
      date: "14th May, 2024: 3:30PM",
    },
    {
      id: 3,
      title: "Community Meeting Announcement",
      description:
        "There will be a community meeting on June 10th at the clubhouse to discuss upcoming neighborhood improvements. All residents are encouraged to attend. We'll be discussing the new playground installation, parking regulations, and the summer block party. Light refreshments will be provided.",
      date: "12th May, 2024: 11:15AM",
    },
    {
      id: 4,
      title: "Payment Reminder",
      description:
        "This is a friendly reminder that your next installment payment is due on May 25th, 2024. Late payments will incur a 2% penalty fee. You can make your payment through our online portal, mobile app, or at any of our physical offices. Thank you for your prompt attention to this matter.",
      date: "10th May, 2024: 5:45PM",
    },
    {
      id: 5,
      title: "New Amenity Available",
      description:
        "We're excited to announce that the new fitness center is now open to all residents! The facility includes state-of-the-art equipment, yoga studio, and personal training services. Operating hours are from 5:00 AM to 11:00 PM daily. Please remember to bring your access card and follow the posted rules for everyone's safety and enjoyment.",
      date: "8th May, 2024: 2:00PM",
    },
  ];

  const openModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {updates.map((update, index) => (
        <div
          key={update.id}
          onClick={() => openModal(update)}
          className={`rounded-2xl md:rounded-3xl px-4 py-3 md:px-6 md:py-4 cursor-pointer transition-all hover:shadow-md ${
            index % 2 === 0 ? "bg-white" : "bg-[#F5F5F5]"
          }`}
        >
          <div className="w-full flex flex-col md:flex-row md:justify-between mb-2 md:mb-3">
            <p className="font-medium text-sm md:text-base text-dark truncate">
              {update.title}
            </p>
            <p className="font-normal text-xs md:text-sm text-[#767676] mt-1 md:mt-0">
              {update.date}
            </p>
          </div>
          <p className="font-normal text-xs md:text-sm text-[#767676] line-clamp-2">
            {update.description}
          </p>
        </div>
      ))}

      <Pagination />

      {/* Modal */}
      {isModalOpen && selectedNotification && (
       <div className="fixed inset-0 bg-[rgba(121,184,51,0.4)] flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-dark">
                  {selectedNotification.title}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm md:text-base text-[#767676] mb-4">
                {selectedNotification.date}
              </p>
              <p className="text-sm md:text-base text-[#767676] whitespace-pre-line">
                {selectedNotification.description}
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
