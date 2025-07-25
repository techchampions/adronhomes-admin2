import React, { useEffect, useState, ChangeEvent } from "react";
import { useFormik } from "formik";
import { BiDumbbell } from "react-icons/bi";
import { TfiRulerAlt2 } from "react-icons/tfi";
import * as Yup from "yup";

// --- Interfaces (No changes needed here) ---
interface ContractDocument {
  id?: number;
  document_file: string | File;
  // If your existing documents have other properties you need to pass, add them here
  plan_id?: number; // Added for clarity if your existing docs also carry plan_id
  [key: string]: any; // For any additional properties
}

interface PropertyDocumentsModalProps {
  onClose: () => void;
  onSubmit: (values: {
    documents: Array<{ plan_id: number; document_file: File | string }>;
    removedDocuments?: number[];
  }) => Promise<void>;
  propertyDetails: PropertyDetails;
  isLoading?: boolean;
  initialDocuments?: ContractDocument[];
  isEditMode?: boolean;
}

interface FileWithPreview {
  file: File | string; // Can be a File object (new) or a string URL (existing)
  preview: string;
  name: string;
  isExisting?: boolean; // True if loaded from initialDocuments
  id?: number; // ID of the existing document if applicable
  plan_id?: number; // Include plan_id if relevant for existing documents
}

interface PropertyDetails {
  name: string;
  address: string;
  size: string;
  display_image: string;
  features?: string[];
}

// --- PropertyDocumentsModal Component ---
export const PropertyDocumentsModal: React.FC<PropertyDocumentsModalProps> = ({
  onClose,
  onSubmit,
  propertyDetails,
  isLoading = false,
  initialDocuments = [],
  isEditMode = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [removedExistingFiles, setRemovedExistingFiles] = useState<number[]>([]);
  const [originalFiles, setOriginalFiles] = useState<FileWithPreview[]>([]); // To reset on cancel in edit mode

  // --- useEffect to Initialize State with Existing Documents ---
  useEffect(() => {
    if (isEditMode && initialDocuments.length > 0) {
      const existingFiles = initialDocuments.map((doc) => ({
        file: doc.document_file, // This will be the string URL from the backend
        preview:
          typeof doc.document_file === "string"
            ? doc.document_file // Preview is the URL itself for existing
            : URL.createObjectURL(doc.document_file), // For any local File objects (unlikely for initial, but safe)
        name:
          typeof doc.document_file === "string"
            ? doc.document_file.split("/").pop() || "Document" // Extract name from URL
            : doc.document_file.name, // Use file name for File objects
        isExisting: true,
        id: doc.id, // Crucial for identifying existing documents for potential removal
        plan_id: doc.plan_id, // Pass plan_id if available on your ContractDocument
      }));
      setUploadedFiles(existingFiles);
      setOriginalFiles(existingFiles); // Save initial state for potential reset
    } else if (!isEditMode) {
      // Clear files if switching from edit to create, or just initializing for create
      setUploadedFiles([]);
      setRemovedExistingFiles([]);
      setOriginalFiles([]);
    }
    // Cleanup URL objects if component unmounts or initialDocuments change
    return () => {
      uploadedFiles.forEach(file => {
        if (file.file instanceof File) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [isEditMode, initialDocuments]); // Depend on initialDocuments and isEditMode

  // --- useEffect to Keep Formik in Sync with uploadedFiles ---
  // This is vital for validation and ensuring Formik always has the latest set of docs
  useEffect(() => {
    const documentsValue = uploadedFiles.map((f) => ({
      // If the document is existing, use its original plan_id if available, otherwise default to 0
      // The parent component's handleSubmit will likely set the definitive plan_id
      plan_id: f.plan_id || 0,
      document_file: f.file, // This correctly includes both string URLs and File objects
    }));

    formik.setFieldValue("documents", documentsValue);
    formik.validateField("documents"); // Manually trigger validation
  }, [uploadedFiles]); // Re-run whenever uploadedFiles changes

  // --- Formik Setup ---
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
      // The `documents` array in `values` already contains both new File objects
      // and string URLs for existing documents, thanks to the useEffect above.
      // We just ensure the structure matches the onSubmit prop's expectation.
      const allCurrentDocumentsForSubmission = uploadedFiles.map((f) => ({
        plan_id: f.plan_id || 0, // Use the stored plan_id or default
        document_file: f.file,
      }));

      const submitValues = {
        documents: allCurrentDocumentsForSubmission,
        removedDocuments: isEditMode ? removedExistingFiles : [],
      };

      await onSubmit(submitValues);
      // Optional: Reset states after successful submission if modal closes automatically
      // setUploadedFiles([]);
      // setRemovedExistingFiles([]);
    },
  });

  // --- File Handling Functions ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        isExisting: false, // Newly added files are not existing
        // No id or plan_id for new files yet, they'll get assigned by backend
      }));

      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];

    // If removing an existing file, add its ID to the `removedExistingFiles` list
    if (fileToRemove.isExisting && typeof fileToRemove.id === "number") {
      setRemovedExistingFiles((prev) => [...prev, fileToRemove.id!]);
    }

    // Revoke object URL for newly added files to prevent memory leaks
    if (fileToRemove.file instanceof File) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    // Remove the file from the `uploadedFiles` state
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const handleCancel = () => {
    // Revoke any created URLs for unsaved new files
    uploadedFiles.forEach(file => {
      if (!file.isExisting && file.file instanceof File) {
        URL.revokeObjectURL(file.preview);
      }
    });

    // Reset files to original state if in edit mode, otherwise clear them
    if (isEditMode) {
      setUploadedFiles(originalFiles);
      setRemovedExistingFiles([]);
    } else {
      setUploadedFiles([]);
      setRemovedExistingFiles([]);
    }
    onClose(); // Close the modal
  };

  // --- Render JSX (No major changes here, mostly styling and structure) ---
  return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[40px] p-6 w-full max-w-md mx-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#1E1E1E]">
            {isEditMode
              ? "Edit Property Documents"
              : "Upload Property Documents"}
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
          {isEditMode
            ? "Edit the documents for this property."
            : "Upload the documents for this property."}
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
                      src="/wand.svg" // Make sure this path is correct
                      alt="Street Lights"
                      className="mr-1 w-3 h-3"
                    />
                  )}
                  {feature === "Gym" && (
                    <BiDumbbell className="h-4 w-4 mr-1" />
                  )}
                  {feature === "Land" && (
                    <img
                      src="/land.svg" // Example: Use /land.svg for consistency or provide actual path
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
                      key={file.id || index} // Use file.id for existing docs, fall back to index
                      className={`flex items-center rounded-full pl-3 pr-2 py-1 ${
                        file.isExisting ? "bg-[#E0F7FA]" : "bg-[#F2F2F2]"
                      }`}
                    >
                      <span className="text-sm text-[#4F4F4F] truncate max-w-[150px]">
                        {file.name}
                      </span>
                      {file.isExisting && (
                        <span className="ml-1 text-xs text-[#79B833]">
                          (existing)
                        </span>
                      )}
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
              disabled={uploadedFiles.length === 0 || isLoading}
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
                  {isEditMode ? "Updating..." : "Uploading..."}
                </div>
              ) : isEditMode ? (
                "Update"
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