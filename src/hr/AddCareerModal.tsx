import React, { useState, useEffect } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import InputField from "../components/input/inputtext";
import OptionInputField from "../components/input/drop_down";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../components/Redux/store";
import InputAreaField from "../components/input/TextArea";
import { selectCreateJobLoading, selectCreateJobSuccess, selectCreateJobError, resetCreateJobState } from "../components/Redux/carreer/create_job_slice";
import { createJob } from "../components/Redux/carreer/create_job_thunk";
import { fetchCareers } from "../components/Redux/carreer/career_thunk";

// Define the props for the AddCareerModal
interface AddCareerModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Define the form values for the Add Job form to match API fields
interface AddJobFormValues {
  job_title: string;
  description: string;
  key_responsibility: string;
  requirements: string;
  qualifications: string;
  job_type: string;
  location: string;
  address: string;
  compensation: number | '';
}

// Options for Job Type dropdown
const jobTypeOptions = [
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

// Options for Location dropdown (Onsite or Remote)
const locationOptions = [
  { value: "Onsite", label: "Onsite" },
  { value: "Remote", label: "Remote" },
  { value: "Hybrid", label: "Hybrid" },
];

// Validation schema
const validationSchema = Yup.object().shape({
  job_title: Yup.string().required("Job Title is required"),
  description: Yup.string().required("Description is required"),
  key_responsibility: Yup.string().required("Key Responsibilities are required"),
  requirements: Yup.string().required("Requirements are required"),
  qualifications: Yup.string(),
  job_type: Yup.string().required("Job Type is required"),
  location: Yup.string().required("Location is required"),
  address: Yup.string(),
  compensation: Yup.number().nullable().typeError("Compensation must be a number").min(0, "Compensation cannot be negative"),
});

const AddCareerModal: React.FC<AddCareerModalProps> = ({
  isOpen = true,
  onClose = () => {},
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux states for create job operation
  const createJobLoading = useSelector(selectCreateJobLoading);
  const createJobSuccess = useSelector(selectCreateJobSuccess);
  const createJobError = useSelector(selectCreateJobError);

  const handleSubmit = async (
    values: AddJobFormValues,
    { setSubmitting, resetForm }: FormikHelpers<AddJobFormValues>
  ) => {
    setSubmitting(true);

    const formData = new FormData();
    formData.append("job_title", values.job_title);
    formData.append("description", values.description);
    formData.append("key_responsibility", values.key_responsibility);
    formData.append("requirements", values.requirements);
    formData.append("qualifications", values.qualifications || '');
    formData.append("job_type", values.job_type);
    formData.append("location", values.location);
    formData.append("address", values.address || '');
    formData.append("compensation", values.compensation !== '' ? String(values.compensation) : '0');

    await dispatch(createJob({ credentials: formData }));
    setSubmitting(false);
  };

  // Effect for create job operation feedback
  useEffect(() => {
    if (createJobSuccess) {
      // toast.success("Job added successfully!");
      dispatch(resetCreateJobState());
        dispatch(fetchCareers());
      onClose();
    }
    if (createJobError) {
      dispatch(resetCreateJobState());
    }
  }, [createJobSuccess, createJobError, dispatch, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#17191CBA] bg-opacity-25 flex items-center justify-center p-0 sm:p-4 overflow-y-auto overflow-x-hidden z-40">
      {/* Modal container with responsive sizing */}
      <div className="bg-white rounded-[30px] sm:rounded-[30px] md:rounded-[30px] w-full max-w-[95vw] mx-2 xs:mx-0 xs:max-w-xs sm:max-w-md md:max-w-lg my-1 p-3 sm:p-4 md:p-6 z-50 flex flex-col max-h-[90vh]">
        {/* Header section - Fixed */}
        <div className="flex justify-between items-center mb-2 sm:mb-3 flex-shrink-0">
          <h2 className="text-base sm:text-lg md:text-xl font-medium text-dark">
            Add Job
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 flex-shrink-0">
          Add a new Job opportunity
        </p>

        {/* Scrollable content area */}
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <Formik
            initialValues={{
              job_title: "",
              description: "",
              key_responsibility: "",
              requirements: "",
              qualifications: "",
              job_type: "",
              location: "",
              address: "",
              compensation: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange, values, isSubmitting }) => (
              <Form id="add-job-form">
                {/* Form fields with responsive spacing */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <InputField
                    label="Job Title"
                    placeholder="Job Title"
                    value={values.job_title}
                    onChange={handleChange}
                    name="job_title"
                    error={touched.job_title && errors.job_title}
                    required
                  />

                  <InputAreaField
                    label="Description"
                    placeholder="Description"
                    value={values.description}
                    onChange={handleChange}
                    name="description"
                    error={touched.description && errors.description}
                    required
                  />

                  <InputAreaField
                    label="Key Responsibilities"
                    placeholder="Key Responsibilities"
                    value={values.key_responsibility}
                    onChange={handleChange}
                    name="key_responsibility"
                    error={touched.key_responsibility && errors.key_responsibility}
                    required
                  />

                  <InputAreaField
                    label="Requirements"
                    placeholder="Requirements"
                    value={values.requirements}
                    onChange={handleChange}
                    name="requirements"
                    error={touched.requirements && errors.requirements}
                    required
                  />

                  <InputAreaField
                    label="Qualifications"
                    placeholder="Qualifications"
                    value={values.qualifications}
                    onChange={handleChange}
                    name="qualifications"
                    error={touched.qualifications && errors.qualifications}
                  />

                  <OptionInputField
                    label="Job Type"
                    placeholder="Select Job Type"
                    value={values.job_type}
                    onChange={(value: any) => {
                      handleChange({
                        target: {
                          name: "job_type",
                          value,
                        },
                      } as any);
                    }}
                    name="job_type"
                    error={touched.job_type && errors.job_type}
                    options={jobTypeOptions}
                  />

                  <OptionInputField
                    label="Location"
                    placeholder="Select Location Type"
                    value={values.location}
                    onChange={(value: any) => {
                      handleChange({
                        target: {
                          name: "location",
                          value,
                        },
                      } as any);
                    }}
                    name="location"
                    error={touched.location && errors.location}
                    options={locationOptions}
                    dropdownTitle="Select Location Type"
                  />

                  <InputField
                    label="Address"
                    placeholder="e.g., 123 Main St, City, Country"
                    value={values.address}
                    onChange={handleChange}
                    name="address"
                    error={touched.address && errors.address}
                  />

                  <InputField
                    label="Compensation"
                    placeholder="e.g., 100000"
                    value={values.compensation}
                    onChange={handleChange}
                    name="compensation"
                    type="number"
                    error={touched.compensation && errors.compensation}
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
                    disabled={isSubmitting || createJobLoading}
                    className={`${
                      isSubmitting || createJobLoading ? 'bg-[#272727]/70' : 'bg-[#272727]'
                    } text-white text-xs sm:text-sm font-medium rounded-full py-2 px-4 sm:py-2.5 sm:px-6 flex items-center justify-center min-w-[80px] sm:min-w-[100px]`}
                  >
                    {isSubmitting || createJobLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="truncate">Adding...</span>
                      </>
                    ) : (
                      "Add Job"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddCareerModal;