import Button from "../../input/Button";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DeleteLeader({
  isOpen = true,
  onClose = () => {},
}: ModalProps) {
  const handleSubmit = () => {
    console.log("Form submitted:");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-h-[95%] overflow-y-scroll scrollbar-hide max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10">
        <div className="flex justify-between items-center mb-1 sm:mb-2 md:mb-[10px]">
          <h2 className="text-lg sm:text-xl font-[350] text-dark">
            Delete Leader Info{" "}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-base sm:text-lg md:text-base"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:my-4 md:my-16 text-center">
          Are you sure you want to delete this Leader info?{" "}
        </p>
        <div className="flex  justify-between">
          <Button
            label="Cancel"
            className="!bg-transparent !text-black"
            onClick={onClose}
          />
          <Button label="Delete" className="!bg-red-500" />
        </div>
      </div>
    </div>
  );
}
