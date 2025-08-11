import { FAQItem, FAQPayload } from "../../../pages/Properties/types/FAQsTypes";
import { useDeleteFAQs } from "../../../utils/hooks/mutations";
import Button from "../../input/Button";
import SmallLoader from "../../SmallLoader";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  faqItem: FAQItem | undefined;
}

export default function DeleteFAQ({
  isOpen = true,
  onClose = () => {},
  faqItem,
}: ModalProps) {
  const { mutate: deleteFAQ, isPending } = useDeleteFAQs();
  const handleDelete = () => {
    const payload: FAQPayload = {
      faq_id: faqItem?.id || 0,
    };
    deleteFAQ(payload, {
      onSuccess() {
        onClose();
      },
    });
  };
  if (isPending) {
    return (
      <div className="fixed inset-0 z-50 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-h-[95%] overflow-y-scroll scrollbar-hide max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10 px-10">
          <SmallLoader />
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-h-[95%] overflow-y-scroll scrollbar-hide max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10 px-10">
        <div className="flex justify-between items-center mb-1 sm:mb-2 md:mb-[10px]">
          <h2 className="text-lg sm:text-xl md:text-2xl font-[350] text-dark">
            Edit Testimonial{" "}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-base sm:text-lg md:text-base"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-3 sm:mb-4 md:mb-6">
          {/* Add a new account for receiving payment{" "} */}
        </p>
        <div className="flex flex-col gap-5">
          <p>Are you sure you want to delete FAQ?</p>
          <div className="space-y-2">
            <Button
              label="Yes, Delete"
              className="!bg-red-500 text-sm"
              onClick={handleDelete}
            />
            <Button
              label="No, Cancel"
              className="!bg-gray-400 text-sm"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
