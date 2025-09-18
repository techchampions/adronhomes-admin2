import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
  useMemo,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../components/input/inputtext";
import { PropertyContext } from "../../../MyContext/MyContext";
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
  purpose: Yup.array()
    .of(Yup.string())
    .min(1, "At least one purpose is required")
    .required("Purpose is required"),
});

const BasicDetails = forwardRef<BasicDetailsHandles>((_, ref) => {
  const { formData, setBasicDetails,director_name,selectedPropertyId,previousPropType} = useContext(PropertyContext)!;
  const dispatch = useDispatch<AppDispatch>();

  const [purpose, setPurpose] = useState<string[]>(
    formData.basicDetails.purpose || []
  );

  const formik = useFormik({
    initialValues: {
      ...formData.basicDetails,
      purpose: purpose,
       propertyFiles: formData.basicDetails.propertyFiles || [],
    },
    validationSchema,
    onSubmit: (values) => {
      setBasicDetails({
        ...values,
        purpose: purpose,
  propertyFiles: formData.basicDetails.propertyFiles || [],
      });
    },
    enableReinitialize: true,
  });

  const countries = useSelector(selectAllCountries);
  const loading = useSelector(selectLoadingStates);
  const errors = useSelector(selectErrorStates);

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

  useEffect(() => {
    formik.setFieldValue("purpose", purpose);
  }, [purpose]);

  // useEffect(() => {
  //   formik.setFieldValue("propertyFiles", propertyFiles);
  // }, [propertyFiles]);

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

  useEffect(() => {
    if (formik.values.lga) {
      dispatch(setSelectedLGA(formik.values.lga));
    } else {
      dispatch(setSelectedLGA(null));
    }
  }, [formik.values.lga, dispatch]);

  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      const errors = await formik.validateForm();
      const hasErrors = Object.keys(errors).length > 0;

      if (hasErrors) {
        formik.setTouched(
          Object.keys(errors).reduce((acc, key) => {
            (acc as any)[key] = true;
            return acc;
          }, {}),
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
      <TagInputField
        label="Purpose"
        placeholder="Add purpose (e.g., Bungalow)"
        values={purpose}
        onChange={(newPurpose) => setPurpose(newPurpose)}
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
      {/* {errors.lgas && (
        <div className="text-red-500 text-sm">
          Error loading LGAs: {errors.lgas.message}
        </div>
      )} */}
    </form>
  );
});

export default BasicDetails;