import { ChangeEvent, useContext, useState } from "react";
import { BiCheck, BiX } from "react-icons/bi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { PropertyContext } from "../../MyContext/MyContext";
import OptionInputField from "../input/drop_down";

// The Fee interface has been updated to include an optional purpose field
interface Fee {
  id: number;
  name: string;
  amount: string;
  checked: boolean;
  type: string;
  purpose?: string;
}

interface InfrastructureFeesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfrastructureFeesModal({
  isOpen,
  onClose,
}: InfrastructureFeesModalProps) {

  const { formData, setFees, fees, setSpecifications, setLandForm} = useContext(PropertyContext)!;
  
  // State for the new fee inputs, including the new purpose field
  const [newFeeName, setNewFeeName] = useState<string>("");
  const [newFeetype, setNewFeetype] = useState<string>("");
  const [newFeeAmount, setNewFeeAmount] = useState<string>("");
  const [newFeePurpose, setNewFeePurpose] = useState<string>("");

  const typeOptions = [
    { value: "Infrastructure and development", label: "Infrastructure and development" },
    { value: "others", label: "others" },
  ];

  
const mappedPurposes = Array.isArray(formData.basicDetails.purpose) && formData.basicDetails.purpose.length > 0
  ? formData.basicDetails.purpose.map(purpose => ({
      label: purpose,
      value: purpose
    }))
  : [];


  const toggleFee = (id: number) => {
    setFees(
      fees.map((fee) =>
        fee.id === id ? { ...fee, checked: !fee.checked } : fee
      )
    );
  };

  const removeFee = (id: number) => {
    setFees(fees.filter((fee) => fee.id !== id));
  };

  const addFee = () => {
    // Check all new fields before adding
    if (newFeeName && newFeeAmount && newFeetype && newFeePurpose) {
      const newFee: Fee = {
        id: Math.max(...fees.map((f) => f.id), 0) + 1,
        name: newFeeName,
        type: newFeetype,
        amount: newFeeAmount.startsWith("₦")
          ? newFeeAmount
          : `₦${newFeeAmount}`,
        checked: true,
        purpose: newFeePurpose, 
      };
      setFees([...fees, newFee]);
      // Reset all new fee input fields
      setNewFeeName("");
      setNewFeeAmount("");
      setNewFeetype("");
      setNewFeePurpose("");
    }
  };

  if (!isOpen) return null;

  return (
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
          {fees.map((fee) => (
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
                </div>
              </div>
              <button
                onClick={() => removeFee(fee.id)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <BiX size={16} className="text-gray-400" />
              </button>
            </div>
          ))}

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
                      const rawValue = e.target.value.replace(/[^\d]/g, ""); // keep digits only
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
                
                {/* New OptionInputField for Purpose */}
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
                // Check all fields for the disabled state
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
  );
}
