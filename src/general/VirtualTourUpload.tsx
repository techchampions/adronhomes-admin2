import { useField, FieldHookConfig } from "formik";
import { ChangeEvent, DragEvent, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { FaCircleExclamation, FaTrash } from "react-icons/fa6";
type FileUploadProps = {
  name: string;
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  minResolution?: { width: number; height: number };
  recommendedRatio?: string;
  supportedFormats?: string[];
  dragDropText?: string;
  orderHint?: string;
};

const FileUpload = ({
  label,
  accept = ".jpg,.jpeg,.png",
  multiple = true,
  maxSize = 5,
  minResolution = { width: 1500, height: 1000 },
  recommendedRatio = "3:2",
  supportedFormats = ["JPG", "JPEG", "PNG"],
  dragDropText = "",
  orderHint = "",
  ...props
}: FileUploadProps & FieldHookConfig<File[]>) => {
  const [field, meta, helpers] = useField<File[]>(props);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      return validTypes.includes(file.type) && file.size <= maxSize * 1024 * 1024;
    });

    if (multiple) {
      helpers.setValue([...(field.value || []), ...validFiles]);
    } else {
      helpers.setValue(validFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...(field.value || [])];
    newFiles.splice(index, 1);
    helpers.setValue(newFiles);
  };

  return (
    <div className="mb-8">
      {label && (
        <label className="block text-[14px] font-[325] text-[#767676] mb-2">
          {label}
        </label>
      )}

      <div
        className="flex flex-wrap gap-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {field.value?.map((file, index) => (
          <div key={index} className="relative group">
            <div className="relative w-[138px] h-[119px] bg-gray-200 rounded-[20px] overflow-hidden">
              <img
                src={URL.createObjectURL(file)}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                 className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <FaTrash className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {(multiple || !field.value?.length) && (
          
          <label
            className={`relative w-[138px] h-[119px] rounded-[20px] overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer ${
              isDragging ? "border-[#79B833] bg-[#F0F7E6]" : "border-[#D8D8D8]"
            }`}
          >
            <input
              type="file"
              accept={accept}
              className="hidden"
              multiple={multiple}
              onChange={handleFileSelect}
            />  <div className="flex flex-col items-center">
                            <FaPlus className="w-6 h-6 text-gray-500 mb-1" />
                            <span className="text-xs text-gray-500">Add Image</span>
                          </div>
            {/* <span className="text-xs text-center text-[#767676] px-2">
              {dragDropText}
            </span> */}
          </label>
        )}
      </div>

      <div className="mt-4 text-[#767676] text-[14px] space-y-[5px]">
        <p className="font-[350]">
          Minimum Resolution: {minResolution.width} x {minResolution.height} pixels
        </p>
        {recommendedRatio && (
          <p className="font-[350]">Recommended Aspect Ratio: {recommendedRatio}</p>
        )}
        <p className="font-[350]">File Size: Max {maxSize}MB per file</p>
        <p className="font-[350]">
          Formats Supported: {supportedFormats.join(", ")}
        </p>
      </div>

      {orderHint && (
        <div className="flex items-start mt-[11px] text-[#767676] font-[325] text-[14px]">
          <FaCircleExclamation className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <p>{orderHint}</p>
        </div>
      )}

      {meta.touched && meta.error && (
        <div className="mt-2 text-sm text-red-600">{meta.error}</div>
      )}
    </div>
  );
};

export default FileUpload;