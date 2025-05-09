import { ChangeEvent } from "react";

interface InputFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    error?: any;
    disabled?: boolean; // <-- New prop
  }
  
  const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    value,
    onChange,
    type = 'text',
    required = false,
    error,
    disabled = false, 
  }) => {
    return (
      <div className="w-full">
        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
          {label} 
        </label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled} 
          className={`w-full relative  bg-[#F5F5F5]   flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px] ${
            error ? 'border-red-500' : ''
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
          placeholder={placeholder}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  };
  export default InputField;