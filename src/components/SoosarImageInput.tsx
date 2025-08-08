import React, { useCallback, useRef } from "react";
import { ErrorMessage, useField } from "formik";
import { FaExclamationCircle } from "react-icons/fa";
import { IoAdd, IoTrash } from "react-icons/io5";
import { toast } from "react-toastify";

interface ImageUploadFieldProps {
  name: string;
  label?: string;
  infoText?: string;
  className?: string;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  aspectRatio?: string;
  width?: number | string;
  height?: number | string;
  theme?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  name,
  label,
  infoText,
  className = "",
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp"],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  aspectRatio = "9/16",
  width = 225,
  height = 250,
  theme = "light",
}) => {
  const [field, meta, helpers] = useField(name);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasError = meta.touched && meta.error;

  const validateFile = useCallback(
    (file: File) => {
      if (!acceptedFileTypes.includes(file.type)) {
        return "Unsupported file format";
      }
      if (file.size > maxFileSize) {
        return `File size too large (max ${maxFileSize / 1024 / 1024}MB)`;
      }
      return null;
    },
    [acceptedFileTypes, maxFileSize]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        helpers.setError(error);
        toast.error(error);
        return;
      }
      helpers.setValue(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    helpers.setValue(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <div className="font-medium mb-1">{label}</div>}

      {infoText && (
        <div className="text-xs text-gray-500 mb-2 flex items-start">
          <span className="flex-1">{infoText}</span>
        </div>
      )}

      <div
        className={`relative border rounded-2xl overflow-hidden ${
          theme === "light" ? "bg-gray-100" : "bg-gray-700"
        } ${hasError ? "border-red-500" : "border-0"}`}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          aspectRatio,
        }}
      >
        <label className="cursor-pointer w-full h-full block">
          <input
            type="file"
            name={name}
            accept={acceptedFileTypes.join(",")}
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />

          {field.value ? (
            <>
              <img
                src={
                  field.value instanceof File
                    ? URL.createObjectURL(field.value)
                    : field.value
                }
                alt="Uploaded preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                onClick={handleRemove}
              >
                <IoTrash size={16} />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 rounded-xl">
              <div className="text-center p-4 flex flex-col items-center gap-2">
                {/* <div className="text-lg">+</div> */}
                <IoAdd />
                <div className="text-sm">Upload Image</div>
              </div>
            </div>
          )}
        </label>

        {hasError && (
          <div className="absolute top-2 right-2">
            <FaExclamationCircle className="w-5 h-5 text-red-500" />
          </div>
        )}
      </div>

      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-xs mt-1 text-left"
      />
    </div>
  );
};

export default ImageUploadField;
