import React, { useState, useRef, useEffect } from "react";
import { ChangeEvent } from "react";
import { IoCaretDown } from "react-icons/io5";

interface DropdownOption {
  value: string;
  label: string;
}

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  name?: string; // Added name prop
  error?: any;
  disabled?: boolean;
  options: DropdownOption[];
  dropdownTitle?: string;
}

const OptionInputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  name, // Added name prop
  error,
  disabled = false,
  options = [],
  dropdownTitle = "Options",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : "";

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
        {label}
      </label>

      <div className="relative">
        <div
          className={`w-full bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px] ${
            error ? "border-red-500" : ""
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={toggleDropdown}
        >
          {displayValue || placeholder}
          <IoCaretDown
            className={`absolute top-3 right-3 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
            size={20}
          />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white  shadow rounded-[30px] overflow-hidden">
            <div className="px-6 py-4">
              <p className="font-[350] text-dark mb-[18px]">{dropdownTitle}</p>
              <div className="space-y-[23px]">
                {options.map((option) => (
                  <div
                    key={option.value}
                    className={`font-[325] text-sm cursor-pointer ${
                      value === option.value
                        ? "text-primary font-bold"
                        : "text-dark"
                    }`}
                    onClick={() => handleOptionClick(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default OptionInputField;