import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useMemo,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../components/input/inputtext";
import { BasicDetailsHandles } from "../types/formRefs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../components/Redux/store";
import { formatToNaira } from "../../../utils/formatcurrency";
import TagInputField from "../../../components/input/TagInputField";
import {
  fetchAllCountries,
  fetchCountryStates,
  fetchStateLGAs,
  setSelectedCountry,
  setSelectedState,
  setSelectedLGA,
  selectAllCountries,
  selectCountryStates,
  selectStateLGAs,
  selectLoadingStates,
  selectErrorStates,
} from "../../../components/Redux/country/countrythunkand slice";
import EnhancedOptionInputField from "../../../components/input/enhancedSelecet";
import MultipleFileUploadField from "../../../components/input/multiplefile";
import { BasicDetailsFormValues } from "../../../MyContext/MyContext";
// import { BasicDetailsFormValues } from "../../../types/propertyTypes";

interface BasicDetailsLandProps {
  // Props for setting data
  setBasicDetails: (data: BasicDetailsFormValues) => void;
  setIsLandProperty?: (isLand: boolean) => void;
  setIsLandProperty2?: (isLand: boolean) => void;
  
  // Props for initial data
  initialData?: BasicDetailsFormValues;
  
  // Props for edit mode
  isEditMode?: boolean;
  previousPropType?: string;
  directorName?: string;
}

const validationSchema = Yup.object().shape({
  // propertyName: Yup.string().required("Property name is required"),
  // propertyType: Yup.string().required("Property type is required"),
  // price: Yup.number()
  //   .typeError("Price must be a number")
  //   .positive("Price must be positive")
  //   .required("Price is required"),
  // initialDeposit: Yup.number()
  //   .typeError("Initial deposit must be a number")
  //   .positive("Initial deposit must be positive")
  //   .required("Initial deposit is required"),
  // address: Yup.string().required("Address is required"),
  // country: Yup.string().required("Country is required"),
  // state: Yup.string().required("State is required"),
  // purpose: Yup.array()
  //   .of(Yup.string())
  //   .min(1, "At least one purpose is required")
  //   .required("Purpose is required"),
  // propertyFiles: Yup.array()
  //   .test(
  //     'files-check',
  //     'Property files are required',
  //     (value) => value && value.length > 0
  //   )
    // .optional(),
});

