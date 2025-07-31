import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPaymentById,
  UpdatePaymentstatus,
} from "../../components/Redux/Payment/payment_thunk";
import { toast } from "react-toastify";
import { resetPaymentStatus } from "../../components/Redux/Payment/updatePaymentStatus";

interface PaymentByIdCardProps {
  paymentId?: string;
  paymentId2?: any;
  amount?: string;
  additionalPayments?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  date?: string;
  receiptImage?: string;
  onApprove?: () => void;
  onDisapprove?: () => void;
  fullReciept?: string;
  handleHistory?: any;
  status?: number;
  id: any;
  wallet?: boolean; 
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[30px] w-full max-w-md">
        <div className="border-b p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const PaymentCard: React.FC<PaymentByIdCardProps> = ({
  paymentId = "#35264898DJd7",
  paymentId2 = "#35264898DJd7",
  amount = "₦6,000,000",
  additionalPayments = "",
  bankName = "",
  accountNumber = "",
  accountName = "",
  date = "24/09/2024; 9:00 PM",
  receiptImage = "/reciept.svg",
  fullReciept = "/fullreciept.svg",
  onApprove,
  onDisapprove,
  handleHistory,
  status = 0,
  id,
    wallet = false,
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDisapproveModalOpen, setIsDisapproveModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { payment, loading, error, success, message } = useSelector(
    (state: RootState) => state.updatePayment
  );

  useEffect(() => {
    if (success) {
      toast.success(message);
      setIsApproveModalOpen(false);
      setIsDisapproveModalOpen(false);
      dispatch(resetPaymentStatus());
      dispatch(fetchPaymentById(id));
    }

    if (error) {
      toast.error(error.message);
      dispatch(resetPaymentStatus());
    }
  }, [success, error, message, dispatch]);

  const handleView = () => {
    setIsViewModalOpen(true);
  };

  const handleApprove = () => {
    setIsApproveModalOpen(true);
  };

  const handleDisapprove = () => {
    setIsDisapproveModalOpen(true);
  };

  const confirmApprove = () => {
    if (paymentId2) {
      dispatch(
        UpdatePaymentstatus({
          paymentId: paymentId2,
          credentials: { status: 1 },
        })
      );
    }
  };

  const confirmDisapprove = () => {
    if (paymentId2) {
      dispatch(
        UpdatePaymentstatus({
          paymentId: paymentId2,
          credentials: { status: 2 },
        })
      );
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white py-4 lg:py-[24px] px-4 lg:pr-[34px] lg:pl-[28px] rounded-[20px] gap-4">
        {/* leftside */}
        <div>
          <p className="text-dark text-sm font-[325] mb-4 lg:mb-[20px]">
            Payment ID:{" "}
            <span className="text-dark text-sm font-[350]">{paymentId}</span>
          </p>
          <p className="text-dark text-sm font-[325]">
            Amount:
            <span className="font-[350] text-2xl lg:text-[30px] text-dark">
              {" "}
              {amount}
            </span>
          </p>
          <div className="pl-0 lg:pl-[69px] mb-4 lg:mb-[20px]">
            <span className="text-[#767676] text-sm font-[325]">
              {additionalPayments}
            </span>{" "}
            <button
              className="text-[#79B833] text-sm font-bold cursor-pointer"
              onClick={handleHistory}
            >
              VIEW PAYMENT LIST
            </button>
          </div>

          <p className="text-dark text-sm font-[325]">
            Bank Details:
            <span className="font-[350] text-sm text-dark"> {bankName}</span>
          </p>
          <div className="pl-0 lg:pl-[95px] flex flex-col mb-4 lg:mb-[20px]">
            <span className="font-[350] text-sm text-dark">
              {accountNumber}
            </span>{" "}
            <span className="font-[350] text-sm text-dark">{accountName}</span>
          </div>
          <p className="text-dark text-sm font-[325]">
            Date:
            <span className="font-[350] text-sm text-dark"> {date}</span>
          </p>
        </div>
        {/* right side */}

       <div className="w-full flex flex-col items-start lg:items-end justify-end">
  {/* Conditional rendering based on wallet prop */}
  {!wallet && (
    <>
      {/* file for view */}
      <div
        className="bg-[#F7F7F7] py-4 lg:py-[20px] pl-4 lg:pl-[29px] h-[120px] w-full lg:w-[409px] rounded-[20px] mb-4 lg:mb-[21px] relative cursor-pointer"
        onClick={handleView}
      >
        <img
          src={receiptImage}
          alt="receipt"
          className="border border-[#BEBEBE] rounded-[21px] h-full aspect-square  object-cover min-w-7 md:min-w-[300px]"
        />
        <p className="absolute right-8 lg:right-7 top-1/2 transform -translate-y-1/2 text-dark text-sm font-bold">
          View
        </p>
      </div>

      {/* Status display or action buttons */}
      {status === 1 ? (
        <div className="text-[#79B833] text-sm font-bold py-3 sm:py-[14px] w-full text-center">
          Approved
        </div>
      ) : status === 2 ? (
        <div className="text-[#D70E0E] text-sm font-bold py-3 sm:py-[14px] w-full text-center">
          Disapproved
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 w-full sm:w-auto">
          <button
            className="bg-[#79B833] rounded-[60px] py-3 sm:py-[14px] px-6 sm:px-[44px] text-white text-sm font-bold w-full sm:w-auto text-center"
            onClick={handleApprove}
          >
            Approve Payment
          </button>
          <p
            className="text-[#D70E0E] text-sm font-bold py-3 sm:py-[14px] sm:pl-[45px] w-full sm:w-auto text-center sm:text-left cursor-pointer"
            onClick={handleDisapprove}
          >
            Disapprove Payment
          </p>
        </div>
      )}
    </>
  )}
</div>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Payment Receipt"
      >
        <div className="flex justify-center">
          <img
            src={fullReciept}
            alt="receipt"
            className="max-h-[60vh] md:max-h-[70vh] w-auto max-w-full rounded-lg"
          />
        </div>
      </Modal>

      {/* Approve Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Confirm Approval"
      >
        <div className="text-center p-2 md:p-4">
          <p className="mb-4 md:mb-6 text-base md:text-lg">
            Are you sure you want to approve this payment?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <button
              className="px-4 py-4  hover:bg-gray-300 rounded-[60px] text-sm md:text-sm transition-colors font-bold"
              onClick={() => setIsApproveModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-4 bg-[#79B833] hover:bg-[#6aa32e] text-white rounded-[60px] text-sm md:text-sm transition-colors font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={confirmApprove}
              disabled={loading}
            >
              {loading && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {loading ? "Approving..." : "Confirm Approval"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Disapprove Modal */}
      <Modal
        isOpen={isDisapproveModalOpen}
        onClose={() => setIsDisapproveModalOpen(false)}
        title="Confirm Disapproval"
      >
        <div className="text-center p-2 md:p-4">
          <p className="mb-4 md:mb-6 text-base md:text-lg">
            Are you sure you want to disapprove this payment?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <button
              className="px-4 py-4 hover:bg-gray-300 rounded-[60px] text-sm md:text-sm transition-colors font-bold"
              onClick={() => setIsDisapproveModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-4 bg-[#D70E0E] hover:bg-[#c00c0c] text-white rounded-[60px] text-sm md:text-sm transition-colors font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={confirmDisapprove}
              disabled={loading}
            >
              {loading && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {loading ? "Disapproving..." : "Confirm Disapproval"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PaymentCard;
