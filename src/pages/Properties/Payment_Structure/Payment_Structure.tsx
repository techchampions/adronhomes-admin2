import React, { forwardRef, useImperativeHandle, useContext } from "react";
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
  paymentSchedule: string;
  feesCharges: string;
}

const Payment_Structure = forwardRef<PaymentStructureHandles>((props, ref) => {
  const { formData, setPaymentStructure } = useContext(PropertyContext)!;

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
    paymentSchedule: Yup.string().required("Payment schedule is required"),
  });

  const formik = useFormik<PaymentStructureFormValues>({
    initialValues: formData.paymentStructure,
    validationSchema,
    onSubmit: (values) => {
      setPaymentStructure(values);
    },
  });

  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      formik.handleSubmit();
    },
    isValid: formik.isValid && Object.keys(formik.touched).length > 0
  }));

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
        <OptionInputField
          label="Payment Schedule"
          placeholder="Select Payment Schedule"
          name="paymentSchedule"
          value={formik.values.paymentSchedule}
          onChange={(value) => formik.setFieldValue("paymentSchedule", value)}
          options={paymentScheduleOptions}
          dropdownTitle="Payment Schedule"
          error={
            formik.touched.paymentSchedule && formik.errors.paymentSchedule
              ? formik.errors.paymentSchedule
              : undefined
          }
        />

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