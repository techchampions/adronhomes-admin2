import { useField, FieldHookConfig } from "formik";
import { ChangeEvent, DragEvent, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

type VideoUploadProps = {
  name: string;
  label?: string;
  maxSize?: number; // in MB
  supportedFormats?: string[];
  dragDropText?: string;
};

const VideoUpload = ({
  label,
  maxSize = 50,
  supportedFormats = ["MP4", "MOV", "AVI"],
  dragDropText = "Drag & drop video file here or click to browse",
  ...props
}: VideoUploadProps & FieldHookConfig<File[]>) => {
  const [field, meta, helpers] = useField<File[]>(props);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      const validTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
      return validTypes.includes(file.type) && file.size <= maxSize * 1024 * 1024;
    });

    if (validFiles.length > 0) {
      helpers.setValue([validFiles[0]]);
      setPreviewUrl(URL.createObjectURL(validFiles[0]));
    }
  };

  const removeFile = () => {
    helpers.setValue([]);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
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
        {field.value?.length > 0 && previewUrl ? (
          <div className="relative group">
            <div className="relative w-full h-48 bg-gray-200 rounded-[20px] overflow-hidden">
              <video
                src={previewUrl}
                className="w-full h-full object-cover"
                controls
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={removeFile}
              >
                <FaTrash className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <label
            className={`relative w-full h-48 rounded-[20px] overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer ${
              isDragging ? "border-[#79B833] bg-[#F0F7E6]" : "border-[#D8D8D8]"
            }`}
          >
            <input
              type="file"
              accept="video/*"
              className="hidden"
              multiple={false}
              onChange={handleFileSelect}
            />
            <div className="flex flex-col items-center">
              <FaPlus className="w-6 h-6 text-gray-500 mb-1" />
              <span className="text-xs text-gray-500">Add Video</span>
            </div>
          </label>
        )}
      </div>

      <div className="mt-4 text-[#767676] text-[14px] space-y-[5px]">
        <p className="font-[350]">File Size: Max {maxSize}MB</p>
        <p className="font-[350]">
          Formats Supported: {supportedFormats.join(", ")}
        </p>
      </div>

      {meta.touched && meta.error && (
        <div className="mt-2 text-sm text-red-600">{meta.error}</div>
      )}
    </div>
  );
};

export default VideoUpload;