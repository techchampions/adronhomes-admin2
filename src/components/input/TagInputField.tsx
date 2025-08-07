import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ChangeEvent } from "react";

interface TagInputFieldProps {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
  name?: string;
  error?: any;
  disabled?: boolean;
}

const TagInputField: React.FC<TagInputFieldProps> = ({
  label,
  placeholder,
  values = [],
  onChange,
  name,
  error,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      onChange([...values, inputValue.trim()]);
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && values.length > 0) {
      // Remove last tag when backspace is pressed with empty input
      onChange(values.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    if (inputValue.trim()) {
      onChange([...values, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full">
      <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
        {label}
      </label>

      <div
        className={`w-full min-h-[44px] bg-[#F5F5F5] flex flex-wrap items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px] ${
          error ? "border-red-500" : ""
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-text"} ${
          isFocused ? "ring-0 ring-primary" : ""
        }`}
        onClick={handleContainerClick}
      >
        {values.map((value, index) => (
          <div
            key={index}
            className="flex items-center bg-white bg-opacity-10 text-[#4F4F4F] rounded-full px-3 py-1 mr-2 mb-1"
          >
            {value}
            {!disabled && (
              <button
                type="button"
                className="ml-2 text-red-500 font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {!disabled && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={values.length === 0 ? placeholder : ""}
            className="flex-grow bg-transparent outline-none min-w-[50px] "
            disabled={disabled}
            name={name}
          />
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TagInputField;
