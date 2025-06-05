// BulkBasicDetails.tsx
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
  handleSubmit: () => void;
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
    { value: 1, label: "Land" },
    { value: 2, label: "Residential" },
    { value: 3, label: "Industrial" },
    { value: 4, label: "Commercial" },
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
      initialDeposit: Yup.number()
          .typeError("Initial deposit must be a number")
          .positive("Initial deposit must be positive")
          .required("Initial deposit is required"),
  });

  const formik = useFormik({
    initialValues: formData.bulkDetails,
    validationSchema,
    onSubmit: (values) => {
      setBulkDetails(values);
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
        // onChange={formik.handleChange}
        error={formik.touched.price && formik.errors.price}
        
        onChange={(e) => {
                  let newValue = e.target.value.replace(/,/g, "");
                  if (/^\d*$/.test(newValue)) {
                    {
                      formik.setFieldValue("price", newValue);
                    }
                  }
                }}
      />
      <InputField
        label="Initial Deposit"
        placeholder="Enter initial deposit"
        name="initialDeposit"
        value={formik.values.initialDeposit}
         
        onChange={(e) => {
                  let newValue = e.target.value.replace(/,/g, "");
                  if (/^\d*$/.test(newValue)) {
                    {
                      formik.setFieldValue("initialDeposit", newValue);
                    }
                  }
                }}
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