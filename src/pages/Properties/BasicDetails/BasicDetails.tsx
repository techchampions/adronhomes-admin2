import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../components/input/inputtext";
import OptionInputField from "../../../components/input/drop_down";
import { PropertyContext } from "../../../MyContext/MyContext";
import { BasicDetailsHandles } from "../types/formRefs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../components/Redux/store";
import { personnels } from "../../../components/Redux/personnel/personnel_thunk";
import { formatToNaira } from "../../../utils/formatcurrency";
import TagInputField from "../../../components/input/TagInputField";

const BasicDetails = forwardRef<BasicDetailsHandles>((_, ref) => {
  const { formData, setBasicDetails,isLandProperty, setIsLandProperty } = useContext(PropertyContext)!;
  const [initialLoad, setInitialLoad] = useState(true);
const [purpose, setpurpose] = useState<string[]>(formData.basicDetails.purpose || []);


  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(personnels({ role: 4 }));
  }, [dispatch]);

  const propertyTypeOptions = [

    { value: 2, label: "Residential" },
    { value: 3, label: "Industrial" },
    { value: 4, label: "Commercial" },
  ];

  const locationTypeOptions = [
    { value: "urban", label: "Urban" },
    { value: "suburban", label: "Suburban" },
    { value: "rural", label: "Rural" },
  ];

  const purposeOptions = [
    { value: "bungalow", label: "Bungalow" },
    { value: "bungalow_duplex", label: "Bungalow Duplex" },
    { value: "single_family", label: "Single-Family Home" },
    { value: "duplex", label: "Duplex" },
    { value: "triplex", label: "Triplex" },
    { value: "fourplex", label: "Fourplex" },
    { value: "townhouse", label: "Townhouse" },
    { value: "apartment", label: "Apartment" },
    { value: "condo", label: "Condominium (Condo)" },
    { value: "cottage", label: "Cottage" },
    { value: "villa", label: "Villa" },
    { value: "semi_detached", label: "Semi-Detached House" },
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
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  lga: Yup.string().required("LGA is required"),
  locationType: Yup.string().required("Location type is required"),
  purpose: Yup.array()
    .of(Yup.string())
    .min(1, "At least one purpose is required")
    .required("Purpose is required"),
});

  const formik = useFormik({
    initialValues: {
      ...formData.basicDetails,
  purpose: purpose,
    },
    validationSchema,
    onSubmit: (values) => {
      setBasicDetails({
        ...values,
        purpose: purpose,
      });
    },
  });

  useEffect(() => {
    if (initialLoad && formData.basicDetails) {
      formik.setValues({
        ...formData.basicDetails,
        purpose: formData.basicDetails.purpose || [],
      });
      setpurpose(formData.basicDetails.purpose || []);
      setInitialLoad(false);
    }
  }, [formData.basicDetails, initialLoad]);

useEffect(() => {
  formik.setFieldValue("purpose", purpose);
}, [purpose]);


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
        label="Price"
        placeholder="Enter price per unit"
        name="price"
        value={formatToNaira(formik.values.price)}
        onChange={(e) => {
          const rawValue = e.target.value.replace(/[₦,]/g, "");
          if (/^\d*$/.test(rawValue)) {
            formik.setFieldValue("price", rawValue);
          }
        }}
        error={formik.touched.price && formik.errors.price}
      />

      <InputField
        label="Initial Deposit"
        placeholder="Enter initial deposit"
        name="initialDeposit"
        value={formatToNaira(formik.values.initialDeposit)}
        onChange={(e) => {
          const rawValue = e.target.value.replace(/[₦,]/g, "");
          if (/^\d*$/.test(rawValue)) {
            formik.setFieldValue("initialDeposit", rawValue);
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

      <InputField
        label="Country"
        placeholder="Enter Country"
        name="country"
        value={formik.values.country}
        onChange={formik.handleChange}
        error={formik.touched.country && formik.errors.country}
      />

      <InputField
        label="State"
        placeholder="Enter State"
        name="state"
        value={formik.values.state}
        onChange={formik.handleChange}
        error={formik.touched.state && formik.errors.state}
      />

      <InputField
        label="LGA"
        placeholder="Enter LGA"
        name="lga"
        value={formik.values.lga}
        onChange={formik.handleChange}
        error={formik.touched.lga && formik.errors.lga}
      />

      <div className=" gap-12">
        <OptionInputField
          label="Location Type"
          placeholder="Select location type"
          name="locationType"
          value={formik.values.locationType}
          onChange={(value) => formik.setFieldValue("locationType", value)}
          options={locationTypeOptions}
          dropdownTitle="Location Types"
          error={formik.touched.locationType && formik.errors.locationType}
        />
      </div>

      <TagInputField
        label="purpose"
        placeholder="Add purpose (e.g.,Bungalow)"
        values={purpose}
        onChange={(newpurpose) => setpurpose(newpurpose)}
        error={formik.touched.purpose && formik.errors.purpose}
      />
    </form>
  );
});

export default BasicDetails;