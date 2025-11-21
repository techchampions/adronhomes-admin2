// EditJobModal.tsx
import React from "react";
import { useFormik } from "formik";
import { JobData } from "./TABLE";
import InputAreaField from "../components/input/TextArea";
import OptionInputField from "../components/input/drop_down";
import InputField from "../components/input/inputtext";

interface EditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => void;
  jobData: JobData | null;
  loading: boolean;
}

const jobTypeOptions = [
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

const EditJobModal: React.FC<EditJobModalProps> = ({
  isOpen,
  onClose,
  onSave,
  jobData,
  loading,
}) => {
  const formik = useFormik({
    initialValues: {
      id: jobData?.id || 0,
      job_title: jobData?.job_title || "",
      description: jobData?.description || "",
      location: jobData?.location || "",
      job_type: jobData?.job_type || "",
      key_responsibility: jobData?.key_responsibility || "",
      requirements: jobData?.requirements || "",
      qualifications: jobData?.qualifications || "",
      compensation: jobData?.compensation || "",
      address: jobData?.address || "",
      created_at: jobData?.created_at || null,
      views: jobData?.views || 0,
      total_applications: jobData?.total_applications || 0,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const dataToSend = new FormData();
      // Append all fields to FormData
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          const value = (values as any)[key];
          // Only append non-null and non-undefined values, and convert numbers to strings
          if (value !== null && value !== undefined) {
            dataToSend.append(key, String(value));
          }
        }
      }
      // If your API expects a _method=PUT for POST requests to simulate PUT
      dataToSend.append("_method", "POST");

      onSave(dataToSend);
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#17191CBA] bg-opacity-25 flex items-center justify-center p-0 sm:p-4 overflow-y-auto overflow-x-hidden z-40">
      <div className="bg-white rounded-[30px] p-0 shadow-xl max-w-lg w-full mx-auto max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center px-6 pt-6 pb-3 border-b flex-shrink-0">
          <h2 className="text-base sm:text-lg md:text-xl font-medium text-dark">
            Edit Job: {jobData?.job_title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto px-6 py-4 custom-scrollbar flex-grow">
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4 mb-6">
              <InputField
                label="Job Title"
                placeholder="Enter job title"
                name="job_title"
                value={formik.values.job_title}
                onChange={formik.handleChange}
                required
              />

              <InputAreaField
                label="Description"
                placeholder="Enter job description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                required
                // rows={4}
              />

              <InputField
                label="Location"
                placeholder="Enter job location"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                required
              />

              <OptionInputField
                label="Job Type"
                placeholder="Select job type"
                name="job_type"
                value={formik.values.job_type}
                onChange={(value) => formik.setFieldValue("job_type", value)}
                options={jobTypeOptions}
                dropdownTitle="Job Types"
              />

              <InputField
                label="Compensation"
                placeholder="Enter compensation amount"
                name="compensation"
                type="number"
                value={formik.values.compensation}
                onChange={formik.handleChange}
              />

              <InputAreaField
                label="Key Responsibilities"
                placeholder="Enter key responsibilities"
                name="key_responsibility"
                value={formik.values.key_responsibility}
                onChange={formik.handleChange}
                // rows={3}
              />

              <InputAreaField
                label="Requirements"
                placeholder="Enter job requirements"
                name="requirements"
                value={formik.values.requirements}
                onChange={formik.handleChange}
                // rows={3}
              />

              <InputAreaField
                label="Qualifications"
                placeholder="Enter required qualifications"
                name="qualifications"
                value={formik.values.qualifications}
                onChange={formik.handleChange}
                // rows={3}
              />

              <InputField
                label="Address"
                placeholder="Enter company address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
            </div>

            {/* Buttons - Fixed */}
            <div className="flex justify-between items-center gap-2 mt-4 sm:mt-6 md:mt-8 flex-shrink-0 pt-4 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-3 sm:py-2 sm:px-4 text-[#272727] text-xs sm:text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading ? "bg-[#272727]/70" : "bg-[#272727]"
                } text-white text-xs sm:text-sm font-medium rounded-full py-2 px-4 sm:py-2.5 sm:px-6 flex items-center justify-center min-w-[80px] sm:min-w-[100px]`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white"
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
                    <span className="truncate">Saving...</span>
                  </>
                ) : (
                  "save changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;
