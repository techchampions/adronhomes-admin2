import React, { useEffect, useState, ChangeEvent } from "react";
import { useFormik } from "formik";
import { BiDumbbell } from "react-icons/bi";
import { TfiRulerAlt2 } from "react-icons/tfi";
import * as Yup from "yup";

interface ContractDocument {
  id?: number;
  document_file: string | File;
  plan_id?: number;
  [key: string]: any;
}

interface PropertyDocumentsModalProps {
  onClose: () => void;
  onSubmit: (values: {
    documents: Array<{ plan_id: number; document_file: File | string }>;
  }) => Promise<void>;
  propertyDetails: PropertyDetails;
  isLoading?: boolean;
  isEditMode?: boolean;
}

interface FileWithPreview {
  file: File;
  preview: string;
  name: string;
}

interface PropertyDetails {
  name: string;
  address: string;
  size: string;
  display_image: string;
  features?: string[];
}

export const PropertyDocumentsModal: React.FC<PropertyDocumentsModalProps> = ({
  onClose,
  onSubmit,
  propertyDetails,
  isLoading = false,
  isEditMode = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  // State to store duplicate file error message
  const [duplicateFileError, setDuplicateFileError] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Cleanup URL objects if component unmounts
    return () => {
      uploadedFiles.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [uploadedFiles]);

  useEffect(() => {
    const documentsValue = uploadedFiles.map((f) => ({
      plan_id: 0, // Default plan_id for new uploads
      document_file: f.file,
    }));

    formik.setFieldValue("documents", documentsValue);
    formik.validateField("documents");
  }, [uploadedFiles]);

  const validationSchema = Yup.object().shape({
    documents: Yup.array()
      .min(1, "At least one document is required")
      .required("Documents are required"),
  });

  const formik = useFormik({
    initialValues: {
      documents: [] as Array<{ plan_id: number; document_file: File | string }>,
    },
    validationSchema,
    onSubmit: async (values) => {
      const submitValues = {
        documents: values.documents,
      };

      await onSubmit(submitValues);
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const currentFileNames = uploadedFiles.map((f) => f.name);
      let hasDuplicate = false;
      let duplicateFileName = "";

      const filesToAdd: FileWithPreview[] = [];

      for (const file of newFiles) {
        if (currentFileNames.includes(file.name)) {
          hasDuplicate = true;
          duplicateFileName = file.name;
          break; // Stop on the first duplicate found
        }
        filesToAdd.push({
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
        });
      }

      if (hasDuplicate) {
        setDuplicateFileError(
          `A file with the name "${duplicateFileName}" already exists.`
        );
        // Clear the input field to allow re-selection of files
        e.target.value = "";
      } else {
        setDuplicateFileError(null); // Clear any previous duplicate error
        setUploadedFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
        // Clear the input field after successful upload to allow selection of the same files again
        e.target.value = "";
      }
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    URL.revokeObjectURL(fileToRemove.preview);

    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    // Clear duplicate file error if no files are left or if the removed file was the one causing the error
    if (newFiles.length === 0 || duplicateFileError) {
      setDuplicateFileError(null);
    }
  };

  const handleCancel = () => {
    uploadedFiles.forEach((file) => {
      URL.revokeObjectURL(file.preview);
    });
    setUploadedFiles([]);
    setDuplicateFileError(null); // Clear error on cancel
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[40px] p-6 w-full max-w-md mx-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#1E1E1E]">
            {isEditMode ? "Upload Property Documents" : "Upload Property Documents"}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-[#4F4F4F] mb-[30px]">
          Upload the documents for this property.
        </p>

        <div className="mb-6 flex items-start space-x-4">
          <img
            src={propertyDetails.display_image || "/land.svg"}
            alt={propertyDetails.name || "Property Image"}
            className="w-16 h-16 rounded-md object-cover flex-shrink-0"
          />
          <div>
            <h3 className="font-medium text-[#1E1E1E] text-base">
              {propertyDetails.name || "Property Name"}
            </h3>
            <p className="text-sm text-[#828282] flex items-center mt-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-gray-400 mr-1"
              >
                <path d="M12 0C7.88 0 4.5 3.38 4.5 7.5C4.5 13.12 12 24 12 24C12 24 19.5 13.12 19.5 7.5C19.5 3.38 16.12 0 12 0ZM12 10.125C10.6687 10.125 9.39074 9.59178 8.44026 8.64131C7.48978 7.69083 6.95656 6.41287 6.95656 5.08156C6.95656 3.75025 7.48978 2.47229 8.44026 1.52181C9.39074 0.571332 10.6687 0.0381119 12 0.0381119C13.3313 0.0381119 14.6093 0.571332 15.5597 1.52181C16.5102 2.47229 17.0434 3.75025 17.0434 5.08156C17.0434 6.41287 16.5102 7.69083 15.5597 8.64131C14.6093 9.59178 13.3313 10.125 12 10.125Z" />
              </svg>
              {propertyDetails.address || "Property Address"}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
              <span className="text-xs text-[#4F4F4F] flex items-center">
                <TfiRulerAlt2 className="mr-1" /> {propertyDetails.size || "N/A"} Sq M
              </span>
              {propertyDetails.features?.map((feature, index) => (
                <span
                  key={index}
                  className="text-xs text-[#4F4F4F] flex items-center"
                >
                  {feature === "Str Lights" && (
                    <img
                      src="/wand.svg"
                      alt="Street Lights"
                      className="mr-1 w-3 h-3"
                    />
                  )}
                  {feature === "Gym" && (
                    <BiDumbbell className="h-4 w-4 mr-1" />
                  )}
                  {feature === "Land" && (
                    <img
                      src="/land.svg"
                      alt="Land"
                      className="mr-1 w-3 h-3"
                    />
                  )}
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="documents"
              className="block text-[#4F4F4F] font-[325] text-[14px] mb-2"
            >
              Documents
            </label>

            <div className="border border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex flex-col items-center justify-center py-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <p className="mt-2 text-sm text-gray-500">
                    PDF, DOC, JPG, PNG (Max 10MB)
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 max-h-[150px] overflow-y-auto pr-1 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center  w-fit rounded-full pl-3 pr-2 py-1 bg-[#F2F2F2]"
                    >
                      <span className="text-sm text-[#4F4F4F] truncate max-w-[150px]">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-2 text-[#828282] hover:text-red-500 text-lg leading-none"
                        aria-label={`Remove ${file.name}`}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Display duplicate file error message here */}
            {duplicateFileError && (
              <p className="text-red-500 text-sm mt-1">
                {duplicateFileError}
              </p>
            )}
            {formik.errors.documents && formik.touched.documents && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.documents as string}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-[90px]">
            <button
              type="submit"
              className="w-full max-w-[217px] h-[50px] sm:h-[61px] font-semibold rounded-[60px] bg-[#79B833] text-white text-sm sm:text-base hover:bg-[#79B833] px-6 sm:px-[87px] py-3 sm:py-[21px]"
              disabled={uploadedFiles.length === 0 || isLoading || !!duplicateFileError}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                "Done"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};