import { ChangeEvent, useState } from "react";
import { BiCheck, BiX } from "react-icons/bi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import OptionInputField from "../input/drop_down";
import {
  useCreatePropertyForm,
  useDraftPropertyForm,
  useEditPropertyForm,
} from "../Redux/hooks/usePropertyForms";
import { useDispatch } from "react-redux";
import { removePropertyDetail } from "../Redux/Properties/deleteSliceDetails";
import { AppDispatch } from "../Redux/store";

// The Fee interface has been updated to include an optional purpose field and isNew flag
interface Fee {
  id: number;
  name: string;
  amount: string;
  checked: boolean;
  type: string;
  purpose?: string;
  isNew?: boolean;
}

interface InfrastructureFeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode?: "create" | "edit" | "duplicate";
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center p-4 z-60">
      <div className="bg-white rounded-[20px] w-full max-w-md mx-auto shadow-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-[8px] hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-[8px] hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Removing..." : "Yes, Remove"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function InfrastructureFeesModal({
  isOpen,
  onClose,
  formMode = "edit",
}: InfrastructureFeesModalProps) {
  const createForm = useCreatePropertyForm();
  const editForm = useEditPropertyForm();
  const draftForm = useDraftPropertyForm();

  const selectedForm =
    formMode === "edit"
      ? {
          basicDetails: editForm.basicDetails,
          fees: editForm.metadata.fees,
          setFees: editForm.setEditFees,
          setNewFees: editForm.setEditNewFees,
        }
      : formMode === "duplicate"
        ? {
            basicDetails: draftForm.basicDetails,
            fees: draftForm.metadata.fees,
            setFees: draftForm.setDraftFees,
            setNewFees: draftForm.setDraftNewFees,
          }
        : {
            basicDetails: createForm.basicDetails,
            fees: createForm.metadata.fees,
            setFees: createForm.setCreateFees,
            setNewFees: createForm.setCreateNewFees,
          };

  const { basicDetails, fees, setFees, setNewFees } = selectedForm;
  
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  
  // State for the new fee inputs, including the new purpose field
  const [newFeeName, setNewFeeName] = useState<string>("");
  const [newFeetype, setNewFeetype] = useState<string>("");
  const [newFeeAmount, setNewFeeAmount] = useState<string>("");
  const [newFeePurpose, setNewFeePurpose] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [feeToRemove, setFeeToRemove] = useState<number | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const typeOptions = [
    { value: "infrastructure", label: "Infrastructure and development" },
    { value: "others", label: "others" },
  ];

  const purposeValues = Array.isArray(basicDetails?.purpose)
    ? basicDetails.purpose
    : typeof basicDetails?.purpose === "string"
      ? [basicDetails.purpose]
      : [];

  const mappedPurposes = purposeValues
    .map((purpose) => purpose?.trim())
    .filter(Boolean)
    .map((purpose) => ({
      label: purpose,
      value: purpose,
    }));

  const toggleFee = (id: number) => {
    setFees(
      fees.map((fee: Fee) =>
        fee.id === id ? { ...fee, checked: !fee.checked } : fee
      )
    );
  };

  const confirmRemoveFee = (id: number) => {
    setFeeToRemove(id);
    setShowConfirmation(true);
  };

  const handleRemove = async () => {
    if (feeToRemove === null) return;
    
    const feeToDelete = fees.find((fee: Fee) => fee.id === feeToRemove);
    
    // If it's a new fee (not in database), just remove it locally
    if (feeToDelete?.isNew || formMode !== "edit") {
      const updatedFees = fees.filter((fee: Fee) => fee.id !== feeToRemove);
      setFees(updatedFees);
      setNewFees(updatedFees);
      setShowConfirmation(false);
      setFeeToRemove(null);
      return;
    }
    
    // If it's an existing fee, delete from server
    setRemoveLoading(true);
    try {
      await dispatch(removePropertyDetail(feeToRemove.toString())).unwrap();
      const updatedFees = fees.filter((fee: Fee) => fee.id !== feeToRemove);
      setFees(updatedFees);
      setShowConfirmation(false);
      setFeeToRemove(null);
    } catch (error) {
      console.error("Failed to remove fee from server:", error);
    } finally {
      setRemoveLoading(false);
    }
  };

  const addFee = () => {
    // Check all new fields before adding
    if (newFeeName && newFeeAmount && newFeetype && newFeePurpose) {
      const newFee: Fee = {
        id: Math.max(...fees.map((f: Fee) => f.id), 0) + 1,
        name: newFeeName,
        type: newFeetype,
        amount: newFeeAmount.startsWith("₦")
          ? newFeeAmount
          : `₦${newFeeAmount}`,
        checked: true,
        purpose: newFeePurpose,
        isNew: true,
      };
      
      // Add to both fees and newFees arrays
      const updatedFees = [...fees, newFee];
      setFees(updatedFees);
      setNewFees(updatedFees);
      
      // Reset all new fee input fields
      setNewFeeName("");
      setNewFeeAmount("");
      setNewFeetype("");
      setNewFeePurpose("");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-[40px] w-full max-w-5xl mx-auto shadow-2xl overflow-y-auto max-h-[690px]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Allocation Fees
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <BiX size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Existing Fees */}
            {fees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No fees added yet. Add your first allocation fee below.
              </div>
            ) : (
              fees.map((fee: Fee) => (
                <div
                  key={fee.id}
                  className="flex items-center justify-between p-4 bg-[#FFFFFF] rounded-[20px] shadow"
                >
                  <div className="flex items-start space-x-3">
                    <button onClick={() => toggleFee(fee.id)}>
                      {fee.checked && (
                        <IoMdCheckmarkCircle size={20} color="#272727" />
                      )}
                    </button>
                    <div>
                      <div className="font-[325] text-gray-900 text-sm">
                        {fee.name}
                      </div>
                      <div className="text-base font-semibold text-gray-900">
                        {fee.amount}
                      </div>
                      {fee.type && (
                        <div className="text-xs text-gray-500">
                          Type:{" "}
                          {typeOptions.find((t) => t.value === fee.type)?.label ||
                            fee.type}
                        </div>
                      )}
                      {fee.purpose && ( 
                        <div className="text-xs text-gray-500">
                          Purpose: {fee.purpose}
                        </div>
                      )}
                      {fee.isNew && (
                        <div className="text-xs text-green-500 font-semibold">
                          New (Not saved yet)
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => confirmRemoveFee(fee.id)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <BiX size={16} className="text-gray-400" />
                  </button>
                </div>
              ))
            )}

            {/* Add Infrastructure Section */}
            <div className="pt-4">
              <h3 className="block text-[#4F4F4F] font-[350] text-[14px] mb-6">
                Add Allocation
              </h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                      Allocation Name
                    </label>
                    <input
                      type="text"
                      value={newFeeName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewFeeName(e.target.value)
                      }
                      className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                      Amount
                    </label>
                    <input
                      type="text"
                      value={newFeeAmount}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const rawValue = e.target.value.replace(/[^\d]/g, "");
                        const formatted = rawValue
                          ? "₦" + parseInt(rawValue, 10).toLocaleString("en-NG")
                          : "";
                        setNewFeeAmount(formatted);
                      }}
                      className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                      placeholder="₦0"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <OptionInputField
                    label="Type"
                    placeholder="Select type of fee"
                    name="type"
                    value={newFeetype}
                    onChange={(value) => setNewFeetype(value)}
                    options={typeOptions}
                    dropdownTitle="Fee Types"
                  />
                  
                  <OptionInputField
                    label="Purpose"
                    placeholder="Select a purpose"
                    name="purpose"
                    value={newFeePurpose}
                    onChange={(value) => setNewFeePurpose(value)}
                    options={mappedPurposes}
                    dropdownTitle="Purpose Options"
                  />
                </div>

                <button
                  onClick={addFee}
                  disabled={!newFeeName || !newFeeAmount || !newFeetype || !newFeePurpose}
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-[80px] hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Fees
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 w-full justify-end flex">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-[#79B833] text-white rounded-[80px] font-medium max-w-xl"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setFeeToRemove(null);
        }}
        onConfirm={handleRemove}
        title="Remove Fee"
        message="Are you sure you want to remove this fee? This action will delete it permanently from the server."
        loading={removeLoading}
      />
    </>
  );
}
