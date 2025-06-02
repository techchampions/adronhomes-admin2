import React, { forwardRef, useImperativeHandle, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import OptionInputField from "../../../components/input/drop_down";
import InputField from "../../../components/input/inputtext";
import { PropertyContext } from "../../../MyContext/MyContext";

interface PaymentStructureHandles {
  handleSubmit: () => void;
  isValid: boolean;
}

interface PaymentStructureFormValues {
  paymentType: string;
  paymentDuration: string;
  paymentSchedule: string[];
  feesCharges: string;
}

const Payment_Structure = forwardRef<PaymentStructureHandles>((props, ref) => {
  const { formData, setPaymentStructure,} = useContext(PropertyContext)!;

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
    paymentDuration: Yup.string().required("Payment duration is required"),
    paymentSchedule: Yup.array()
      .of(Yup.string())
      .min(1, "At least one payment schedule is required"),
  });

  // const formik = useFormik<PaymentStructureFormValues>({
  //   initialValues: {
  //     paymentType: formData.paymentStructure.paymentType || "",
  //     paymentDuration: formData.paymentStructure.paymentDuration || "",
  //     paymentSchedule: formData.paymentStructure.paymentSchedule || [],
  //     feesCharges: formData.paymentStructure.feesCharges || "",
  //   },
  //   validationSchema,
  //   onSubmit: (values) => {
  //     setPaymentStructure(values);
  //     console.log("Submitted values:", values); 
  //   },
  // });

    const formik = useFormik({
      initialValues: formData.paymentStructure,
      validationSchema,
      onSubmit: (values) => {
        setPaymentStructure(values);
    alert(JSON.stringify(values, null, 2)); 

      },
    });

  useEffect(() => {
    if (formData.paymentStructure) {
      formik.setValues(formData.paymentStructure);
    }
  }, [formData.paymentStructure]);

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
   isValid: formik.isValid 
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

  return (
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
          error={
            formik.touched.paymentType && formik.errors.paymentType
              ? formik.errors.paymentType
              : undefined
          }
        />

        <InputField
          label="Payment Duration Limit (months)"
          placeholder="Enter Payment Duration Limit"
          name="paymentDuration"
          value={formik.values.paymentDuration}
          onChange={formik.handleChange}
          error={
            formik.touched.paymentDuration && formik.errors.paymentDuration
              ? formik.errors.paymentDuration
              : undefined
          }
        />
      </div>

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
              {formik.errors.paymentSchedule}
            </p>
          )}
        </div>

        <InputField
          label="Fees & Charges"
          placeholder="Enter Fees & Charges"
          name="feesCharges"
          value={formik.values.feesCharges}
          onChange={formik.handleChange}
        />
      </div>
    </form>
  );
});

Payment_Structure.displayName = "Payment_Structure";

export default Payment_Structure;