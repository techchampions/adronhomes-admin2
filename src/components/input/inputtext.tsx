import { ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string; // Added name prop
  type?: string;
  required?: boolean;
  error?: any;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  name, // Added name prop
  type = 'text',
  required = false,
  error,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        name={name} // Added name attribute
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px] ${
          error ? 'border-red-500' : ''
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        required={required}
        
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;