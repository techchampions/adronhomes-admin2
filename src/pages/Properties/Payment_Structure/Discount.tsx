import React, { 
  forwardRef, 
  useImperativeHandle, 
  useEffect, 
  useState 
} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import OptionInputField from '../../../components/input/drop_down';
import InputField from '../../../components/input/inputtext';
import { DiscountFormValues } from '../../../MyContext/MyContext';
// import { DiscountFormValues } from '../../../types/propertyTypes';

interface DiscountHandles {
  handleSubmit: () => void;
  isValid: boolean;
  values: DiscountFormValues;
}

interface DiscountProps {
  // Props for setting data
  setDiscount: (data: DiscountFormValues) => void;
  
  // Props for initial data
  initialData?: DiscountFormValues;
  
  // Props for edit mode
  isEditMode?: boolean;
  
  // Props for validation control
  requireValidation?: boolean;
}

const Discount = forwardRef<DiscountHandles, DiscountProps>(({
  setDiscount,
  initialData,
  isEditMode = false,
  requireValidation = true
}, ref) => {
  const [initialLoad, setInitialLoad] = useState(true);

  const discountTypeOptions = [
    { value: "percentage", label: "Percentage" },
    { value: "fixed", label: "Fixed Amount" },
  ];

  // Conditional validation schema
  const validationSchema = requireValidation ? Yup.object().shape({
    discountName: Yup.string()
      .required("Discount name is required")
      .min(2, "Discount name must be at least 2 characters"),
    discountType: Yup.string()
      .required("Discount type is required"),
    discountOff: Yup.number()
      .typeError("Discount must be a number")
      .positive("Discount must be positive")
      .when('discountType', {
        is: 'percentage',
        then: (schema) => schema.max(100, "Percentage discount cannot exceed 100%"),
        otherwise: (schema) => schema
      })
      .required("Discount is required"),
    unitsRequired: Yup.number()
      .typeError("Units required must be a number")
      .positive("Units required must be positive")
      .integer("Units must be a whole number")
      .min(1, "At least 1 unit is required")
      .required("Units required is required"),
    validFrom: Yup.date()
      .typeError("Invalid date format")
      .required("Start date is required"),
    validTo: Yup.date()
      .typeError("Invalid date format")
      .required("End date is required")
      .min(
        Yup.ref('validFrom'),
        "End date must be after start date"
      ),
  }) : Yup.object().shape({
    // Less strict validation if not required
    discountOff: Yup.number()
      .typeError("Discount must be a number")
      .positive("Discount must be positive")
      .when('discountType', {
        is: 'percentage',
        then: (schema) => schema.max(100, "Percentage discount cannot exceed 100%"),
        otherwise: (schema) => schema
      })
      .optional(),
    unitsRequired: Yup.number()
      .typeError("Units required must be a number")
      .positive("Units required must be positive")
      .integer("Units must be a whole number")
      .optional(),
  });

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      return dateString;
    }
  };

  // Parse date from input fields
  const parseDateFromInput = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      return dateString;
    }
  };

  const formik = useFormik<DiscountFormValues>({
    initialValues: {
      discountName: initialData?.discountName || "",
      discountType: initialData?.discountType || "percentage",
      discountOff: initialData?.discountOff || "",
      unitsRequired: initialData?.unitsRequired || "",
      validFrom: formatDateForInput(initialData?.validFrom || ""),
      validTo: formatDateForInput(initialData?.validTo || ""),
    },
    validationSchema,
    onSubmit: (values) => {
      // Format dates before submitting
      const formattedValues = {
        ...values,
        validFrom: parseDateFromInput(values.validFrom),
        validTo: parseDateFromInput(values.validTo),
      };
      setDiscount(formattedValues);
    },
    enableReinitialize: true,
  });

  // Initialize form with initial data
  useEffect(() => {
    if (initialData && initialLoad) {
      formik.setValues({
        discountName: initialData.discountName || "",
        discountType: initialData.discountType || "percentage",
        discountOff: initialData.discountOff || "",
        unitsRequired: initialData.unitsRequired || "",
        validFrom: formatDateForInput(initialData.validFrom || ""),
        validTo: formatDateForInput(initialData.validTo || ""),
      });
      setInitialLoad(false);
    }
  }, [initialData]);

  // Handle discount type change
  const handleDiscountTypeChange = (value: string) => {
    formik.setFieldValue("discountType", value);
    
    // If switching to percentage and discount is > 100, reset it
    if (value === "percentage") {
      const discountValue = parseFloat(formik.values.discountOff);
      if (discountValue > 100) {
        formik.setFieldValue("discountOff", "100");
      }
    }
  };

  // Handle discount off change with validation
  const handleDiscountOffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty or numeric values
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);
      
      // Validate percentage limit
      if (formik.values.discountType === "percentage" && !isNaN(numValue) && numValue > 100) {
        formik.setFieldValue("discountOff", "100");
      } else {
        formik.setFieldValue("discountOff", value);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      // If discount is not required and no data entered, skip validation
      if (!requireValidation && !formik.values.discountName && !formik.values.discountOff) {
        return true;
      }
      
      const errors = await formik.validateForm();
      const hasErrors = Object.keys(errors).length > 0;

      if (hasErrors) {
        formik.setTouched(
          Object.keys(errors).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {} as { [field: string]: boolean }),
          true
        );
        return false;
      } else {
        formik.handleSubmit();
        return true;
      }
    },
    get isValid() {
      // If discount is not required, it's valid even if empty
      if (!requireValidation && !formik.values.discountName) {
        return true;
      }
      return formik.isValid && formik.dirty;
    },
    get values() {
      return formik.values;
    },
  }));

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-[30px]">
      {/* Edit mode info */}
      {isEditMode && initialData?.discountName && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">Current Discount:</span> {initialData.discountName} 
            {initialData.discountOff && ` (${initialData.discountOff}%)`}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-12">
        <InputField
          label="Discount Name"
          placeholder="Enter Discount Name"
          name="discountName"
          value={formik.values.discountName}
          onChange={formik.handleChange}
          error={
            formik.touched.discountName && formik.errors.discountName
              ? formik.errors.discountName
              : undefined
          }
        />
        <OptionInputField
          label="Discount Type"
          placeholder="Select Discount Type"
          name="discountType"
          value={formik.values.discountType}
          onChange={handleDiscountTypeChange}
          options={discountTypeOptions}
          dropdownTitle="Discount Type"
          error={
            formik.touched.discountType && formik.errors.discountType
              ? formik.errors.discountType
              : undefined
          }
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative">
          <InputField
            label={formik.values.discountType === "percentage" ? "Discount (%)" : "Discount Amount (₦)"}
            placeholder={formik.values.discountType === "percentage" ? "Enter Discount Percentage" : "Enter Discount Amount"}
            name="discountOff"
            value={formik.values.discountOff}
            onChange={handleDiscountOffChange}
            error={
              formik.touched.discountOff && formik.errors.discountOff
                ? formik.errors.discountOff
                : undefined
            }
          />
          {formik.values.discountType === "percentage" && (
            <div className="absolute top-10 right-3 text-sm text-gray-500">
              %
            </div>
          )}
        </div>

        <InputField
          label="Number of Units Required"
          placeholder="Enter Number of Units Required"
          name="unitsRequired"
          value={formik.values.unitsRequired}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d*$/.test(value)) {
              formik.handleChange(e);
            }
          }}
          error={
            formik.touched.unitsRequired && formik.errors.unitsRequired
              ? formik.errors.unitsRequired
              : undefined
          }
        />
      </div>
     
      <div className="grid md:grid-cols-2 gap-12">
        <div className="grid grid-cols-2 gap-12">
          <div>
            <InputField
              label="Valid From"
              placeholder="Valid From"
              name="validFrom"
              type="date"
              value={formik.values.validFrom}
              onChange={formik.handleChange}
              error={
                formik.touched.validFrom && formik.errors.validFrom
                  ? formik.errors.validFrom
                  : undefined
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Start date of the discount
            </p>
          </div>
          <div>
            <InputField
              label="Valid To"
              placeholder="Valid To"
              name="validTo"
              type="date"
              value={formik.values.validTo}
              onChange={formik.handleChange}
              error={
                formik.touched.validTo && formik.errors.validTo
                  ? formik.errors.validTo
                  : undefined
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              End date of the discount
            </p>
          </div>
        </div>
      </div>

      {/* Date validation error */}
      {formik.touched.validTo && formik.errors.validTo && formik.errors.validTo.includes("after") && (
        <div className="p-2 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-600">
            ⚠️ End date must be after start date
          </p>
        </div>
      )}

      {/* Help text */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Note:</span> Discount will only apply when all conditions are met:
          <ul className="list-disc ml-5 mt-1 space-y-1">
            <li>Discount name must be unique</li>
            <li>Applicable for specified number of units</li>
            <li>Valid only within the specified date range</li>
            {formik.values.discountType === "percentage" && (
              <li>Percentage discount cannot exceed 100%</li>
            )}
          </ul>
        </p>
      </div>
    </form>
  );
});

Discount.displayName = "Discount";

export default Discount;