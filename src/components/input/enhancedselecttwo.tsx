import React, { useState, useMemo } from "react";
import Select from "react-select";

interface DropdownOption {
  value: any;
  label: string;
}

interface EnhancedOptionInputFieldProps {
  label: string;
  placeholder: string;
  value: any;
  onChange: (value: any) => void;
  name?: string;
  error?: any;
  disabled?: boolean;
  options: DropdownOption[];
  dropdownTitle?: string;
  isSearchable?: boolean;
  isLoading?: boolean;
}

const EnhancedOptionInputFieldtwo: React.FC<EnhancedOptionInputFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  name,
  error,
  disabled = false,
  options = [],
  dropdownTitle = "Options",
  isSearchable = true,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: "#F5F5F5",
      border: error ? "1px solid #e53e3e" : "none",
      borderRadius: "60px",
      padding: "8px 16px",
      minHeight: "44px",
      boxShadow: "none",
      "&:hover": {
        borderColor: error ? "#e53e3e" : "#ccc",
      },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "30px",
      overflow: "hidden",
      marginTop: "8px",
    }),
    menuList: (base: any) => ({
      ...base,
      padding: "24px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#e6f7ff" : "white",
      color: state.isSelected ? "#1890ff" : "#333",
      fontWeight: state.isSelected ? "bold" : "normal",
      "&:hover": {
        backgroundColor: "#f0f0f0",
      },
      marginBottom: "8px",
      borderRadius: "8px",
      padding: "12px 16px",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#999",
      fontSize: "14px",
    }),
    singleValue: (base: any) => ({
      ...base,
      fontSize: "14px",
      color: "#333",
    }),
  };

  const selectedOption = useMemo(() => {
    return options.find(opt => opt.value === value) || null;
  }, [value, options]);

  const handleChange = (selectedOption: any) => {
    onChange(selectedOption?.value || "");
  };

  return (
    <div className="w-full">
      <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
        {label}
      </label>

      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        isDisabled={disabled}
        isLoading={isLoading}
        isSearchable={isSearchable}
        styles={customStyles}
        name={name}
        inputValue={inputValue}
        onInputChange={setInputValue}
        noOptionsMessage={({ inputValue }) =>
          inputValue ? "No options found" : "No options available"
        }
        loadingMessage={() => "Loading..."}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        className="react-select-container"
        classNamePrefix="react-select"
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
};

export default EnhancedOptionInputFieldtwo