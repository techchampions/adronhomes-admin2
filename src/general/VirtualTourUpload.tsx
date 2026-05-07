import { useField, FieldHookConfig } from "formik";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
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

type UploadItem = File | string;

const FileUpload = ({
  label,
  accept = "image/jpeg,image/jpg,image/png",
  multiple = true,
  maxSize = 5,
  minResolution = { width: 1500, height: 1000 },
  recommendedRatio = "3:2",
  supportedFormats = ["JPG", "JPEG", "PNG"],
  orderHint = "",
  ...props
}: FileUploadProps & FieldHookConfig<UploadItem[]>) => {
  const [field, meta, helpers] = useField<UploadItem[]>(props);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  
  // Ref to keep track of object URLs we created (for Files only)
  const createdUrlsRef = useRef<Set<string>>(new Set());

  // Cleanup function to revoke only our created URLs
  const cleanup = () => {
    createdUrlsRef.current.forEach(URL.revokeObjectURL);
    createdUrlsRef.current.clear();
  };

  useEffect(() => {
    if (!field.value || field.value.length === 0) {
      setPreviews([]);
      cleanup();
      return;
    }

    const newPreviews: string[] = [];
    const newCreated = new Set<string>();

    field.value.forEach((item) => {
      if (typeof item === "string") {
        // Existing server URL – no need to revoke
        newPreviews.push(item);
      } else if (item instanceof File) {
        const url = URL.createObjectURL(item);
        newPreviews.push(url);
        newCreated.add(url);
      }
    });

    // Revoke old URLs that are no longer needed
    const oldUrls = createdUrlsRef.current;
    oldUrls.forEach((url) => {
      if (!newCreated.has(url)) {
        URL.revokeObjectURL(url);
      }
    });

    createdUrlsRef.current = newCreated;
    setPreviews(newPreviews);

    // Cleanup on unmount
    return cleanup;
  }, [field.value]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files?.length) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFiles(Array.from(e.target.files));
      e.target.value = ""; // Reset input to allow re-selecting same file
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles: File[] = files.filter((file) => {
      const validType = ["image/jpeg", "image/jpg", "image/png"].includes(file.type);
      const validSize = file.size <= maxSize * 1024 * 1024;
      return validType && validSize;
    });

    if (validFiles.length === 0) return;

    if (multiple) {
      helpers.setValue([...(field.value || []), ...validFiles]);
    } else {
      helpers.setValue([validFiles[0]]);
    }
  };

  const removeFile = (index: number) => {
    const updated = [...(field.value || [])];
    updated.splice(index, 1);
    helpers.setValue(updated);
  };

  const canAddMore = multiple || (field.value?.length ?? 0) === 0;

  return (
    <div className="mb-8">
      {label && (
        <label className="block text-[14px] font-[325] text-[#767676] mb-2">
          {label}
        </label>
      )}

      <div
        className={`flex flex-wrap gap-4 p-6 border-2 border-dashed rounded-2xl transition-all ${
          isDragging
            ? "border-[#79B833] bg-[#F0F7E6]"
            : "border-[#D8D8D8] bg-transparent"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Image Previews */}
        {previews.map((src, index) => (
          <div key={index} className="relative group">
            <div className="w-[138px] h-[119px] bg-gray-200 rounded-[20px] overflow-hidden shadow-sm">
              <img
                src={src}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTrash className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {/* Add Button */}
        {canAddMore && (
          <label className="w-[138px] h-[119px] rounded-[20px] bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300">
            <input
              type="file"
              accept={accept}
              multiple={multiple}
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileSelect}
            />
            <FaPlus className="w-8 h-8 text-gray-500 mb-2" />
            <span className="text-sm text-gray-600 text-center px-2">
              Add Image
            </span>
          </label>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 text-[#767676] text-[14px] space-y-[5px]">
        <p>Minimum Resolution: {minResolution.width} × {minResolution.height}px</p>
        {recommendedRatio && <p>Recommended Aspect Ratio: {recommendedRatio}</p>}
        <p>File Size: Max {maxSize}MB per file</p>
        <p>Formats Supported: {supportedFormats.join(", ")}</p>
      </div>

      {orderHint && (
        <div className="flex items-start mt-[11px] text-[#767676] text-[14px]">
          <FaCircleExclamation className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <p>{orderHint}</p>
        </div>
      )}

      {/* Error */}
      {meta.touched && meta.error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <FaCircleExclamation />
          <span>{meta.error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;