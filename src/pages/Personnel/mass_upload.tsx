import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { bulkUploadEmployees } from "../../components/Redux/personnel/bulkUploadSlice";
import { AppDispatch } from "../../components/Redux/store";

interface MassUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  x: () => void;
}

interface FileUploadFieldProps {
  label: string;
  placeholder?: string;
  onChange: (files: FileList | null) => void;
  onBlur?: () => void;
  error?: string | false | undefined;
  accept?: string;
}

const validationSchema = Yup.object().shape({
  files: Yup.mixed()
    .required("Files are required")
    .test("fileRequired", "Please upload at least one file", function (value) {
      return value && value instanceof FileList && value.length > 0;
    })
    .test(
      "fileType",
      "Please upload a valid Excel file (.xlsx, .xls)",
      function (value) {
        if (!value || !(value instanceof FileList) || value.length === 0)
          return false;

        const file = value[0];
        const validTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ];
        const validExtensions = [".xlsx", ".xls"];

        return (
          validTypes.includes(file.type) ||
          validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
        );
      }
    ),
});

const FileUploadField = React.forwardRef<
  HTMLInputElement,
  FileUploadFieldProps
>(({ label, placeholder, onChange, onBlur, error, accept }, ref) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        accept={accept}
        ref={ref}
        onChange={(e) => {
          onChange(
            e.target.files && e.target.files.length > 0 ? e.target.files : null
          );
        }}
        onBlur={onBlur}
        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        multiple={false}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

const MassUploadModal: React.FC<MassUploadModalProps> = ({
  isOpen,
  onClose,
  x,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [uploadStatus, setUploadStatus] = React.useState<
    "idle" | "success" | "error"
  >("idle");

  const formik = useFormik({
    initialValues: {
      files: null as FileList | null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!values.files || values.files.length === 0) {
          throw new Error("No files selected for upload");
        }

        setUploadStatus("idle");
        setStatusMessage("Uploading personnel data...");

        const formData = new FormData();
        formData.append("file", values.files[0]);
        const response = await dispatch(bulkUploadEmployees(formData)).unwrap();

        setUploadStatus("success");
        setStatusMessage(
          response.data
            ? `Upload completed: ${response.data.successful_uploads} successful, ${response.data.failed_uploads} failed`
            : "Personnel uploaded successfully!"
        );

        setTimeout(() => {
          onClose();
          resetForm();
          setStatusMessage("");
          setUploadStatus("idle");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 2000);
      } catch (error) {
        console.error("Error submitting files:", error);
        setUploadStatus("error");
        setStatusMessage(
          error instanceof Error
            ? error.message
            : "Upload failed. Please try again."
        );
        formik.setFieldError("files", "Upload failed. Please try again.");
        setTimeout(() => {
          setStatusMessage("");
          setUploadStatus("idle");
        }, 3000);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    onClose();
    formik.resetForm();
    setStatusMessage("");
    setUploadStatus("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto z-40">
      <div className="relative bg-white rounded-2xl sm:rounded-3xl md:rounded-[40px] w-full max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-6">
        <p
          className="absolute top-4 right-4 md:top-6 md:right-6 cursor-pointer text-lg md:text-base"
          onClick={() => {
            x();
            handleClose();
          }}
        >
          ×
        </p>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-6">
            <p className="text-dark font-[350] text-2xl mb-2">Upload</p>
            <h1 className="text-base text-dark font-[325] mb-6">
              Onboard multiple employees
            </h1>
            <FileUploadField
              label="Upload Excel File"
              placeholder="Click to upload files"
              onChange={(files) => formik.setFieldValue("files", files)}
              error={formik.touched.files && formik.errors.files}
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              ref={fileInputRef}
            />
            {statusMessage && (
              <div
                className={`mt-2 p-2 rounded-md ${
                  uploadStatus === "success"
                    ? "bg-green-100 text-green-800"
                    : uploadStatus === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {statusMessage}
              </div>
            )}
            <div className="mt-4 text-xs text-gray-500">
              <p>Supported formats: .xlsx, .xls</p>
              <p className="mt-1">
                Download template:
                <a
                  href="/path-to-template/employee-template.xlsx"
                  download
                  className="text-blue-600 hover:underline ml-1"
                >
                  Employee Template
                </a>
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center gap-2 mt-8">
            <button
              type="button"
              onClick={handleClose}
              className="py-1.5 sm:py-2 px-3 sm:px-4 text-[#272727] text-xs sm:text-sm md:text-base font-bold"
              disabled={formik.isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#272727] text-xs sm:text-sm md:text-base font-bold text-white rounded-full py-2 px-4 sm:py-3 sm:px-6 md:py-[21px] md:px-[82px] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {formik.isSubmitting ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MassUploadModal;
