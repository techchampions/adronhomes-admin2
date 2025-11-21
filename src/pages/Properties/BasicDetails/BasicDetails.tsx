import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  ChangeEvent,
  useRef
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../components/input/inputtext";
import { PropertyContext } from "../../../MyContext/MyContext";
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



// Main BasicDetails component
const BasicDetails = forwardRef<BasicDetailsHandles>((_, ref) => {
  const { formData, setBasicDetails, setSales,selectedPropertyId,previousPropType} = useContext(PropertyContext)!;
  const dispatch = useDispatch<AppDispatch>();
    // const [propertyFiles, setPropertyFiles] = useState<any[]>(
    //   formData.basicDetails.propertyFiles || []
    // );
  
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

  const purposeOptions = [
    { value: "sale", label: "Sale" },
    { value: "rent", label: "Rent" },
  ];

  const validationSchema = Yup.object().shape({

  });

  const formik = useFormik({
    initialValues: {
      ...formData.basicDetails,
      category_id: formData.basicDetails.category_id || "",
      purpose: formData.basicDetails.purpose || [],
       propertyFiles: formData.basicDetails.propertyFiles || [],
    },
    validationSchema,
    onSubmit: (values) => {
      setBasicDetails(values);
      const salePurpose = values.purpose.find(p => p.toLowerCase() === 'sale');
      setSales(salePurpose ? false : true);
    },
    enableReinitialize: true,
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

  useEffect(() => {
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
 {selectedPropertyId&&<p className="text-base text-black">
  <span className="text-lg font-bold">Previous Property Type:</span> {previousPropType}
</p>
}
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
          // Update Formik state directly instead of using local state
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
      {/* {errors.lgas && (
        <div className="text-red-500 text-sm">
          Error loading LGAs: {errors.lgas.message}
        </div>
      )} */}
    </form>
  );
});

export default BasicDetails;