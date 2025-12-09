import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useContext,
} from "react";
import InputField from "../../../components/input/inputtext";
import EnhancedOptionInputField from "../../../components/input/enhancedSelecet";
import { CITTA_LINKS, formatToNaira, validationSchema } from "./types";
import { useFormik } from "formik";
import { PropertyContext } from "../../../MyContext/MyContext";

interface Duration {
  id: any;
  duration: any; // in months
  price: any;
  cittaLink: any;
}

export interface LandSizeSection {
  id: number;
  size: any; // in sqm
  durations: Duration[];
}

interface PropertyListingPageProps {
  // Add any props if needed
}

// Define the ref interface for the component
export interface PropertyListingPageRef {
  handleSubmit: () => Promise<boolean>;
  isValid: boolean;
}

// Create interface for form values
interface PropertyListingFormValues {
  landSizeSections: LandSizeSection[];
}

const PropertyListingPage = forwardRef<
  PropertyListingPageRef,
  PropertyListingPageProps
>((props, ref) => {
  const { formData, setLandSizeSections } = useContext(PropertyContext)!;
  const [propertyName, setPropertyName] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [landPlan, setLandPlan] = useState<any>(null);

  // Add a new land size section
  const addLandSizeSection = () => {
    const newSection: LandSizeSection = {
      id: Date.now(),
      size: 500, // Default new size
      durations: [{ id: Date.now() + 1, duration: 3, price: 0, cittaLink: "" }],
    };

    setLandSizeSections([...formData.LandSizeSection, newSection]);
  };

  // Remove a land size section
  const removeLandSizeSection = (sectionId: number) => {
    if (formData.LandSizeSection.length > 1) {
      const updatedSections = formData.LandSizeSection.filter(
        (section) => section.id !== sectionId
      );
      setLandSizeSections(updatedSections);
    }
  };

  // Add a duration to a specific land size section
  const addDurationToSection = (sectionId: number) => {
    const updatedSections = formData.LandSizeSection.map((section) => {
      if (section.id === sectionId) {
        const lastDuration = section.durations[section.durations.length - 1];
        const newDuration = lastDuration ? lastDuration.duration + 3 : 3;

        return {
          ...section,
          durations: [
            ...section.durations,
            {
              id: Date.now(),
              duration: newDuration,
              price: 0,
              cittaLink: "",
            },
          ],
        };
      }
      return section;
    });
    setLandSizeSections(updatedSections);
  };

  // Remove a duration from a section
  const removeDurationFromSection = (sectionId: number, durationId: number) => {
    const updatedSections = formData.LandSizeSection.map((section) => {
      if (section.id === sectionId && section.durations.length > 1) {
        return {
          ...section,
          durations: section.durations.filter((d) => d.id !== durationId),
        };
      }
      return section;
    });
    setLandSizeSections(updatedSections);
  };

  // Update land size
  const updateLandSize = (sectionId: number, value: string) => {
    const sizeValue = parseFloat(value) || null;
    const updatedSections = formData.LandSizeSection.map((section) =>
      section.id === sectionId ? { ...section, size: sizeValue } : section
    );
    setLandSizeSections(updatedSections);
  };

  // Update duration
  const updateDuration = (
    sectionId: number,
    durationId: number,
    field: keyof Duration,
    value: string
  ) => {
    const updatedSections = formData.LandSizeSection.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          durations: section.durations.map((duration) =>
            duration.id === durationId
              ? {
                  ...duration,
                  [field]:
                    field === "duration" || field === "price"
                      ? parseFloat(value) || null
                      : value,
                }
              : duration
          ),
        };
      }
      return section;
    });
    setLandSizeSections(updatedSections);
  };

  const formik = useFormik<PropertyListingFormValues>({
    initialValues: {
      landSizeSections: formData.LandSizeSection,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission
      setLandSizeSections(values.landSizeSections);
      alert(values.landSizeSections)
      // You can also set the form data or trigger any other actions here
    },
  });

  // Update formik values when formData changes
  React.useEffect(() => {
    if (formData.LandSizeSection !== formik.values.landSizeSections) {
      formik.setValues({ landSizeSections: formData.LandSizeSection });
    }
  }, [formData.LandSizeSection]);

  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      // Validate all form fields
      const errors = await formik.validateForm();
      const hasErrors = Object.keys(errors).length > 0;

      if (hasErrors) {
        // Set touched for all fields to trigger error display
        const touchedFields = formik.values.landSizeSections.reduce(
          (acc, section, sectionIndex) => {
            // Mark section size as touched
            acc[`landSizeSections[${sectionIndex}].size`] = true;

            // Mark each duration's fields as touched
            section.durations.forEach((duration, durationIndex) => {
              acc[
                `landSizeSections[${sectionIndex}].durations[${durationIndex}].duration`
              ] = true;
              acc[
                `landSizeSections[${sectionIndex}].durations[${durationIndex}].price`
              ] = true;
              acc[
                `landSizeSections[${sectionIndex}].durations[${durationIndex}].cittaLink`
              ] = true;
            });

            return acc;
          },
          {} as Record<string, boolean>
        );

        formik.setTouched(touchedFields, true);
        return false;
      } else {
        // Submit the form if valid
        await formik.submitForm();
        return true;
      }
    },
    isValid: formik.isValid,
  }));

  // Helper function to get error message for a field
  const getErrorMessage = (fieldPath: string): string | undefined => {
    const error = formik.errors as any;
    if (error && error.landSizeSections) {
      const pathParts = fieldPath.split(".");
      let current = error.landSizeSections;

      for (let i = 0; i < pathParts.length; i++) {
        if (current && current[pathParts[i]] !== undefined) {
          current = current[pathParts[i]];
        } else {
          return undefined;
        }
      }

      return typeof current === "string" ? current : undefined;
    }
    return undefined;
  };

  // Helper function to check if a field is touched
  const isFieldTouched = (fieldPath: string): boolean => {
    const touched = formik.touched as any;
    if (touched && touched.landSizeSections) {
      const pathParts = fieldPath.split(".");
      let current = touched.landSizeSections;

      for (let i = 0; i < pathParts.length; i++) {
        if (current && current[pathParts[i]] !== undefined) {
          current = current[pathParts[i]];
        } else {
          return false;
        }
      }

      return current === true;
    }
    return false;
  };

  return (
    <div className="">
      <div className="mx-auto">
        <form onSubmit={formik.handleSubmit} className="space-y-8">
          {/* Land Sizes Section */}
          <div className="">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                {/* Land Sizes & Pricing */}
                
              </h2>
              <button
                type="button"
                onClick={addLandSizeSection}
                className="px-4 py-2 bg-[#57713A] text-white text-sm font-medium rounded-[60px] hover:bg-[#57713A]/80 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add Land Size</span>
              </button>
            </div>

            {/* Land Size Sections */}
            <div className="space-y-8">
              {formData.LandSizeSection.map((section, sectionIndex) => (
                <div
                  key={section.id}
                  className="border border-gray-200 rounded-2xl p-6 relative bg-gray-50/50"
                >
                  {/* Remove section button (only show if more than one section) */}
                  {formData.LandSizeSection.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLandSizeSection(section.id)}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove this land size"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Land Size Input */}
                  <div className="mb-6">
                    <InputField
                      label="Land Size (sqm)"
                      placeholder="Enter land size in square meters"
                      type="number"
                      name={`landSizeSections[${sectionIndex}].size`}
                      value={section.size}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateLandSize(section.id, e.target.value)
                      }
                      error={
                        isFieldTouched(`${sectionIndex}.size`) &&
                        getErrorMessage(`${sectionIndex}.size`)
                      }
                      // onBlur={() => formik.setFieldTouched(`landSizeSections[${sectionIndex}].size`, true)}
                      required
                    />
                  </div>

                  {/* Durations & Pricing */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-medium text-gray-700">
                        Duration & Pricing
                      </h3>
                      <button
                        type="button"
                        onClick={() => addDurationToSection(section.id)}
                        className="px-3 py-1.5 text-sm bg-[#57713A]/18 text-[#57713A] hover:bg-blue-200 font-medium rounded-[60px] flex items-center gap-1 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add Duration
                      </button>
                    </div>

                    {/* Duration Rows */}
                    {section.durations.map((duration, durationIndex) => (
                      <div
                        key={duration.id}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 bg-white border border-gray-200 rounded-xl"
                      >
                        {/* Duration Input */}
                        <div>
                          <InputField
                            label="Duration (months)"
                            placeholder="Enter duration in months"
                            type="number"
                            name={`landSizeSections[${sectionIndex}].durations[${durationIndex}].duration`}
                            value={duration.duration}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              updateDuration(
                                section.id,
                                duration.id,
                                "duration",
                                e.target.value
                              )
                            }
                            error={
                              isFieldTouched(
                                `${sectionIndex}.durations[${durationIndex}].duration`
                              ) &&
                              getErrorMessage(
                                `${sectionIndex}.durations[${durationIndex}].duration`
                              )
                            }
                            //   onBlur={() => formik.setFieldTouched(`landSizeSections[${sectionIndex}].durations[${durationIndex}].duration`, true)}
                            required
                          />
                        </div>

                        {/* Price Input */}
                        <div>
                          <InputField
                            label="Price (₦)"
                            placeholder="Enter price"
                            type="text"
                            name={`landSizeSections[${sectionIndex}].durations[${durationIndex}].price`}
                            value={formatToNaira(duration.price)}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const raw = e.target.value.replace(/[^0-9]/g, "");
                              const amount = raw ? parseInt(raw) : "";
                              updateDuration(
                                section.id,
                                duration.id,
                                "price",
                                amount.toString()
                              );
                            }}
                            error={
                              isFieldTouched(
                                `${sectionIndex}.durations[${durationIndex}].price`
                              ) &&
                              getErrorMessage(
                                `${sectionIndex}.durations[${durationIndex}].price`
                              )
                            }
                            //   onBlur={() => formik.setFieldTouched(`landSizeSections[${sectionIndex}].durations[${durationIndex}].price`, true)}
                            required
                          />
                        </div>

                        {/* Citta Link Input */}
                        <div className="md:col-span-2">
                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <EnhancedOptionInputField
                                label="Connect Citta Id"
                                placeholder="Select Citta link"
                                name={`landSizeSections[${sectionIndex}].durations[${durationIndex}].cittaLink`}
                                value={duration.cittaLink}
                                onChange={(value: string) =>
                                  updateDuration(
                                    section.id,
                                    duration.id,
                                    "cittaLink",
                                    value
                                  )
                                }
                                //   onBlur={() => formik.setFieldTouched(`landSizeSections[${sectionIndex}].durations[${durationIndex}].cittaLink`, true)}
                                options={CITTA_LINKS}
                                isSearchable
                                error={
                                  isFieldTouched(
                                    `${sectionIndex}.durations[${durationIndex}].cittaLink`
                                  ) &&
                                  getErrorMessage(
                                    `${sectionIndex}.durations[${durationIndex}].cittaLink`
                                  )
                                }
                              />
                            </div>

                            {/* Remove duration button (only show if more than one duration) */}
                            {section.durations.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeDurationFromSection(
                                    section.id,
                                    duration.id
                                  )
                                }
                                className="h-[42px] mb-[2px] px-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-[60px] flex items-center justify-center transition-colors"
                                title="Remove this duration"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Section separator */}
                  {sectionIndex < formData.LandSizeSection.length - 1 && (
                    <div className="mt-8 pt-8 border-t border-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

PropertyListingPage.displayName = "PropertyListingPage";

export default PropertyListingPage;
