import React, { forwardRef, useContext, useEffect, useImperativeHandle } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../components/input/inputtext";
import OptionInputField from "../../../components/input/drop_down";
import { PropertyContext } from "../../../MyContext/MyContext";
import { personnels } from "../../../components/Redux/personnel/personnel_thunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../components/Redux/store";

interface BulkBasicDetailsHandles {
  handleSubmit: () => Promise<boolean>;
  isValid: boolean;
}

interface BulkBasicDetailsProps {}

const BulkBasicDetails = forwardRef<BulkBasicDetailsHandles, BulkBasicDetailsProps>((props, ref) => {
  const { formData, setBulkDetails } = useContext(PropertyContext)!;
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(personnels("4"));
  }, [dispatch]);

  const {
    loading: userLoading,
    error: userError,
    data
  } = useSelector((state: RootState) => state.getpersonnel);

  const propertyTypeOptions = [
    { value: "1", label: "Land" },
    { value: "2", label: "Residential" },
    { value: "3", label: "Industrial" },
    { value: "4", label: "Commercial" },
  ];

  const validationSchema = Yup.object().shape({
    propertyName: Yup.string().required("Property name is required"),
    propertyType: Yup.string().required("Property type is required"),
    propertyUnits: Yup.number()
      .typeError("Units must be a number")
      .positive("Units must be positive")
      .integer("Units must be a whole number")
      .required("Units is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be positive")
      .required("Price is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    initialDeposit: Yup.number()
      .typeError("Initial deposit must be a number")
      .positive("Initial deposit must be positive")
      .required("Initial deposit is required"),
    lga: Yup.string().required("LGA is required"),
  });

  const formik = useFormik({
    initialValues: formData.bulkDetails,
    validationSchema,
    onSubmit: (values) => {
      setBulkDetails(values);
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      await formik.validateForm();
      formik.submitForm();
      
      if (!formik.isValid) {
        // Set all fields as touched to show errors
        const touchedFields = Object.keys(formik.values).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as { [field: string]: boolean });
        
        formik.setTouched(touchedFields);
        return false;
      }
      
      return true;
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
        type="number"
        value={formik.values.propertyUnits}
        onChange={formik.handleChange}
      
        error={formik.touched.propertyUnits && formik.errors.propertyUnits}
      />

      <InputField
        label="Price"
        placeholder="Enter price per unit"
        name="price"
        type="number"
        value={formik.values.price}
        onChange={(e) => {
          const newValue = e.target.value.replace(/,/g, "");
          if (/^\d*$/.test(newValue)) {
            formik.setFieldValue("price", newValue);
          }
        }}
      
        error={formik.touched.price && formik.errors.price}
      />

      <InputField
        label="Initial Deposit"
        placeholder="Enter initial deposit"
        name="initialDeposit"
        type="number"
        value={formik.values.initialDeposit}
        onChange={(e) => {
          const newValue = e.target.value.replace(/,/g, "");
          if (/^\d*$/.test(newValue)) {
            formik.setFieldValue("initialDeposit", newValue);
          }
        }}
      
        error={formik.touched.initialDeposit && formik.errors.initialDeposit}
      />

      <InputField
        label="Address"
        placeholder="Enter address"
        name="address"
        value={formik.values.address}
        onChange={formik.handleChange}
      
        error={formik.touched.address && formik.errors.address}
      />

      <div className="grid md:grid-cols-2 gap-12">
        <InputField
          label="City"
          placeholder="Enter city"
          name="city"
          value={formik.values.city}
          onChange={formik.handleChange}
        
          error={formik.touched.city && formik.errors.city}
        />

        <InputField
          label="LGA"
          placeholder="Enter LGA"
          name="lga"
          value={formik.values.lga}
          onChange={formik.handleChange}
        
          error={formik.touched.lga && formik.errors.lga}
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