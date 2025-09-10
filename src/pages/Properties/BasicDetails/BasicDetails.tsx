import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../components/input/inputtext";
// import EnhancedOptionInputField from "../../../components/input/enhanced_drop_down"; // New component
import { PropertyContext } from "../../../MyContext/MyContext";
import { BasicDetailsHandles } from "../types/formRefs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../components/Redux/store";
import { formatToNaira } from "../../../utils/formatcurrency";

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

const BasicDetails = forwardRef<BasicDetailsHandles>((_, ref) => {
  const { formData, setBasicDetails, setSales } = useContext(PropertyContext)!;
  const [initialLoad, setInitialLoad] = useState(true);
  const [purpose, setPurpose] = useState<string[]>(formData.basicDetails.purpose || []);

  const dispatch = useDispatch<AppDispatch>();
  // Get data from Redux store
  const countries = useSelector(selectAllCountries);
  const loading = useSelector(selectLoadingStates);
  const errors = useSelector(selectErrorStates);

  const propertyTypeOptions = [
    { value: "2", label: "Residential" },
    { value: "3", label: "Industrial" },
    { value: "4", label: "Commercial" },
  ];

  const categoryOptions = [
    { value: "1", label: "Adron Court" },
    { value: "2", label: "Vidco Series" },
  ];

  const locationTypeOptions = [
    { value: "urban", label: "Urban" },
    { value: "suburban", label: "Suburban" },
    { value: "rural", label: "Rural" },
  ];

  const purposeOptions = [
    { value: "sale", label: "Sale" },
    { value: "rent", label: "Rent" },
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
    // lga: Yup.string().required("LGA is required"),
    purpose: Yup.array()
      .of(Yup.string())
      .min(1, "At least one purpose is required")
      .required("Purpose is required"),
  });

  const formik = useFormik({
    initialValues: {
      ...formData.basicDetails,
      category: formData.basicDetails.category || "",
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
        category_id: formData.basicDetails.category_id || "",
        purpose: formData.basicDetails.purpose || [],
      });
      setPurpose(formData.basicDetails.purpose || []);
      setInitialLoad(false);
    }
  }, [formData.basicDetails, initialLoad]);

  useEffect(() => {
    formik.setFieldValue("purpose", purpose);
  }, [purpose]);

  const handlePurposeChange = (value: string) => {
    const normalized = value.toLowerCase();
    setPurpose([normalized]);
    setSales(normalized === "sale" ? false : true);
  };

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

  // Fetch countries on component mount
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
      dispatch(fetchStateLGAs({
        countryName: formik.values.country,
        stateName: formik.values.state
      }));
      dispatch(setSelectedState(formik.values.state));
    } else {
      dispatch(setSelectedState(null));
    }
  }, [formik.values.country, formik.values.state, dispatch]);

  // Set LGA when it changes
  useEffect(() => {
    if (formik.values.lga) {
      dispatch(setSelectedLGA(formik.values.lga));
    } else {
      dispatch(setSelectedLGA(null));
    }
  }, [formik.values.lga, dispatch]);

  // Format countries for dropdown
  const countriesOptions = useMemo(() => 
    countries
      .map((country: any) => ({ value: country.name, label: country.name }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    [countries]
  );

  // Get states and LGAs based on selected values
  const states = useSelector((state: RootState) =>
    selectCountryStates(state, formik.values.country)
  );
  const statesOptions = useMemo(() => 
    states
      .map((state: any) => ({ value: state.name, label: state.name }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    [states]
  );



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

      <EnhancedOptionInputField
        label="Property Type"
        placeholder="Select property type"
        name="propertyType"
        value={formik.values.propertyType}
        onChange={(value) => formik.setFieldValue("propertyType", value)}
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
        placeholder="Select country"
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
      /> */}

      <EnhancedOptionInputField
        label="Purpose"
        placeholder="Select purpose"
        name="purpose"
        value={purpose[0] || ""}
        onChange={handlePurposeChange}
        options={purposeOptions}
        dropdownTitle="Purpose"
        error={formik.touched.purpose && formik.errors.purpose}
        isSearchable={false}
      />

      {/* Display error messages if any */}
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

export default BasicDetails;