// BulkBasicDetails.tsx
import React, { forwardRef, useContext, useImperativeHandle } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../components/input/inputtext";
import OptionInputField from "../../../components/input/drop_down";
import { PropertyContext } from "../../../MyContext/MyContext";

interface BulkBasicDetailsHandles {
  handleSubmit: () => void;
  isValid: boolean;
}

interface BulkBasicDetailsProps {}

const BulkBasicDetails = forwardRef<BulkBasicDetailsHandles, BulkBasicDetailsProps>((props, ref) => {
  const { formData, setBulkDetails } = useContext(PropertyContext)!;

  const propertyTypeOptions = [
    { value: "land", label: "Land" },
    { value: "building", label: "Building" },
    { value: "apartment", label: "Apartment" },
    { value: "commercial", label: "Commercial" },
  ];

  const validationSchema = Yup.object().shape({
    propertyName: Yup.string().required("Property name is required"),
    propertyType: Yup.string().required("Property type is required"),
    propertyUnits: Yup.number()
      .typeError("Units must be a number")
      .positive("Units must be positive")
      .required("Units is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be positive")
      .required("Price is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
  });

  const formik = useFormik({
    initialValues: formData.bulkDetails,
    validationSchema,
    onSubmit: (values) => {
      setBulkDetails(values);
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
      <InputField
        label="Property Name"
        placeholder="Enter property name"
        name="propertyName"
        value={formik.values.propertyName}
        onChange={formik.handleChange}
        error={formik.touched.propertyName && formik.errors.propertyName}
      />

      <OptionInputField
        label="Property Type"
        placeholder="Select property type"
        name="propertyType"
        value={formik.values.propertyType}
        onChange={(value) => formik.setFieldValue("propertyType", value)}
        options={propertyTypeOptions}
        dropdownTitle="Property Types"
        error={formik.touched.propertyType && formik.errors.propertyType}
      />

      <InputField
        label="Property Units"
        placeholder="Enter number of units"
        name="propertyUnits"
        value={formik.values.propertyUnits}
        onChange={formik.handleChange}
        error={formik.touched.propertyUnits && formik.errors.propertyUnits}
      />

      <InputField
        label="Price"
        placeholder="Enter price per unit"
        name="price"
        value={formik.values.price}
        onChange={formik.handleChange}
        error={formik.touched.price && formik.errors.price}
      />

      <InputField
        label="Address"
        placeholder="Enter address"
        name="address"
        value={formik.values.address}
        onChange={formik.handleChange}
        error={formik.touched.address && formik.errors.address}
      />

      <div className="grid lg:grid-cols-2 gap-12">
        <InputField
          label="City"
          placeholder="Enter city"
          name="city"
          value={formik.values.city}
          onChange={formik.handleChange}
          error={formik.touched.city && formik.errors.city}
        />

        <InputField
          label="State"
          placeholder="Enter state"
          name="state"
          value={formik.values.state}
          onChange={formik.handleChange}
          error={formik.touched.state && formik.errors.state}
        />
      </div>
    </form>
  );
});

export default BulkBasicDetails;