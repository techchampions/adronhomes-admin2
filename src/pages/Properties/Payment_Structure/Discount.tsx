import React, { forwardRef, useImperativeHandle, useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import OptionInputField from '../../../components/input/drop_down';
import InputField from '../../../components/input/inputtext';
import { PropertyContext } from '../../../MyContext/MyContext';

interface DiscountHandles {
  handleSubmit: () => void;
  isValid: boolean;
}

interface DiscountFormValues {
  discountName: string;
  discountType: string;
  discountOff: string;
  unitsRequired: string;
  validFrom: string;
  validTo: string;
}

const Discount = forwardRef<DiscountHandles>((props, ref) => {
  const { formData, setDiscount } = useContext(PropertyContext)!;

  const discountTypeOptions = [
    { value: "percentage", label: "Percentage" },
  ];

  const validationSchema = Yup.object().shape({
    discountName: Yup.string().required("Discount name is required"),
    discountType: Yup.string().required("Discount type is required"),
    discountOff: Yup.number()
      .typeError("Discount must be a number")
      .positive("Discount must be positive")
      .required("Discount is required"),
    unitsRequired: Yup.number()
      .typeError("Units required must be a number")
      .positive("Units required must be positive")
      .required("Units required is required"),
  });

  const formik = useFormik<DiscountFormValues>({
    initialValues: formData.discount,
    validationSchema,
    onSubmit: (values) => {
      setDiscount(values);
        // alert(JSON.stringify(values, null, 2)); 
    },
  });

  useEffect(() => {
    if (formData.discount) {
      formik.setValues(formData.discount);
    }
  }, [formData.discount]);


    
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
   
 
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-[30px]">
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
          onChange={(value) => formik.setFieldValue("discountType", value)}
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
        <InputField
          label="Discount Off (%)"
          placeholder="Enter Discount Off (%)"
          name="discountOff"
          value={formik.values.discountOff}
          onChange={formik.handleChange}
          error={
            formik.touched.discountOff && formik.errors.discountOff
              ? formik.errors.discountOff
              : undefined
          }
        />

        <InputField
          label="Number of Units Required"
          placeholder="Enter Number of Units Required"
          name="unitsRequired"
          value={formik.values.unitsRequired}
          onChange={formik.handleChange}
          error={
            formik.touched.unitsRequired && formik.errors.unitsRequired
              ? formik.errors.unitsRequired
              : undefined
          }
        />
      </div>
     
      <div className="grid md:grid-cols-2 gap-12">
        <div className="grid grid-cols-2 gap-12">
          <InputField
            label="Valid From"
            placeholder="Valid From"
            name="validFrom"
            type="date"
            value={formik.values.validFrom}
            onChange={formik.handleChange}
          />
          <InputField
            label="Valid To"
            placeholder="Valid To"
            name="validTo"
            type="date"
            value={formik.values.validTo}
            onChange={formik.handleChange}
          />
        </div>
      </div>
    </form>
  );
});

Discount.displayName = "Discount";

export default Discount;