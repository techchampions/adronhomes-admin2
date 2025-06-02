import React, { useRef, ChangeEvent } from "react";
import { AiOutlineUpload } from "react-icons/ai";

interface FileUploadFieldProps {
  label: string;
  placeholder: string;
  onChange: (files: FileList | null) => void;
  required?: boolean;
  error?: string | string[];
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  placeholder,
  onChange,
  required = false,
  error,
  disabled = false,
  accept,
  multiple = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset to allow re-uploading the same file
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("Selected files:", files); // Debug
    onChange(files); // Pass FileList to parent
  };

  return (
    <div className="w-full">
      <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <div
          className={`w-full bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px] ${
            error ? "border-red-500" : ""
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={handleClick}
        >
          {placeholder}
          <AiOutlineUpload
            className={`absolute top-3 right-3 ${
              disabled ? "text-gray-400" : "text-[#4F4F4F]"
            }`}
            size={20}
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={disabled}
          accept={accept}
          multiple={multiple}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
};

export default FileUploadField;