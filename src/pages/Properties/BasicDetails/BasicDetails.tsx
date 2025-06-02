import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "../../../general/Header";
import InputField from "../../../components/input/inputtext";
import OptionInputField from "../../../components/input/drop_down";
import { PropertyContext } from "../../../MyContext/MyContext";
import { BasicDetailsHandles } from "../types/formRefs";


const BasicDetails = forwardRef<BasicDetailsHandles>((props, ref) => {
  const { formData, setBasicDetails } = useContext(PropertyContext)!;
  const [initialLoad, setInitialLoad] = useState(true);
  const propertyTypeOptions = [
    { value: "Land", label: "Land" },
    { value: "Building", label: "Building" },
    { value: "Apartment", label: "Apartment" },
    { value: "Commercial", label: "Commercial" },
  ];

  const locationTypeOptions = [
    { value: "urban", label: "Urban" },
    { value: "suburban", label: "Suburban" },
    { value: "rural", label: "Rural" },
  ];

  const purposeOptions = [
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "investment", label: "Investment" },
    { value: "industrial", label: "Industrial" },
  ];

  const validationSchema = Yup.object().shape({
    propertyName: Yup.string().required("Property name is required"),
    propertyType: Yup.string().required("Property type is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be positive")
      .required("Price is required"),
    initialDeposit: Yup.number()
      .typeError("Initial deposit must be a number")
      .positive("Initial deposit must be positive")
      .required("Initial deposit is required"),
    address: Yup.string().required("Address is required"),
    locationType: Yup.string().required("Location type is required"),
    purpose: Yup.string().required("Purpose is required"),
  });
  useEffect(() => {
    if (formData.basicDetails) {
      formik.setValues(formData.basicDetails);
    }
  }, [formData.basicDetails]);

  const formik = useFormik({
    initialValues: formData.basicDetails,
    validationSchema,
    onSubmit: (values) => {
      setBasicDetails(values);
  alert(JSON.stringify(values, null, 2)); 
    },
  });

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
      <InputField
        label="Property Name"
        placeholder="Enter property name"
        name="propertyName"
        value={formik.values.propertyName}
        onChange={formik.handleChange}
        error={
          formik.touched.propertyName && formik.errors.propertyName
            ? formik.errors.propertyName
            : undefined
        }
      />

      <OptionInputField
        label="Property Type"
        placeholder="Select property type"
        name="propertyType"
        value={formik.values.propertyType}
        onChange={(value) => formik.setFieldValue("propertyType", value)}
        options={propertyTypeOptions}
        dropdownTitle="Property Types"
        error={
          formik.touched.propertyType && formik.errors.propertyType
            ? formik.errors.propertyType
            : undefined
        }
      />

      <InputField
        label="Price"
        placeholder="Enter price"
        name="price"
        value={formik.values.price}
        onChange={formik.handleChange}
        error={
          formik.touched.price && formik.errors.price
            ? formik.errors.price
            : undefined
        }
      />

      <InputField
        label="Initial Deposit"
        placeholder="Enter initial deposit"
        name="initialDeposit"
        value={formik.values.initialDeposit}
        onChange={formik.handleChange}
        error={
          formik.touched.initialDeposit && formik.errors.initialDeposit
            ? formik.errors.initialDeposit
            : undefined
        }
      />

      <InputField
        label="Address"
        placeholder="Enter address"
        name="address"
        value={formik.values.address}
        onChange={formik.handleChange}
        error={
          formik.touched.address && formik.errors.address
            ? formik.errors.address
            : undefined
        }
      />

      <div className="grid lg:grid-cols-2 gap-12">
        <OptionInputField
          label="Location Type"
          placeholder="Select location type"
          name="locationType"
          value={formik.values.locationType}
          onChange={(value) => formik.setFieldValue("locationType", value)}
          options={locationTypeOptions}
          dropdownTitle="Location Types"
          error={
            formik.touched.locationType && formik.errors.locationType
              ? formik.errors.locationType
              : undefined
          }
        />

        <OptionInputField
          label="Purpose"
          placeholder="Select purpose"
          name="purpose"
          value={formik.values.purpose}
          onChange={(value) => formik.setFieldValue("purpose", value)}
          options={purposeOptions}
          dropdownTitle="Purpose"
          error={
            formik.touched.purpose && formik.errors.purpose
              ? formik.errors.purpose
              : undefined
          }
        />
      </div>
    </form>
  );
});

export default BasicDetails;