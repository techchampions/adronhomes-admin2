import React, { useState } from "react";
import { useGetNotifications } from "../../utils/hooks/query";
import { Notification } from "../../pages/Properties/types/NotificationTypes";
import SoosarPagination from "../SoosarPagination";
import LoadingAnimations from "../LoadingAnimations";
import NotFound from "../NotFound";
import { formatDate } from "../../utils/formatdate";

export default function NotificationsTable() {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [page, setpage] = useState(1);
  const { data, isLoading, isError } = useGetNotifications(page);
  const notifications = data?.data.data || [];
  const totalPages = data?.data.last_page || 1;

  const openModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  if (isLoading) {
    return <LoadingAnimations loading={isLoading} />;
  }
  if (notifications.length < 1) {
    return <NotFound text="No Notifications." />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {notifications.map((update, index) => (
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
              {formatDate(update.created_at)}
            </p>
          </div>
          <p className="font-normal text-xs md:text-sm text-[#767676] line-clamp-2">
            {update.content}
          </p>
        </div>
      ))}

      <SoosarPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setpage}
        hasNext={!!data?.data.next_page_url}
        hasPrev={!!data?.data.prev_page_url}
      />

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
                {selectedNotification.created_at}
              </p>
              <p className="text-sm md:text-base text-[#767676] whitespace-pre-line">
                {selectedNotification.content}
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
