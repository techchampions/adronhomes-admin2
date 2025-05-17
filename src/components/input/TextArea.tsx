import React, { ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string; // Added name prop
  type?: string;
  required?: boolean;
  error?: any;
  disabled?: boolean;
  rows?: number;
}

const InputAreaField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  name, // Added name prop
  type = "text",
  required = false,
  error,
  disabled = false,
  rows = 4,
}) => {
  return (
    <div className="w-full">
      <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
        {label}
      
      </label>
      <textarea
        name={name} // Added name attribute
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`w-full border bg-[#F5F5F5] px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[20px] ${
          error ? "border-red-500" : "border-[#F5F5F5]"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputAreaField;


{/* <InputAreaField
  label="Description"
  placeholder="Enter your description here"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  required
  rows={6}
/> */}