const BasicDetailsLand = forwardRef<BasicDetailsHandles, BasicDetailsLandProps>(({
  setBasicDetails,
  setIsLandProperty,
  setIsLandProperty2,
  initialData,
  isEditMode = false,
  previousPropType,
  directorName
}, ref) => {
  const dispatch = useDispatch<AppDispatch>();

  // Get form data from Redux store if needed
  const createFormData = useSelector((state: RootState) => state.createProperty);
  const editFormData = useSelector((state: RootState) => state.editProperty);

  // Determine which form data to use based on mode
  const formData = isEditMode ? editFormData : createFormData;
  
  // Use initialData if provided, otherwise use Redux form data
  const initialValues = initialData || formData.basicDetails;

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      purpose: initialValues.purpose || [],
      propertyFiles: initialValues.propertyFiles || [],
    },
     enableReinitialize: true,
  validateOnMount: true,
    validationSchema,
    onSubmit: (values) => {
      // Update land property flags if setter functions are provided
      if (setIsLandProperty) {
        setIsLandProperty(true); // Always true for BasicDetailsLand
      }
      if (setIsLandProperty2) {
        setIsLandProperty2(true); // Always true for BasicDetailsLand
      }

      // Submit the form data
      setBasicDetails({
        ...values,
        purpose: values.purpose || [],
        propertyFiles: values.propertyFiles || [],
      });
    },
  
  });

  const countries = useSelector(selectAllCountries);
  const loading = useSelector(selectLoadingStates);
  const errors = useSelector(selectErrorStates);

  // Only Land as property type for this component
  const propertyTypeOptions = [{ value: "1", label: "Land" }];

  const states = useSelector((state: RootState) =>
    selectCountryStates(state, formik.values.country)
  );
  const lgas = useSelector((state: RootState) =>
    selectStateLGAs(state, formik.values.country, formik.values.state)
  );

  const countriesOptions = useMemo(
    () =>
      (countries || [])
        .map((country: any) => ({
          value: country.name || "",
          label: country.name || "",
        }))
        .sort((a, b) => (a.label || "").localeCompare(b.label || "")),
    [countries]
  );

  const statesOptions = useMemo(
    () =>
      (states || [])
        .map((state: any) => ({
          value: state.name || "",
          label: state.name || "",
        }))
        .sort((a, b) => (a.label || "").localeCompare(b.label || "")),
    [states]
  );

  const lgaOptions = useMemo(
    () =>
      (lgas || [])
        .filter((lga) => lga?.name?.trim())
        .map((lga) => ({ value: lga.name, label: lga.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [lgas]
  );

  // Handle property type change (only Land for this component)
  const handlePropertyTypeChange = (value: string) => {
    formik.setFieldValue("propertyType", value);
    
    // Always set land property flags to true for this component
    if (setIsLandProperty) {
      setIsLandProperty(true);
    }
    if (setIsLandProperty2) {
      setIsLandProperty2(true);
    }
  };

  useImperativeHandle(ref, () => ({
  handleSubmit: async () => {
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      formik.setTouched(
        Object.keys(errors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as Record<string, boolean>),
        true
      );
      return false;
    }

    await formik.submitForm();
    return true;
  },
 isValid: formik.isValid,
  values: formik.values,
}));

  // Fetch countries on mount
  useEffect(() => {
    dispatch(fetchAllCountries());
  }, [dispatch]);

  // Fetch states when country changes
  useEffect(() => {
    if (formik.values.country) {
      dispatch(fetchCountryStates(formik.values.country));
      dispatch(setSelectedCountry(formik.values.country));
    } else {
      dispatch(setSelectedCountry(null));
    }
  }, [formik.values.country, dispatch]);

  // Fetch LGAs when state changes
  useEffect(() => {
    if (formik.values.country && formik.values.state) {
      dispatch(
        fetchStateLGAs({
          countryName: formik.values.country,
          stateName: formik.values.state,
        })
      );
      dispatch(setSelectedState(formik.values.state));
    } else {
      dispatch(setSelectedState(null));
    }
  }, [formik.values.country, formik.values.state, dispatch]);

  // Set selected LGA
  useEffect(() => {
    if (formik.values.lga) {
      dispatch(setSelectedLGA(formik.values.lga));
    } else {
      dispatch(setSelectedLGA(null));
    }
  }, [formik.values.lga, dispatch]);

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

      {/* Show previous property type in edit mode */}
      {isEditMode && previousPropType && (
        <p className="text-base text-black">
          <span className="text-lg font-bold">Previous Property Type:</span> {previousPropType}
        </p>
      )}

      {/* Show director name if available */}
      {isEditMode && directorName && (
        <p className="text-base text-black">
          <span className="text-lg font-bold">Director:</span> {directorName}
        </p>
      )}

      <EnhancedOptionInputField
        label="Property Type"
        placeholder="Select property type"
        name="propertyType"
        value={formik.values.propertyType}
        onChange={handlePropertyTypeChange}
        options={propertyTypeOptions}
        dropdownTitle="Property Types"
        error={formik.touched.propertyType && formik.errors.propertyType}
        isSearchable={false}
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
      
      <EnhancedOptionInputField
        label="Country"
        placeholder={
          loading.countries ? "Loading countries..." : "Select country"
        }
        name="country"
        value={formik.values.country}
        onChange={(value) => {
          formik.setFieldValue("country", value);
          formik.setFieldValue("state", "");
          formik.setFieldValue("lga", "");
        }}
        options={countriesOptions}
        dropdownTitle="Countries"
        error={formik.touched.country && formik.errors.country}
        isLoading={loading.countries}
        isSearchable={true}
      />
      
      <EnhancedOptionInputField
        label="State"
        placeholder={loading.states ? "Loading states..." : "Select state"}
        name="state"
        value={formik.values.state}
        onChange={(value) => {
          formik.setFieldValue("state", value);
          formik.setFieldValue("lga", "");
        }}
        options={statesOptions}
        dropdownTitle="States"
        error={formik.touched.state && formik.errors.state}
        disabled={!formik.values.country}
        isLoading={loading.states}
        isSearchable={true}
      />

      <EnhancedOptionInputField
        label="LGA"
        placeholder={loading.lgas ? "Loading LGAs..." : "Select LGA"}
        name="lga"
        value={formik.values.lga}
        onChange={(value) => formik.setFieldValue("lga", value)}
        options={lgaOptions}
        dropdownTitle="LGAs"
        error={formik.touched.lga && formik.errors.lga}
        disabled={!formik.values.state}
        isLoading={loading.lgas}
        isSearchable={true}
      />

      <MultipleFileUploadField
        label="Upload Files"
        placeholder="Drag and drop or click to upload files"
        name="propertyFiles"
        multiple={true}
        onChange={(files) => {
          formik.setFieldValue("propertyFiles", files);
        }}
        value={formik.values.propertyFiles || []}
        error={formik.touched.propertyFiles && formik.errors.propertyFiles}
      />
      
      <TagInputField
        label="Purpose"
        placeholder="Add purpose (e.g., Bungalow)"
        values={formik.values.purpose || []}
        onChange={(purpose) => formik.setFieldValue("purpose", purpose)}
        error={formik.touched.purpose && formik.errors.purpose}
      />
      
      {errors.countries && (
        <div className="text-red-500 text-sm">
          Error loading countries: {errors.countries.message}
        </div>
      )}
      {errors.states && (
        <div className="text-red-500 text-sm">
          Error loading states: {errors.states.message}
        </div>
      )}
      {errors.lgas && (
        <div className="text-red-500 text-sm">
          Error loading LGAs: {errors.lgas.message}
        </div>
      )}
    </form>
  );
});

BasicDetailsLand.displayName = "BasicDetailsLand";

export default BasicDetailsLand;