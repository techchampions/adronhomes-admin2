import React, { useRef, useState, ChangeEvent } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { MdClose } from "react-icons/md"; // Import an icon for removing files

interface FileUploadFieldProps {
  label: string;
  placeholder: string;
  onChange: (files: File[] | null) => void;
  required?: boolean;
  error?: any;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  name: string;
  value: File[];
}

const MultipleFileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  placeholder,
  onChange,
  required = false,
  error,
  disabled = false,
  accept,
  multiple = false,
  name,
  value, // Use the value prop directly
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset to allow re-uploading the same file
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    const newFiles = Array.from(files);
    let hasDuplicate = false;
    let newFileArray: File[] = [...value]; // Use the value prop as the base

    for (const newFile of newFiles) {
      if (value.some(existingFile => existingFile.name === newFile.name)) {
        setDuplicateError(`File already exists: ${newFile.name}`);
        hasDuplicate = true;
        break;
      }
      newFileArray.push(newFile);
    }

    if (!hasDuplicate) {
      onChange(newFileArray); // Pass the new array to the parent
      setDuplicateError(null);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    const filteredFiles = value.filter(file => file.name !== fileToRemove.name);
    onChange(filteredFiles); // Pass the new array to the parent
    setDuplicateError(null);
  };

  return (
    <div className="w-full">
      <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <div
          className={`w-full bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px] ${
            (error || duplicateError) ? "border border-red-500" : ""
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={handleClick}
        >
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-2 pr-10">
              {value.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file);
                    }}
                    className="ml-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <span className="truncate">{placeholder}</span>
          )}

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
          name={name} // Pass the name prop to the input field
          className="hidden"
        />
      </div>

      {(error || duplicateError) && (
        <p className="text-red-500 text-sm mt-1">
          {duplicateError || (Array.isArray(error) ? error[0] : error)}
        </p>
      )}
    </div>
  );
};

export default MultipleFileUploadField;