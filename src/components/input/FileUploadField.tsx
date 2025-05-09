import React, { useRef } from "react";
import { ChangeEvent } from "react";
import { AiOutlineUpload } from "react-icons/ai";

interface InputFieldProps {
  label: string;
  placeholder: string;
  onChange: (files: FileList | null) => void; // Changed to handle files
  required?: boolean;
  error?: any;
  disabled?: boolean;
  accept?: string; // For file types (e.g., "image/*", ".pdf,.doc")
}

const FileUploadField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  onChange,
  required = false,
  error,
  disabled = false,
  accept,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files);
  };

  return (
    <div className="w-full">
      <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <div
          className={`w-full border bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px] ${
            error ? 'border-red-500' : ''
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={handleClick}
        >
          {placeholder}
          <AiOutlineUpload 
            className={`absolute top-3 right-3 ${disabled ? 'text-gray-400' : 'text-[#4F4F4F]'}`} 
            size={20} 
          />
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={disabled}
          accept={accept}
          className="hidden"
        />
      </div>
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FileUploadField;

//       <FileUploadField
//   label="Upload Document"
//   placeholder="Click to upload files"
//   onChange={(files) => console.log(files)}
//   accept=".pdf,.doc,.docx"
// />