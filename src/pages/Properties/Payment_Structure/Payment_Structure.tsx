import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import OptionInputField from "../../../components/input/drop_down";
import InputField from "../../../components/input/inputtext";
import InfrastructureFeesModal from "../../../components/Modals/infrastureModal2";
import InfrastructureFeesModalss from "../../../components/Modals/InfrastructureFeesModal";
import { PaymentStructureFormValues } from "../../../MyContext/MyContext";
// import { PaymentStructureFormValues } from "../../../types/propertyTypes";

interface PaymentStructureHandles {
  handleSubmit: () => void;
  isValid: boolean;
  values: PaymentStructureFormValues;
}

interface PaymentStructureProps {
  // Props for setting data
  setPaymentStructure: (data: PaymentStructureFormValues) => void;
  
  // Props for initial data
  initialData?: PaymentStructureFormValues;
  
  // Props for conditional rendering
  isLandProperty?: boolean;
  
  // Props for edit mode
  isEditMode?: boolean;
  
  // Props for modal control
  onOpenInfrastructureModal?: () => void;
}

const Payment_Structure = forwardRef<PaymentStructureHandles, PaymentStructureProps>(({
  setPaymentStructure,
  initialData,
  isLandProperty = false,
  isEditMode = false,
  onOpenInfrastructureModal
}, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const paymentTypeOptions = [
    { value: "installment", label: "Installment" },
    { value: "full", label: "Full Payment" },
  ];

  const paymentScheduleOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ];

  const validationSchema = Yup.object().shape({
    paymentType: Yup.string().required("Payment type is required"),
    paymentDuration: Yup.string()
      .when('paymentType', {
        is: (value: string) => value !== 'full',
        then: (schema) => schema.required('Payment duration is required'),
        otherwise: (schema) => schema.notRequired()
      }),
    paymentSchedule: Yup.array()
      .when('paymentType', {
        is: (value: string) => value !== 'full',
        then: (schema) => schema.of(Yup.string()).min(1, "At least one payment schedule is required"),
        otherwise: (schema) => schema.notRequired()
      }),
    feesCharges: Yup.string()
      .test(
        'is-number',
        'Fees & Charges must be a valid number',
        (value) => !value || /^\d*\.?\d*$/.test(value)
      )
      .optional(),
  });

  // Initialize formik with initial data
  const formik = useFormik<PaymentStructureFormValues>({
    initialValues: {
      paymentType: initialData?.paymentType || "",
      paymentDuration: initialData?.paymentDuration || "",
      paymentSchedule: initialData?.paymentSchedule || [],
      feesCharges: initialData?.feesCharges || "",
    },
    validationSchema,
    onSubmit: (values) => {
      setPaymentStructure(values);
    },
 enableReinitialize: true,
  });

  // Sync formik values when initialData changes
  useEffect(() => {
    if (initialData && initialLoad) {
      formik.setValues({
        paymentType: initialData.paymentType || "",
        paymentDuration: initialData.paymentDuration || "",
        paymentSchedule: initialData.paymentSchedule || [],
        feesCharges: initialData.feesCharges || "",
      });
      setInitialLoad(false);
    }
  }, [initialData]);

  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
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
  isValid: formik.isValid,

    get values() {
      return formik.values;
    },
  }));

  const handleScheduleChange = (value: string) => {
    const currentSchedules = [...formik.values.paymentSchedule];
    const index = currentSchedules.indexOf(value);

    if (index === -1) {
      currentSchedules.push(value);
    } else {
      currentSchedules.splice(index, 1);
    }

    formik.setFieldValue("paymentSchedule", currentSchedules);
  };

  const handleOpenInfrastructureModal = () => {
    setIsModalOpen(true);
    if (onOpenInfrastructureModal) {
      onOpenInfrastructureModal();
    }
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="space-y-[30px]">
        <div className="grid md:grid-cols-2 gap-12">
          <OptionInputField
            label="Payment Type"
            placeholder="Select Payment Type"
            name="paymentType"
            value={formik.values.paymentType}
            onChange={(value) => formik.setFieldValue("paymentType", value)}
            options={paymentTypeOptions}
            dropdownTitle="Payment Type"
            error={formik.touched.paymentType && formik.errors.paymentType
              ? formik.errors.paymentType
              : undefined}
          />

          {formik.values.paymentType !== "full" && (
            <InputField
              label="Payment Duration Limit (months)"
              placeholder="Enter Payment Duration Limit"
              name="paymentDuration"
              value={formik.values.paymentDuration}
              onChange={(e) => {
                let newValue = e.target.value.replace(/,/g, "");
                if (/^\d*$/.test(newValue)) {
                  formik.setFieldValue("paymentDuration", newValue);
                }
              }}
              error={formik.touched.paymentDuration && formik.errors.paymentDuration
                ? formik.errors.paymentDuration
                : undefined}
            />
          )}
        </div>

        {formik.values.paymentType !== "full" && (
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Schedule
              </label>
              <div className="space-y-2">
                {paymentScheduleOptions.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`schedule-${option.value}`}
                      checked={formik.values.paymentSchedule.includes(option.value)}
                      onChange={() => handleScheduleChange(option.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 accent-black border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`schedule-${option.value}`}
                      className="ml-2 block text-sm text-gray-900"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              {formik.touched.paymentSchedule && formik.errors.paymentSchedule && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.paymentSchedule as string}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Fees & Charges Field (Optional) */}
        <div className="grid md:grid-cols-2 gap-12">
          <InputField
            label="Fees & Charges (₦)"
            placeholder="Enter additional fees and charges"
            name="feesCharges"
            value={formik.values.feesCharges}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/[₦,]/g, "");
              if (/^\d*\.?\d*$/.test(rawValue)) {
                formik.setFieldValue("feesCharges", rawValue);
              }
            }}
            error={formik.touched.feesCharges && formik.errors.feesCharges
              ? formik.errors.feesCharges
              : undefined}
          />
        </div>
      </form>

      {/* Infrastructure Fees Modal Trigger for Land Properties */}
      {isLandProperty || !isEditMode && (
        <div
          className="pt-5"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenInfrastructureModal();
            }}
            className="w-full py-3 px-4 bg-[#79B833] text-white rounded-[80px] font-medium max-w-xl hover:bg-[#6aa22c] transition-colors"
          >
            {isEditMode ? "Manage Allocation Fees" : "Add Allocation Fees"}
          </button>

          {/* Conditionally render the appropriate modal based on edit mode */}
          {isModalOpen && isEditMode ? (
            <InfrastructureFeesModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          ) : (
            <InfrastructureFeesModalss
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      )}
    </>
  );
});

Payment_Structure.displayName = "Payment_Structure";

export default Payment_Structure;