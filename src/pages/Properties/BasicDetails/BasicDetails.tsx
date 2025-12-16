import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  ChangeEvent,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../components/input/inputtext";
import { BasicDetailsHandles } from "../types/formRefs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../components/Redux/store";
import { formatToNaira } from "../../../utils/formatcurrency";
import { AiOutlineUpload } from "react-icons/ai";
import { MdClose } from "react-icons/md";

// Import the Redux actions and selectors
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

// Import the BasicDetailsFormValues interface from types
// import { BasicDetailsFormValues } from "../../../types/propertyTypes";

interface BasicDetailsProps {
  // Props for Redux actions
  setBasicDetails: (data: BasicDetailsFormValues) => void;
  setIsLandProperty?: (isLand: boolean) => void;
  setIsLandProperty2?: (isLand: boolean) => void;
  setSales?: (sales: boolean) => void;
  
  // Props for initial data
  initialData?: BasicDetailsFormValues;
  
  // Props for edit mode
  isEditMode?: boolean;
  previousPropType?: string;
}

// Main BasicDetails component
const BasicDetails = forwardRef<BasicDetailsHandles, BasicDetailsProps>(({
  setBasicDetails,
  setIsLandProperty,
  setIsLandProperty2,
  setSales,
  initialData,
  isEditMode = false,
  previousPropType
}, ref) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get data from Redux store
  const countries = useSelector(selectAllCountries);
  const loading = useSelector(selectLoadingStates);
  const errors = useSelector(selectErrorStates);

  // Also get form data from Redux store if needed
  const createFormData = useSelector((state: RootState) => state.createProperty);
  const editFormData = useSelector((state: RootState) => state.editProperty);

  // Determine which form data to use based on mode
  const formData = isEditMode ? editFormData : createFormData;
  const metadata = isEditMode ? editFormData.metadata : createFormData.metadata;

  const propertyTypeOptions = [
    { value: "2", label: "Residential" },
    { value: "3", label: "Industrial" },
    { value: "4", label: "Commercial" },
  ];

  const categoryOptions = [
    { value: 1, label: "Adron Court" },
    { value: 2, label: "Vidco Series" },
  ];

  const purposeOptions = [
    { value: "sale", label: "Sale" },
    { value: "rent", label: "Rent" },
  ];

  const validationSchema = Yup.object().shape({
    // propertyName: Yup.string().required("Property name is required"),
    // propertyType: Yup.string().required("Property type is required"),
    // price: Yup.string()
    //   .required("Price is required")
    //   .test(
    //     'is-number',
    //     'Price must be a valid number',
    //     (value) => !value || /^\d+$/.test(value.replace(/[₦,]/g, ''))
    //   ),
    // address: Yup.string().required("Address is required"),
    // country: Yup.string().required("Country is required"),
    // state: Yup.string().required("State is required"),
    // purpose: Yup.array()
    //   .of(Yup.string())
    //   .min(1, "At least one purpose is required"),
    // propertyFiles: Yup.array()
    //   .test(
    //     'files-check',
    //     'Files are required',
    //     (value) => value && value.length > 0
    //   )
    //   .optional(),
  });

  // Use initialData if provided, otherwise use Redux form data
  const initialValues = initialData || formData.basicDetails;

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      category_id: initialValues.category_id || "",
      purpose: initialValues.purpose || [],
      propertyFiles: initialValues.propertyFiles || [],
    },
      validateOnMount: true,
  enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      // Check if property type is Land and call setIsLandProperty if provided
      if (setIsLandProperty && values.propertyType) {
        const selectedOption = propertyTypeOptions.find(
          opt => opt.value === values.propertyType
        );
        if (selectedOption?.label === "Land") {
          setIsLandProperty(true);
        } else {
          setIsLandProperty(false);
        }
      }

      // Similarly for setIsLandProperty2 if provided
      if (setIsLandProperty2 && values.propertyType) {
        const selectedOption = propertyTypeOptions.find(
          opt => opt.value === values.propertyType
        );
        if (selectedOption?.label === "Land") {
          setIsLandProperty2(true);
        } else {
          setIsLandProperty2(false);
        }
      }

      // Update the form data via the setter function
      setBasicDetails(values);
      
      // Set sales flag if setSales function is provided
      if (setSales) {
        const salePurpose = values.purpose.find(p => p.toLowerCase() === 'sale');
        setSales(salePurpose ? false : true);
      }
    },
    // enableReinitialize: true,
  });

  const countriesOptions = useMemo(() => 
    (countries || [])
      .map((country: any) => ({ value: country.name, label: country.name }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    [countries]
  );

  const states = useSelector((state: RootState) =>
    selectCountryStates(state, formik.values.country)
  );
  const statesOptions = useMemo(() => 
    (states || [])
      .map((state: any) => ({ value: state.name, label: state.name }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    [states]
  );

  const lgas = useSelector((state: RootState) =>
    selectStateLGAs(state, formik.values.country, formik.values.state)
  );
  const lgaOptions = useMemo(() => 
    (lgas || [])
      .filter((lga) => lga?.name?.trim())
      .map((lga) => ({ value: lga.name, label: lga.name }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    [lgas]
  );

  const handlePurposeChange = (value: string) => {
    const normalized = value.toLowerCase();
    formik.setFieldValue("purpose", [normalized]);
    
    // Set sales flag if setSales function is provided
    if (setSales) {
      setSales(normalized === "sale" ? false : true);
    }
  };

  // Handle property type change
  const handlePropertyTypeChange = (value: string) => {
    formik.setFieldValue("propertyType", value);
    
    // Update land property flags if setter functions are provided
    if (setIsLandProperty || setIsLandProperty2) {
      const selectedOption = propertyTypeOptions.find(
        opt => opt.value === value
      );
      const isLand = selectedOption?.label === "Land";
      
      if (setIsLandProperty) {
        setIsLandProperty(isLand);
      }
      if (setIsLandProperty2) {
        setIsLandProperty2(isLand);
      }
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

    formik.submitForm();
    return true;
  },
  isValid: formik.isValid,
  values: formik.values,
}));


  useEffect(() => {const validateStep = async (ref: any) => {
  if (!ref?.current) return false;

  await ref.current.submitForm();

  const errors = await ref.current.validateForm();
  return Object.keys(errors).length === 0;
};


    dispatch(fetchAllCountries());
  }, [dispatch]);

  useEffect(() => {
    if (formik.values.country) {
      dispatch(fetchCountryStates(formik.values.country));
      dispatch(setSelectedCountry(formik.values.country));
    } else {
      dispatch(setSelectedCountry(null));
    }
  }, [formik.values.country, dispatch]);

  useEffect(() => {
    if (formik.values.country && formik.values.state) {
      dispatch(fetchStateLGAs({
        countryName: formik.values.country,
        stateName: formik.values.state
      }));
      dispatch(setSelectedState(formik.values.state));
    } else {
      dispatch(setSelectedState(null));
    }
  }, [formik.values.country, formik.values.state, dispatch]);

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
      
      {isEditMode && previousPropType && (
        <p className="text-base text-black">
          <span className="text-lg font-bold">Previous Property Type:</span> {previousPropType}
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

      <EnhancedOptionInputField
        label="Category"
        placeholder="Select category"
        name="category_id"
        value={formik.values.category_id}
        onChange={(value) => formik.setFieldValue("category_id", value)}
        options={categoryOptions}
        dropdownTitle="Categories"
        error={formik.touched.category_id && formik.errors.category_id}
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
        label="Subscription Form"
        placeholder="Enter Subscription "
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
        placeholder={loading.countries ? "Loading countries..." : "Select country"}
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

      {/* <EnhancedOptionInputField
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
      /> */}

      <EnhancedOptionInputField
        label="Purpose"
        placeholder="Select purpose"
        name="purpose"
        value={Array.isArray(formik.values.purpose) ? formik.values.purpose[0] : ''}
        onChange={handlePurposeChange}
        options={purposeOptions}
        dropdownTitle="Purpose"
        error={formik.touched.purpose && formik.errors.purpose}
        isSearchable={false}
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

BasicDetails.displayName = "BasicDetails";

export default BasicDetails;