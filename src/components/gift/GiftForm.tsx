// GiftForm.tsx - Complete with image upload and preview - FULLY FIXED with no auto-submit
import React, { useEffect, useCallback, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import EnhancedOptionInputFieldtwo from "../input/enhancedselecttwo";
import InputField from "../input/inputtext";
import RichTextEditor from "../input/TextArea";
import {
  selectGiftFormData,
  selectIsEditing,
  selectEditingId,
  selectIsFormLoading,
  selectFormError,
  selectIsFormDirty,
} from "../Redux/gift/giftFormSelectors";
import {
  clearDirty,
  setEditingMode,
  resetForm,
  updateField,
  setLoading,
  setError,
  clearImage,
} from "../Redux/gift/giftFormSlice";
import { AppDispatch } from "../Redux/store";
import { GiftFormData } from "../Redux/gift/giftFormSlice";
import { clearGiftSuccess } from "../Redux/gift/gift_slice";
import { updateGift, createGift } from "../Redux/gift/gift_thunk";
import { Link } from "react-router-dom";

// Gift Type options with measurement units
const giftTypeOptions = [
  { value: "land", label: "Land", unit: "Plot/SQM" },
  { value: "house", label: "House", unit: "Unit/Room" },
  {
    value: "standard",
    label: "Standard (Cow, Food, etc.)",
    unit: "units",
  },
];

// Sub-options based on gift type
const landUnitOptions = [
  { value: "plot", label: "Plot" },
  { value: "sqm", label: "Square Meters (SQM)" },
];

const houseUnitOptions = [
  { value: "unit", label: "Unit" },
  { value: "room", label: "Room" },
];

const standardUnitOptions = [
  // { value: "piece", label: "Piece" },
  // { value: "kg", label: "Kilogram (kg)" },
  // { value: "liter", label: "Liter" },
  // { value: "bag", label: "Bag" },
  // { value: "crate", label: "Crate" },
  // { value: "bundle", label: "Bundle" },
  // { value: "dozen", label: "Dozen" },
  { value: "unit", label: "unit" },
];

// Status options
const statusOptions = [
  { value: "active", label: "Active - Available for properties" },
  { value: "pending", label: "Paused - Temporarily unavailable" },

];

interface GiftFormProps {
  editingData?: {
    id: string;
    data: any;
  } | null;
  onSubmit?: (data: any, isEditing: boolean, id?: string) => void;
  onCancel?: () => void;
  onSuccess?: () => void;
  isEditingcondition?: boolean;
}

const GiftForm: React.FC<GiftFormProps> = ({
  editingData = null,
  onSubmit,
  onCancel,
  onSuccess,
  isEditingcondition = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector(selectGiftFormData);
  const isEditing = useSelector(selectIsEditing);
  const editingId = useSelector(selectEditingId);
  const isLoading = useSelector(selectIsFormLoading);
  const formError = useSelector(selectFormError);
  const isDirty = useSelector(selectIsFormDirty);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [step1Completed, setStep1Completed] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);

  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to format number with commas
  const formatNumber = (value: string | number) => {
    if (!value) return "";
    const num =
      typeof value === "string" ? value.replace(/,/g, "") : value.toString();
    if (isNaN(parseFloat(num))) return value;
    return parseFloat(num).toLocaleString("en-NG");
  };

  // Parse number from formatted string
  const parseNumber = (value: string | number) => {
    if (!value) return 0;
    const num =
      typeof value === "string" ? value.replace(/,/g, "") : value.toString();
    return parseFloat(num) || 0;
  };

  // Get measurement unit based on gift type
  const getMeasurementUnit = () => {
    switch (formik.values.giftType) {
      case "land":
        return selectedUnit || "Plot";
      case "house":
        return selectedUnit || "Unit";
      default:
        return selectedUnit || "Piece";
    }
  };

  // Get unit options based on gift type
  const getUnitOptions = () => {
    switch (formik.values.giftType) {
      case "land":
        return landUnitOptions;
      case "house":
        return houseUnitOptions;
      case "standard":
        return standardUnitOptions;
      default:
        return [];
    }
  };

  // Get quantity per property label
  const getQuantityPerPropertyLabel = () => {
    switch (formik.values.giftType) {
      case "land":
        return `How many ${getMeasurementUnit()} of Land per Property?`;
      case "house":
        return `How many ${getMeasurementUnit()} of House per Property?`;
      default:
        return `How many ${getMeasurementUnit()} per Property? (e.g., 2 cows, 5kg rice)`;
    }
  };

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Stop propagation to prevent any form submission
    event.stopPropagation();
    const file = event.target.files?.[0];
    setImageError("");

    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setImageError(
        "Please select a valid image file (JPEG, PNG, GIF, or WEBP)",
      );
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setImageError("Image size must be less than 5MB");
      return;
    }

    setSelectedImage(file);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setExistingImageUrl(""); // Clear existing image URL when new image is selected

    // Update formik and redux with the file
    formik.setFieldValue("displayImage", file);
    dispatch(updateField({ field: "displayImage", value: file }));
    dispatch(updateField({ field: "imagePreview", value: previewUrl }));
  };

  // Remove selected image
  const handleRemoveImage = (e: React.MouseEvent) => {
    // Stop propagation to prevent any form submission
    e.stopPropagation();
    setSelectedImage(null);
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview); // Clean up URL object
    }
    setImagePreview("");
    setExistingImageUrl("");
    setImageError("");
    formik.setFieldValue("displayImage", null);
    dispatch(updateField({ field: "displayImage", value: null }));
    dispatch(updateField({ field: "imagePreview", value: "" }));
    dispatch(clearImage());

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input click
  const handleBrowseClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent any form submission
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  // Step 1: Basic Gift Information
  const step1ValidationSchema = Yup.object({
    giftName: Yup.string()
      .required("Gift name is required")
      .min(3, "Name must be at least 3 characters")
      .max(200, "Name must not exceed 200 characters"),

    giftType: Yup.string().required("Please select gift type"),

    estimatedValue: Yup.number()
      .typeError("Estimated value must be a number")
      .positive("Value must be positive")
      .required("Estimated gift value is required"),

    totalQuantity: Yup.number()
      .typeError("Quantity must be a number")
      .positive("Quantity must be positive")
      .required("Total quantity available is required"),

    quantityPerProperty: Yup.number()
      .typeError("Quantity per property must be a number")
      .positive("Quantity per property must be positive")
      .required("Quantity per property is required"),
  });

  // Step 2: Gift Dates
  const step2ValidationSchema = Yup.object({
    startDate: Yup.date()
      .required("Start date is required")
      .min(new Date(), "Start date cannot be in the past"),

    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),
  });

  // Step 3: Additional Info & Content
  const step3ValidationSchema = Yup.object({
    description: Yup.string()
      .max(10000, "Description cannot exceed 10000 characters")
      .required("Gift description is required"),

    redemptionInstructions: Yup.string().max(
      5000,
      "Instructions cannot exceed 5000 characters",
    ),

    termsAndConditions: Yup.string().max(
      10000,
      "Terms and conditions cannot exceed 10000 characters",
    ),

    status: Yup.string(),
  });

  // Combine validation schemas
  const fullValidationSchema = Yup.object().shape({
    ...step1ValidationSchema.fields,
    ...step2ValidationSchema.fields,
    ...step3ValidationSchema.fields,
  });

  const formik = useFormik<GiftFormData>({
    initialValues: formData,
    validationSchema: fullValidationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm: resetFormik }) => {
      // Prepare submission data matching API expected format
      const submissionData = {
        name: values.giftName,
        type: values.giftType,
        estimated_value: parseNumber(values.estimatedValue),
        total_quantity: parseNumber(values.totalQuantity),
        quantity_per_property: parseNumber(values.quantityPerProperty),
        measurement_unit: getMeasurementUnit(),
        start_date: values.startDate,
        end_date: values.endDate,
        description: values.description,
        redemption_instructions: values.redemptionInstructions,
        terms_and_conditions: values.termsAndConditions,
        status: values.status || "active",
        metadata: {
          brand: values.metadata?.brand || "",
          warranty_period: values.metadata?.warranty_period || "",
          installation_included:
            values.metadata?.installation_included || "false",
        },
        display_image: selectedImage, // Include the image file if selected
      };

      if (onSubmit) {
        await onSubmit(submissionData, isEditing, editingId || undefined);
      } else {
        // Default Redux submission
        dispatch(setLoading(true));
        dispatch(clearGiftSuccess());

        try {
          if (isEditing && editingId) {
            // Update existing gift
            const result = await dispatch(
              updateGift({
                id: parseInt(editingId),
                data: submissionData,
              }),
            ).unwrap();

            if (result.success) {
              dispatch(clearDirty());
              if (onSuccess) onSuccess();
            }
          } else {
            // Create new gift
            const result = await dispatch(createGift(submissionData)).unwrap();

            if (result.success) {
              dispatch(clearDirty());
              if (onSuccess) onSuccess();
            }
          }
        } catch (error: any) {
          dispatch(setError(error.message || "Failed to save gift"));
        } finally {
          dispatch(setLoading(false));
        }
      }
    },
  });

  // Calculate max properties that can receive the gift
  const calculateMaxProperties = useCallback(() => {
    const total = parseNumber(formik.values.totalQuantity);
    const perProperty = parseNumber(formik.values.quantityPerProperty);
    if (total && perProperty && perProperty > 0) {
      return Math.floor(total / perProperty);
    }
    return 0;
  }, [formik.values.totalQuantity, formik.values.quantityPerProperty]);

  // Update remaining quantity
  useEffect(() => {
    if (
      formik.values.totalQuantity &&
      formik.values.claimedCount !== undefined
    ) {
      const remaining =
        parseNumber(formik.values.totalQuantity) -
        (parseNumber(formik.values.claimedCount) || 0);
      const currentRemaining = parseNumber(formik.values.remainingQuantity);
      if (remaining !== currentRemaining) {
        formik.setFieldValue("remainingQuantity", remaining);
        dispatch(updateField({ field: "remainingQuantity", value: remaining }));
      }
    }
  }, [
    formik.values.totalQuantity,
    formik.values.claimedCount,
    dispatch,
    formik,
  ]);

  // Check if step 1 is valid
  const isStep1Valid = useCallback(() => {
    const step1Fields = [
      "giftName",
      "giftType",
      "estimatedValue",
      "totalQuantity",
      "quantityPerProperty",
    ];
    for (const field of step1Fields) {
      if (formik.errors[field as keyof typeof formik.errors]) {
        return false;
      }
      const value = formik.values[field as keyof typeof formik.values];
      if (!value) {
        return false;
      }
    }
    if (!selectedUnit) return false;
    return true;
  }, [formik.errors, formik.values, selectedUnit]);

  // Check if step 2 is valid
  const isStep2Valid = useCallback(() => {
    const step2Fields = ["startDate", "endDate"];
    for (const field of step2Fields) {
      if (formik.errors[field as keyof typeof formik.errors]) {
        return false;
      }
      const value = formik.values[field as keyof typeof formik.values];
      if (!value) {
        return false;
      }
    }
    return true;
  }, [formik.errors, formik.values]);

  // Update step completion status
  useEffect(() => {
    setStep1Completed(isStep1Valid());
  }, [isStep1Valid, formik.values, selectedUnit]);

  useEffect(() => {
    setStep2Completed(isStep2Valid());
  }, [isStep2Valid, formik.values]);

  // Validate current step with proper error handling
  const validateCurrentStep = useCallback(async () => {
    try {
      if (currentStep === 0) {
        await step1ValidationSchema.validate(formik.values, {
          abortEarly: false,
        });
        if (!selectedUnit) throw new Error("Measurement unit is required");
        return true;
      } else if (currentStep === 1) {
        await step2ValidationSchema.validate(formik.values, {
          abortEarly: false,
        });
        return true;
      } else if (currentStep === 2) {
        await step3ValidationSchema.validate(formik.values, {
          abortEarly: false,
        });
        return true;
      }
      return true;
    } catch (errors) {
      const errorFields: any = {};
      if (currentStep === 0) {
        Object.keys(step1ValidationSchema.fields).forEach((field) => {
          errorFields[field] = true;
        });
      } else if (currentStep === 1) {
        Object.keys(step2ValidationSchema.fields).forEach((field) => {
          errorFields[field] = true;
        });
      } else if (currentStep === 2) {
        Object.keys(step3ValidationSchema.fields).forEach((field) => {
          errorFields[field] = true;
        });
      }
      formik.setTouched(errorFields);
      return false;
    }
  }, [currentStep, formik.values, formik.setTouched, selectedUnit]);

  const handleNext = async (e: React.MouseEvent) => {
    // Stop propagation to prevent any form submission
    e.preventDefault();
    e.stopPropagation();
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    } else {
      await formik.validateForm();
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    // Stop propagation to prevent any form submission
    e.preventDefault();
    e.stopPropagation();
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Initialize form when editing data is provided
  useEffect(() => {
    if (editingData && editingData.data) {
      // Transform API data to form format
      const transformedData: GiftFormData = {
        giftName: editingData.data.name || "",
        giftType: editingData.data.type || "",
        estimatedValue: editingData.data.estimated_value || "",
        totalQuantity: editingData.data.total_quantity || "",
        quantityPerProperty: editingData.data.quantity_per_property || "",
        remainingQuantity: editingData.data.remaining_quantity || "",
        claimedCount: editingData.data.claimed_count || 0,
        measurementUnit: editingData.data.measurement_unit || "",
        startDate: editingData.data.start_date
          ? editingData.data.start_date.split("T")[0]
          : "",
        endDate: editingData.data.end_date
          ? editingData.data.end_date.split("T")[0]
          : "",
        description: editingData.data.description || "",
        redemptionInstructions: editingData.data.redemption_instructions || "",
        termsAndConditions: editingData.data.terms_and_conditions || "",
        status: editingData.data.status || "active",
        imageUrl: editingData.data.display_image || "",
        displayImage: null,
        imagePreview: editingData.data.display_image || "",
        metadata: editingData.data.metadata || {
          brand: "",
          warranty_period: "",
          installation_included: "false",
        },
      };

      dispatch(setEditingMode({ id: editingData.id, data: transformedData }));

      // Set selected unit
      if (editingData.data.measurement_unit) {
        setSelectedUnit(editingData.data.measurement_unit);
      }

      // Set existing image preview if URL exists
      if (editingData.data.display_image) {
        setExistingImageUrl(editingData.data.display_image);
        setImagePreview(editingData.data.display_image);
      }
    } else if (!editingData && !isEditingcondition) {
      dispatch(resetForm());
      setSelectedUnit("");
      setStep1Completed(false);
      setStep2Completed(false);
      setCurrentStep(0);
      // Clear image states
      setSelectedImage(null);
      setImagePreview("");
      setExistingImageUrl("");
      setImageError("");
    }
  }, [editingData, dispatch, isEditingcondition]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Stop propagation to prevent any form submission
      e.stopPropagation();
      const { name, value } = e.target;
      let finalValue = value;

      if (
        name === "estimatedValue" ||
        name === "totalQuantity" ||
        name === "quantityPerProperty"
      ) {
        const rawValue = value.replace(/,/g, "");
        finalValue = rawValue;
      }

      dispatch(
        updateField({ field: name as keyof GiftFormData, value: finalValue }),
      );
      formik.setFieldValue(name, finalValue);
      formik.setFieldTouched(name, true, false);
    },
    [dispatch, formik],
  );

  const handleSelectChange = useCallback(
    (field: string) => (value: any) => {
      dispatch(updateField({ field: field as keyof GiftFormData, value }));
      formik.setFieldValue(field, value);
      formik.setFieldTouched(field, true, false);

      if (field === "giftType") {
        setSelectedUnit("");
        formik.setFieldValue("measurementUnit", "");
        dispatch(updateField({ field: "measurementUnit", value: "" }));
      }
    },
    [dispatch, formik],
  );

  const handleUnitChange = useCallback(
    (value: any) => {
      setSelectedUnit(value);
      formik.setFieldValue("measurementUnit", value);
      formik.setFieldTouched("measurementUnit", true, false);
      dispatch(updateField({ field: "measurementUnit", value }));
    },
    [formik, dispatch],
  );

  const handleRichTextChange = useCallback(
    (e: { target: { value: string } }) => {
      const { value } = e.target;
      dispatch(updateField({ field: "description", value }));
      formik.setFieldValue("description", value);
      formik.setFieldTouched("description", true, false);
    },
    [dispatch, formik],
  );

  const handleRedemptionInstructionsChange = useCallback(
    (e: { target: { value: string } }) => {
      const { value } = e.target;
      dispatch(updateField({ field: "redemptionInstructions", value }));
      formik.setFieldValue("redemptionInstructions", value);
      formik.setFieldTouched("redemptionInstructions", true, false);
    },
    [dispatch, formik],
  );

  const handleTermsChange = useCallback(
    (e: { target: { value: string } }) => {
      const { value } = e.target;
      dispatch(updateField({ field: "termsAndConditions", value }));
      formik.setFieldValue("termsAndConditions", value);
      formik.setFieldTouched("termsAndConditions", true, false);
    },
    [dispatch, formik],
  );

  const getStepErrorCount = (step: number) => {
    if (step > currentStep) return 0;
    const errors = formik.errors;
    let count = 0;

    switch (step) {
      case 0:
        if (errors.giftName && formik.touched.giftName) count++;
        if (errors.giftType && formik.touched.giftType) count++;
        if (errors.estimatedValue && formik.touched.estimatedValue) count++;
        if (errors.totalQuantity && formik.touched.totalQuantity) count++;
        if (errors.quantityPerProperty && formik.touched.quantityPerProperty)
          count++;
        if (!selectedUnit && formik.touched.measurementUnit) count++;
        break;
      case 1:
        if (errors.startDate && formik.touched.startDate) count++;
        if (errors.endDate && formik.touched.endDate) count++;
        break;
      case 2:
        if (errors.description && formik.touched.description) count++;
        break;
    }
    return count;
  };

  const shouldShowError = (fieldName: string, step: number) => {
    if (step > currentStep) return false;
    return (
      formik.touched[fieldName as keyof typeof formik.touched] &&
      formik.errors[fieldName as keyof typeof formik.errors]
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-4">
                Create any type of gift - land, house, or movables like cows,
                food stuff, etc.
              </p>
            </div>

            <div className="md:col-span-2">
              <InputField
                label="Gift Name"
                placeholder="e.g., 1 Plot of Land, 3 Cows, 50kg Rice, etc."
                name="giftName"
                value={formik.values.giftName as string}
                onChange={handleFieldChange}
                required
                error={shouldShowError("giftName", 0) && formik.errors.giftName}
              />
            </div>

            <div className="md:col-span-2">
              <EnhancedOptionInputFieldtwo
                label="Gift Type"
                placeholder="Select what type of gift this is"
                name="giftType"
                value={formik.values.giftType}
                onChange={handleSelectChange("giftType")}
                options={giftTypeOptions}
                error={shouldShowError("giftType", 0) && formik.errors.giftType}
              />
            </div>

            {formik.values.giftType && (
              <div className="md:col-span-2">
                <EnhancedOptionInputFieldtwo
                  label="Measurement Unit"
                  placeholder="Select measurement unit"
                  name="measurementUnit"
                  value={selectedUnit}
                  onChange={handleUnitChange}
                  options={getUnitOptions()}
                  error={
                    !selectedUnit &&
                    formik.touched.measurementUnit &&
                    "Measurement unit is required"
                  }
                />
              </div>
            )}

            <InputField
              label="Estimated Value (₦)"
              placeholder="Enter estimated value in Naira"
              name="estimatedValue"
              type="text"
              value={formatNumber(formik.values.estimatedValue)}
              onChange={handleFieldChange}
              required
              error={
                shouldShowError("estimatedValue", 0) &&
                formik.errors.estimatedValue
              }
            />

            <InputField
              label={getQuantityPerPropertyLabel()}
              placeholder={`Enter quantity per property in ${getMeasurementUnit() || "units"}`}
              name="quantityPerProperty"
              type="text"
              value={formatNumber(formik.values.quantityPerProperty)}
              onChange={handleFieldChange}
              required
              error={
                shouldShowError("quantityPerProperty", 0) &&
                formik.errors.quantityPerProperty
              }
            />

            <InputField
              label={`Total Quantity Available (in ${getMeasurementUnit() || "units"})`}
              placeholder={`Enter total ${getMeasurementUnit() || "units"} available`}
              name="totalQuantity"
              type="text"
              value={formatNumber(formik.values.totalQuantity)}
              onChange={handleFieldChange}
              required
              error={
                shouldShowError("totalQuantity", 0) &&
                formik.errors.totalQuantity
              }
            />

            <InputField
              label="Remaining Quantity"
              placeholder="Auto-calculated"
              name="remainingQuantity"
              type="text"
              value={formatNumber(formik.values.remainingQuantity)}
              onChange={handleFieldChange}
              disabled
            />

            {calculateMaxProperties() > 0 && (
              <div className="md:col-span-2 mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-[#79B833]">
                  📊 <span className="font-medium">Summary:</span> With{" "}
                  {formatNumber(formik.values.totalQuantity)}{" "}
                  {getMeasurementUnit()} total and{" "}
                  {formatNumber(formik.values.quantityPerProperty)}{" "}
                  {getMeasurementUnit()} per property, you can reward{" "}
                  <span className="font-bold">
                    {calculateMaxProperties()} properties
                  </span>{" "}
                  with this gift.
                </p>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Gift Availability Period
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Set when this gift can be claimed
              </p>
            </div>

            <InputField
              label="Start Date"
              placeholder="When does gift become available?"
              name="startDate"
              type="date"
              value={formik.values.startDate as string}
              onChange={handleFieldChange}
              required
              error={shouldShowError("startDate", 1) && formik.errors.startDate}
            />

            <InputField
              label="End Date"
              placeholder="When does gift expire?"
              name="endDate"
              type="date"
              value={formik.values.endDate as string}
              onChange={handleFieldChange}
              required
              error={shouldShowError("endDate", 1) && formik.errors.endDate}
            />
          </div>
        );

      case 2:
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Gift Details
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Describe the gift and how to claim it
              </p>
            </div>

            {/* Image Upload Section - FIXED with type="button" to prevent form submission */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gift Image
                <span className="text-gray-400 text-xs ml-2">
                  (Optional - JPEG, PNG, GIF, WEBP up to 5MB)
                </span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageSelect}
                onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
                className="hidden"
              />

              {!imagePreview ? (
                <div
                  onClick={handleBrowseClick}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#79B833] transition-colors"
                >
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    Click to browse or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF, WEBP up to 5MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Gift preview"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
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
                  </div>
                  <button
                    type="button"
                    onClick={handleBrowseClick}
                    className="mt-2 text-sm text-[#79B833] hover:underline"
                  >
                    Change image
                  </button>
                </div>
              )}

              {imageError && (
                <p className="mt-2 text-sm text-red-600">{imageError}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <RichTextEditor
                label="Gift Description"
                placeholder={`Describe what the gift includes. Example: 'Winner receives ${formik.values.quantityPerProperty || "X"} ${getMeasurementUnit()} of land located in...'`}
                name="description"
                value={formik.values.description as string}
                onChange={handleRichTextChange}
                error={
                  shouldShowError("description", 2) && formik.errors.description
                }
                height={200}
                required
              />
            </div>

            <div className="md:col-span-2">
              <RichTextEditor
                label="Redemption Instructions"
                placeholder="How does the winner claim this gift? Example: 'Winner will be contacted within 48 hours to arrange documentation'"
                name="redemptionInstructions"
                value={formik.values.redemptionInstructions as string}
                onChange={handleRedemptionInstructionsChange}
                height={150}
              />
            </div>

            <div className="md:col-span-2">
              <RichTextEditor
                label="Terms & Conditions"
                placeholder="Any restrictions or conditions for this gift"
                name="termsAndConditions"
                value={formik.values.termsAndConditions as string}
                onChange={handleTermsChange}
                height={150}
              />
            </div>

            <EnhancedOptionInputFieldtwo
              label="Status"
              placeholder="Set gift status"
              name="status"
              value={formik.values.status}
              onChange={handleSelectChange("status")}
              options={statusOptions}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const isFormValid = () => {
    return step1Completed && step2Completed && formik.values.description;
  };

  // FIXED: Form onSubmit handler with proper preventDefault
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Extra safety to prevent event bubbling
    
    // Only submit if form is valid and not already loading
    if (!isLoading && isFormValid()) {
      await formik.submitForm();
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-6 max-w-5xl mx-auto p-6"
      noValidate // Prevent browser validation which might trigger unwanted behavior
    >
      <div className="flex justify-between items-start flex-wrap">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditing ? "Edit Gift" : "Create New Gift for Property Rewards"}
          </h2>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update gift details"
              : "Create a gift that can be attached to property purchases"}
          </p>
          {isDirty && (
            <p className="text-amber-600 text-sm mt-2">
              You have unsaved changes
            </p>
          )}
          {formError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{formError}</p>
            </div>
          )}
        </div>
        <Link
          to={"/gifts"}
          className="px-4 py-3 bg-[#79B833] font-medium text-white rounded-full hover:bg-[#6aa82a] transition-colors"
        >
          Go back to Gifts
        </Link>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { label: "Gift Details", completed: step1Completed },
            { label: "Availability", completed: step2Completed },
            { label: "Content", completed: false },
          ].map((step, index) => (
            <div key={index} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (index <= currentStep) {
                      setCurrentStep(index);
                    }
                  }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    transition-all duration-200
                    ${
                      currentStep === index
                        ? "bg-[#79B833] text-white ring-4 ring-green-200"
                        : step.completed
                          ? "bg-[#79B833] text-white"
                          : currentStep > index
                            ? "bg-[#79B833] text-white"
                            : "bg-gray-200 text-gray-600"
                    }
                    ${index <= currentStep ? "cursor-pointer hover:opacity-80" : "cursor-default"}
                  `}
                >
                  {step.completed && currentStep !== index ? (
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </button>
                <span
                  className={`text-xs mt-2 ${currentStep === index ? "text-[#79B833] font-medium" : "text-gray-600"}`}
                >
                  {step.label}
                </span>
                {getStepErrorCount(index) > 0 &&
                  currentStep !== index &&
                  index < currentStep && (
                    <span className="text-xs text-red-500 mt-1">
                      {getStepErrorCount(index)} issue(s)
                    </span>
                  )}
              </div>
              {index < 2 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2 ${
                    currentStep > index ? "bg-[#79B833]" : "bg-gray-200"
                  }`}
                  style={{
                    width: "calc(100% - 2.5rem)",
                    left: "calc(50% + 1.25rem)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">{renderStepContent()}</div>

      {/* Navigation Buttons - All buttons have proper type attributes to prevent auto-submit */}
      <div className="flex justify-between gap-4 pt-6 mt-6 border-t border-gray-200">
        <div>
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              Previous
            </button>
          )}
        </div>

        <div className="flex gap-4">
          {onCancel && currentStep === 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch(resetForm());
                onCancel();
              }}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}

          {currentStep < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 text-white bg-[#79B833] rounded-full hover:bg-[#79B833]/80 transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="px-6 py-2 text-white bg-[#79B833] rounded-full hover:bg-[#79B833]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Gift"
              ) : (
                "Create Gift"
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default GiftForm;