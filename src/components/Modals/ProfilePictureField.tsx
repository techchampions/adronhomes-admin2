// ProfilePictureField.tsx
import React, { useCallback, useRef, useState } from "react";
import { ErrorMessage, useField } from "formik";
import { toast } from "react-toastify";
import { 
  Camera, Upload, Trash2, ImageOff, AlertCircle 
} from "lucide-react"; // ← nicer modern icons (lucide-react)

interface ProfilePictureFieldProps {
  name: string;
  label?: string;
  helpText?: string;          // renamed from infoText
  className?: string;
  acceptedFileTypes?: string[];
  maxFileSize?: number;       // bytes
  aspectRatio?: number;       // e.g. 1 → square, 4/3, 16/9 etc.
  size?: number;              // diameter / side length in px
  shape?: "circle" | "rounded" | "square";
  showCropHint?: boolean;     // new: subtle overlay showing crop area
}

const ProfilePictureField: React.FC<ProfilePictureFieldProps> = ({
  name,
  label,
  helpText,
  className = "",
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"],
  maxFileSize = 5 * 1024 * 1024,
  aspectRatio = 1,
  size = 160,
  shape = "circle",
  showCropHint = true,
}) => {
  const [field, meta, helpers] = useField(name);
  const [preview, setPreview] = useState<string | null>(
    typeof field.value === "string" ? field.value : null
  );
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasError = meta.touched && meta.error;
  const hasImage = !!preview;

  const shapeStyle = {
    circle: "rounded-full",
    rounded: "rounded-2xl",
    square: "rounded-xl",
  }[shape];

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedFileTypes.includes(file.type)) {
      return `Allowed formats: ${acceptedFileTypes.map(t => t.split("/")[1].toUpperCase()).join(", ")}`;
    }
    if (file.size > maxFileSize) {
      return `File too large (max ${maxFileSize / (1024 * 1024)} MB)`;
    }
    return null;
  }, [acceptedFileTypes, maxFileSize]);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error, { theme: "colored" });
      helpers.setError(error);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    helpers.setValue(file); // ← File object for Formik / submission
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDrag = (e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    setDragActive(active);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    helpers.setValue(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label + help */}
      {label && (
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </div>
      )}
      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}

      {/* Main drop area */}
      <div
        className={`
          group relative mx-auto cursor-pointer transition-all duration-300
          ${shapeStyle} overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100
          dark:from-gray-800 dark:to-gray-900
          border-2
          ${hasError
            ? "border-red-400 dark:border-red-500"
            : hasImage
              ? dragActive
                ? "border-blue-500 scale-[1.03] shadow-xl"
                : "border-emerald-400 dark:border-emerald-600 shadow-md"
              : dragActive
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }
          hover:shadow-lg focus-within:shadow-lg focus-within:ring-2 focus-within:ring-blue-500/40
        `}
        style={{
          width: size,
          height: size / aspectRatio,
        }}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => onDrag(e, true)}
        onDragEnter={(e) => onDrag(e, true)}
        onDragLeave={(e) => onDrag(e, false)}
        role="button"
        tabIndex={0}
        aria-label="Upload profile picture"
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedFileTypes.join(",")}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Preview or placeholder */}
        {preview ? (
          <>
            <img
              src={preview}
              alt="Profile preview"
              className="h-full w-full object-cover"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex flex-col items-center text-white text-sm gap-1">
                <Camera size={28} strokeWidth={1.8} />
                <span>Change photo</span>
              </div>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Remove photo"
              aria-label="Remove profile picture"
            >
              <Trash2 size={16} />
            </button>

            {/* Optional crop hint overlay */}
            {showCropHint && aspectRatio !== 1 && (
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white/40 opacity-40" />
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-gray-500 dark:text-gray-400 px-6 text-center">
            {dragActive ? (
              <Upload size={40} className="mb-3 text-blue-500" strokeWidth={1.5} />
            ) : hasError ? (
              <AlertCircle size={40} className="mb-3 text-red-500" strokeWidth={1.5} />
            ) : (
              <ImageOff size={40} className="mb-3 opacity-70" strokeWidth={1.5} />
            )}

            <p className="text-sm font-medium">
              {dragActive ? "Drop here" : "Click or drag photo"}
            </p>
            <p className="mt-1 text-xs opacity-80">
              JPG, PNG, WebP • max {maxFileSize / (1024 * 1024)} MB
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      <ErrorMessage
        name={name}
        component="p"
        className="text-xs text-red-600 dark:text-red-400 text-center font-medium"
      />
    </div>
  );
};

export default ProfilePictureField;