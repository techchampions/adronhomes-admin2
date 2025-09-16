import React, {
  forwardRef,
  useImperativeHandle,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../../components/input/inputtext";
import FileUploadField from "../../../../components/input/FileUploadField";
import InputAreaField from "../../../../components/input/TextArea";
import TagInputField from "../../../../components/input/TagInputField";
import { PropertyContext } from "../../../../MyContext/MyContext";
import OptionInputField from "../../../../components/input/drop_down";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../components/Redux/store";
import { directors } from "../../../../components/Redux/directors/directors_thunk";
import EnhancedOptionInputField from "../../../../components/input/enhancedSelecet";

interface PropertySpecificationsHandles {
  handleSubmit: () => void;
  isValid: boolean;
}

interface PropertySpecificationsFormValues {
  bedrooms: string;
  bathrooms: string;
  toilets: string;  // <--- Add this line
  propertySize: string;
  landSize: string;
  parkingSpaces: string;
  yearBuilt: string;
  unitsAvailable: string;
  description: string;
  overview: string;
  documents: string;
  director_id: string;
  nearbyLandmarks: string[];
  rentDuration: string;
  buildingCondition: string;
  titleDocumentTypeProp: string[];
  whatsAppLink: string;
  contactNumber: string;
}

interface DropdownOption {
  label: string;
  value: string | number;
}

const PropertySpecifications = forwardRef<PropertySpecificationsHandles>(
  (props, ref) => {
    const { formData, setSpecifications,sales, setSales } = useContext(PropertyContext)!;
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
      dispatch(directors());
    }, [dispatch]);

    const { data } = useSelector((state: RootState) => state.directors);

    const labels: DropdownOption[] = Array.isArray(data)
      ? data.map((person) => ({
          label: `${person.first_name} ${person.last_name}`,
          value: person.id,
        }))
      : [];

    const [nearbyLandmarks, setNearbyLandmarks] = useState<string[]>(
      formData.specifications?.nearbyLandmarks || []
    );
const [titleDocumentTypeProp, setTitleDocumentType] = useState<string[]>(
  formData.specifications?.titleDocumentTypeProp || []
);


   const validationSchema = Yup.object().shape({
  bedrooms: Yup.string().required("Number of bedrooms is required"),
  bathrooms: Yup.string().required("Number of bathrooms is required"),
  toilets: Yup.string().required("Number of toilets is required"),  
  // propertySize: Yup.string().required("Property size is required"),
  description: Yup.string().required("Description is required"),
  // overview: Yup.string().required("Overview is required"),
  director_id: Yup.string().required("Director is required"),
  documents: Yup.string().required("Property Agreement details are required"),
  nearbyLandmarks: Yup.array()
    .of(Yup.string())
    .min(1, "At least one landmark is required")
    .required("Nearby Landmarks are required"),
  // rentDuration: Yup.string().required("Rent duration is required"),
  buildingCondition: Yup.string().required("Building condition is required"),
titleDocumentTypeProp: Yup.array()
    .of(Yup.string())
    .min(1, "At least one title document type is required")
    .required("Title document type is required"),
  whatsAppLink: Yup.string().required("WhatsApp link is required"),
  contactNumber: Yup.string().required("Contact number is required"),
});

const formik = useFormik<PropertySpecificationsFormValues>({
  initialValues: {
    bedrooms: formData.specifications?.bedrooms || "",
    bathrooms: formData.specifications?.bathrooms || "",
    toilets: formData.specifications?.toilets || "",  
    propertySize: formData.specifications?.propertySize || "",
    landSize: formData.specifications?.landSize || "",
    parkingSpaces: formData.specifications?.parkingSpaces || "",
    yearBuilt: formData.specifications?.yearBuilt || "",
    unitsAvailable: formData.specifications?.unitsAvailable || "",
    description: formData.specifications?.description || "",
    overview: formData.specifications?.overview || "",
    documents: formData.specifications?.documents || "",
    director_id: formData.specifications?.director_id || "",
    nearbyLandmarks: formData.specifications?.nearbyLandmarks || [],  // array
    rentDuration: formData.specifications?.rentDuration || "",
    buildingCondition: formData.specifications?.buildingCondition || "",
    titleDocumentTypeProp: formData.specifications?.titleDocumentTypeProp || [],  // array
    whatsAppLink: formData.specifications?.whatsAppLink || "",
    contactNumber: formData.specifications?.contactNumber || "",
  },
  validationSchema,
  onSubmit: (values) => {
    setSpecifications(values);
  },
});


    useEffect(() => {
      formik.setFieldValue("nearbyLandmarks", nearbyLandmarks);
    }, [nearbyLandmarks]);

useEffect(() => {
  formik.setFieldValue("titleDocumentTypeProp", titleDocumentTypeProp);
}, [titleDocumentTypeProp]);


    const validateAndSubmit = useCallback(async () => {
      try {
        const errors = await formik.validateForm();
        if (Object.keys(errors).length > 0) {
          formik.setTouched(
            Object.keys(errors).reduce((acc, key) => {
              acc[key as keyof PropertySpecificationsFormValues] = true;
              return acc;
            }, {} as Record<string, boolean>)
          );
          return false;
        }
        formik.handleSubmit();
        return true;
      } catch (error) {
        console.error("Validation error:", error);
        return false;
      }
    }, [formik]);

    useImperativeHandle(ref, () => ({
      handleSubmit: validateAndSubmit,
      isValid: formik.isValid && Object.keys(formik.touched).length > 0,
    }));

    const buildingConditionOptions = [
      { value: "Off-plan", label: "Off-plan" },
      { value: "New", label: "New" },
      { value: "Old", label: "Old" },
    ];

    const rentDurationOptions = [
      { value: "yearly", label: "Yearly" },
      { value: "monthly", label: "Monthly" },
    ];

    return (
      <form onSubmit={formik.handleSubmit} className="space-y-[30px]">
     
<EnhancedOptionInputField
  label="Director"
  placeholder="Select director"
  name="director_id"
  value={formik.values.director_id}
  onChange={(value) => formik.setFieldValue("director_id", value)}
  options={labels} 
  dropdownTitle="Directors"
  error={formik.touched.director_id && formik.errors.director_id}
  isSearchable={true}
/>
         <div className="grid md:grid-cols-2 gap-12">
          <InputField
            label="WhatsApp Link"
            placeholder="Enter WhatsApp link"
            name="whatsAppLink"
            value={formik.values.whatsAppLink}
            onChange={formik.handleChange}
            error={
              formik.touched.whatsAppLink && formik.errors.whatsAppLink
                ? formik.errors.whatsAppLink
                : undefined
            }
          />
          <InputField
            label="Contact Number"
            placeholder="Enter contact number"
            name="contactNumber"
            value={formik.values.contactNumber}
            onChange={formik.handleChange}
            error={
              formik.touched.contactNumber && formik.errors.contactNumber
                ? formik.errors.contactNumber
                : undefined
            }
          />
        </div>
        <div className="grid md:grid-cols-3 gap-12">
  <InputField
    label="Number of Bedrooms"
    placeholder="Enter Number of Bedrooms"
    name="bedrooms"
    value={formik.values.bedrooms}
    onChange={(e) => {
      let newValue = e.target.value.replace(/,/g, "");
      if (/^\d*$/.test(newValue)) {
        formik.setFieldValue("bedrooms", newValue);
      }
    }}
    error={
      formik.touched.bedrooms && formik.errors.bedrooms
        ? formik.errors.bedrooms
        : undefined
    }
  />
  <InputField
    label="Number of Bathrooms"
    placeholder="Enter Number of Bathrooms"
    name="bathrooms"
    value={formik.values.bathrooms}
    onChange={(e) => {
      let newValue = e.target.value.replace(/,/g, "");
      if (/^\d*$/.test(newValue)) {
        formik.setFieldValue("bathrooms", newValue);
      }
    }}
    error={
      formik.touched.bathrooms && formik.errors.bathrooms
        ? formik.errors.bathrooms
        : undefined
    }
  />
  <InputField
    label="Number of Toilets"
    placeholder="Enter Number of Toilets"
    name="toilets"
    value={formik.values.toilets}
    onChange={(e) => {
  let newValue = e.target.value.replace(/,/g, "");
      if (/^\d*$/.test(newValue))  {
        formik.setFieldValue("toilets", newValue);
      }
    }}
    error={
      formik.touched.toilets && formik.errors.toilets
        ? formik.errors.toilets
        : undefined
    }
  />
</div>

        <div className=" gap-12">
          {/* <div className="relative">
            <p className="text-sm font-[325] text-[#768676] absolute top-10 z-20 right-3">
              Sq M
            </p>
            <InputField
              label="Property Size"
              placeholder="Enter Property Size"
              name="propertySize"
              value={formik.values.propertySize}
              onChange={(e) => {
                let newValue = e.target.value.replace(/,/g, "");
                if (/^\d*$/.test(newValue)) {
                  formik.setFieldValue("propertySize", newValue);
                }
              }}
              error={
                formik.touched.propertySize && formik.errors.propertySize
                  ? formik.errors.propertySize
                  : undefined
              }
            />
          </div> */}
 <div className="relative">
          <p className="text-sm font-[325] text-[#768676] absolute top-10 z-20 right-3">
            Sq M
          </p>
          <InputField
            label="Land Size"
            placeholder="Enter Land Size"
            name="landSize"
            value={formik.values.landSize}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                formik.setFieldValue("landSize", newValue);
              }
            }}
          />
        </div>
    </div>
        <div className="grid md:grid-cols-2 gap-12">
          <InputField
            label="Parking Spaces"
            placeholder="Enter Parking Spaces"
            name="parkingSpaces"
            value={formik.values.parkingSpaces}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                formik.setFieldValue("parkingSpaces", newValue);
              }
            }}
          />

          <InputField
            label="Year Built"
            placeholder="Enter Year Built"
            name="yearBuilt"
            value={formik.values.yearBuilt}
            onChange={formik.handleChange}
            type="date"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <InputField
            label="Units Available"
            placeholder="Enter Units Available"
            name="unitsAvailable"
            value={formik.values.unitsAvailable}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                formik.setFieldValue("unitsAvailable", newValue);
              }
            }}
          />
        </div>

        <InputAreaField
          label="Description"
          placeholder="Enter your Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          required
          rows={6}
          error={
            formik.touched.description && formik.errors.description
              ? formik.errors.description
              : undefined
          }
        />
{/* 
        <InputAreaField
          label="Overview"
          placeholder="Enter your Overview"
          name="overview"
          value={formik.values.overview}
          onChange={formik.handleChange}
          required
          rows={6}
          error={
            formik.touched.overview && formik.errors.overview
              ? formik.errors.overview
              : undefined
          }
        /> */}

        <div className="grid md:grid-cols-2 gap-12">
       { sales  &&(<OptionInputField
            label="Rent Duration"
            placeholder="Select duration"
            name="rentDuration"
            value={formik.values.rentDuration}
            onChange={(value) => formik.setFieldValue("rentDuration", value)}
            options={rentDurationOptions}
            error={
              formik.touched.rentDuration && formik.errors.rentDuration
                ? formik.errors.rentDuration
                : undefined
            }
          />)}
          <OptionInputField
            label="Building Condition"
            placeholder="Select condition"
            name="buildingCondition"
            value={formik.values.buildingCondition}
            onChange={(value) => formik.setFieldValue("buildingCondition", value)}
            options={buildingConditionOptions}
            error={
              formik.touched.buildingCondition && formik.errors.buildingCondition
                ? formik.errors.buildingCondition
                : undefined
            }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <TagInputField
            label="Nearby Landmarks"
            placeholder="Add nearby landmarks (e.g., Hospital, Mall)"
            values={nearbyLandmarks}
            onChange={(newLandmarks) => setNearbyLandmarks(newLandmarks)}
            error={
              formik.touched.nearbyLandmarks && formik.errors.nearbyLandmarks
            }
          />
       <TagInputField
  label="Title Document Type"
  placeholder="Add title document type (e.g., Deed, Lease)"
  values={titleDocumentTypeProp}
  onChange={(newTypes) => setTitleDocumentType(newTypes)}
  error={
    formik.touched.titleDocumentTypeProp && formik.errors.titleDocumentTypeProp
  }
/>
        </div>

        <InputAreaField
          label="Property Agreement"
          placeholder="Enter details of the Property Agreement"
          name="documents"
          value={formik.values.documents}
          onChange={(e) => formik.setFieldValue("documents", e.target.value)}
          rows={6}
          error={
            formik.touched.documents && formik.errors.documents
              ? formik.errors.documents
              : undefined
          }
        />

       
      </form>
    );
  }
);

PropertySpecifications.displayName = "PropertySpecifications";

export default PropertySpecifications;
