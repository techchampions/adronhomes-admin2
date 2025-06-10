import React, { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../components/Redux/store";
import {
  createProperty,
  resetPropertyState,
} from "../components/Redux/addProperty/addProperty_slice";
import { add_property_detail } from "../components/Redux/addProperty/addFees/addFees_thunk";
import { resetPropertyDetailState } from "../components/Redux/addProperty/addFees/add_property_detail_slice";
import { useNavigate } from "react-router-dom";

interface Fee {
  id: number;
  name: string;
  amount: string;
  checked: boolean;
  type: string;
}

interface BasicDetailsFormValues {
  propertyName: string;
  propertyType: any;
  price: string;
  initialDeposit: string;
  address: string;
  locationType: string;
  purpose: string;
}

interface BulkDetailsFormValues {
  propertyName: string;
  propertyType: any;
  propertyUnits: string;
  price: string;
  address: string;
  city: string;
  state: string;
  initialDeposit: string;
}

interface PropertySpecificationsFormValues {
  bedrooms: string;
  bathrooms: string;
  propertySize: string;
  landSize: string;
  parkingSpaces: string;
  yearBuilt: string;
  unitsAvailable: string;
  description: string;
  overview: string;
  documents: File[];
  director_id: any;
}

interface LandFormValues {
  director_id: any;
  plotShape: string;
  topography: string;
  propertySize: string;
  landSize: string;
  roadAccess: string;
  titleDocumentType: string;
  unitsAvailable: string;
  description: string;
  overview: string;
  documents: File[];
}

interface FeaturesFormValues {
  features: string[];
}

interface MediaFormValues {
  tourLink: string;
  images: File[];
  propertyVideo?: File;
}

interface DiscountFormValues {
  discountName: string;
  discountType: string;
  discountOff: string;
  unitsRequired: string;
  validFrom: string;
  validTo: string;
}

interface PaymentStructureFormValues {
  paymentType: string;
  paymentDuration: string;
  paymentSchedule: string[];
  feesCharges: string;
}

interface PropertyFormData {
  basicDetails: BasicDetailsFormValues;
  bulkDetails: BulkDetailsFormValues;
  specifications: PropertySpecificationsFormValues;
  landForm: LandFormValues;
  features: FeaturesFormValues;
  media: MediaFormValues;
  discount: DiscountFormValues;
  paymentStructure: PaymentStructureFormValues;
}

interface PropertyContextType {
  formData: PropertyFormData;
  setBasicDetails: (data: BasicDetailsFormValues) => void;
  setBulkDetails: (data: BulkDetailsFormValues) => void;
  setSpecifications: (data: PropertySpecificationsFormValues) => void;
  setLandForm: (data: LandFormValues) => void;
  setFeatures: (data: FeaturesFormValues) => void;
  setMedia: (data: MediaFormValues) => void;
  setDiscount: (data: DiscountFormValues) => void;
  setPaymentStructure: (data: PaymentStructureFormValues) => void;
  submitForm: () => Promise<void>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLandProperty: boolean;
  setIsLandProperty: (isLand: boolean) => void;
  isBulk: boolean;
  setIsBulk: (isBulk: boolean) => void;
  showBulkModal: boolean;
  setShowBulkModal: (showBulkModal: boolean) => void;
  isCancelState: boolean;
  setIsCancelState: (isCancelState: boolean) => void;
  showPersonnelModal: boolean;
  setPersonnelModal: (showPersonnelModal: boolean) => void;
  isUserBulk: boolean;
  setIsUserBulk: (showPersonnelModal: boolean) => void;
  forgotPassword: boolean;
  setForgotPassword: (forgotPassword: boolean) => void;
  loading: boolean;
  fees: Fee[];
  setFees: any;
  isInfrastructure: boolean;
  setIsCancelInfrastructure: (isInfrastructure: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  resetFormData: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

interface PropertyProviderProps {
  children: ReactNode;
}

const initialFormData: PropertyFormData = {
  basicDetails: {
    propertyName: "",
    propertyType: "",
    price: "",
    initialDeposit: "",
    address: "",
    locationType: "",
    purpose: "",
  },
  bulkDetails: {
    propertyName: "",
    propertyType: "",
    propertyUnits: "1",
    price: "",
    address: "",
    city: "",
    state: "",
    initialDeposit: "",
  },
  specifications: {
    director_id: "",
    bedrooms: "",
    bathrooms: "",
    propertySize: "",
    landSize: "",
    parkingSpaces: "",
    yearBuilt: "",
    unitsAvailable: "",
    description: "",
    overview: "",
    documents: [],
  },
  landForm: {
    director_id: "",
    plotShape: "",
    topography: "",
    propertySize: "",
    landSize: "",
    roadAccess: "",
    titleDocumentType: "",
    unitsAvailable: "",
    description: "",
    overview: "",
    documents: [],
  },
  features: {
    features: ["Gym", "Swimming Pool", "Drainage", "Super Market"],
  },
  media: {
    tourLink: "",
    images: [],
  },
  discount: {
    discountName: "",
    discountType: "",
    discountOff: "",
    unitsRequired: "",
    validFrom: "",
    validTo: "",
  },
  paymentStructure: {
    paymentType: "",
    paymentDuration: "",
    paymentSchedule: [],
    feesCharges: "",
  },
};

const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success, propertyId } = useSelector(
    (state: RootState) => state.addproperty
  );
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLandProperty, setIsLandProperty] = useState<boolean>(false);
  const [isBulk, setIsBulk] = useState<boolean>(false);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [showPersonnelModal, setPersonnelModal] = useState<boolean>(false);
  const [isUserBulk, setIsUserBulk] = useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isCancelState, setIsCancelState] = useState(false);
  const [isInfrastructure, setIsCancelInfrastructure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fees, setFees] = useState<Fee[]>([
    {
      id: 1,
      name: "Building Charge",
      amount: "₦16,000,000",
      checked: true,
      type: "₦16,000,000",
    },
    {
      id: 2,
      name: "Service charge",
      amount: "₦2,000,000",
      checked: true,
      type: "₦16,000,000",
    },
  ]);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const navigate = useNavigate();

  const resetFormData = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setIsLandProperty(false);
    setIsBulk(false);
   navigate("/properties");
    
    setFees([
      {
        id: 1,
        name: "Building Charge",
        amount: "₦16,000,000",
        checked: true,
        type: "₦16,000,000",
      },
      {
        id: 2,
        name: "Service charge",
        amount: "₦2,000,000",
        checked: true,
        type: "₦16,000,000",
      },
    ]);
  };

  const setBasicDetails = (data: BasicDetailsFormValues) => {
    const isLand = data.propertyType === 1;
    setIsLandProperty(isLand);

    setFormData((prev) => ({
      ...prev,
      basicDetails: data,
    }));
  };

  const setBulkDetails = (data: BulkDetailsFormValues) => {
    const isLand = data.propertyType === 1;
    setIsLandProperty(isLand);

    setFormData((prev) => ({
      ...prev,
      bulkDetails: data,
    }));
  };

  useEffect(() => {
    const propertyType = isBulk
      ? formData.bulkDetails.propertyType
      : formData.basicDetails.propertyType;
    const isLand = propertyType === 1;
    if (isLandProperty !== isLand) {
      setIsLandProperty(isLand);
    }
  }, [
    formData.basicDetails.propertyType,
    formData.bulkDetails.propertyType,
    isBulk,
    isLandProperty,
  ]);

  const setSpecifications = (data: PropertySpecificationsFormValues) => {
    setFormData((prev) => ({
      ...prev,
      specifications: data,
    }));
  };

  const setLandForm = (data: LandFormValues) => {
    setFormData((prev) => ({
      ...prev,
      landForm: data,
    }));
  };

  const setFeatures = (data: FeaturesFormValues) => {
    setFormData((prev) => ({
      ...prev,
      features: data,
    }));
  };

  const setMedia = (data: MediaFormValues) => {
    setFormData((prev) => ({
      ...prev,
      media: data,
    }));
  };

  const setDiscount = (data: DiscountFormValues) => {
    setFormData((prev) => ({
      ...prev,
      discount: data,
    }));
  };

  const setPaymentStructure = (data: PaymentStructureFormValues) => {
    setFormData((prev) => ({
      ...prev,
      paymentStructure: data,
    }));
  };

  const submitForm = async () => {
    try {
      setIsSubmitting(true);

      const {
        basicDetails,
        bulkDetails,
        specifications,
        landForm,
        features,
        media,
        discount,
        paymentStructure,
      } = formData;

      console.log("Complete form data:", formData);

      const formPayload = new FormData();

      if (isBulk) {
        formPayload.append("name", bulkDetails.propertyName);
        formPayload.append("type", bulkDetails.propertyType);
        formPayload.append("no_of_unit", bulkDetails.propertyUnits || "1");
        formPayload.append("price", bulkDetails.price);
        formPayload.append("street_address", bulkDetails.address);
        formPayload.append("city", bulkDetails.city || "");
        formPayload.append("state", bulkDetails.state || "");
        formPayload.append("category", "bulk");
        formPayload.append(
          "initial_deposit",
          basicDetails.initialDeposit || "0"
        );
      } else {
        formPayload.append("name", basicDetails.propertyName);
        formPayload.append("type", basicDetails.propertyType);
        formPayload.append("price", basicDetails.price);
        formPayload.append(
          "initial_deposit",
          basicDetails.initialDeposit || "0"
        );
        formPayload.append("street_address", basicDetails.address);
        formPayload.append("location_type", basicDetails.locationType || "");
        formPayload.append("purpose", basicDetails.purpose || "");
        formPayload.append("category", "single");
      }

      if (isLandProperty) {
        formPayload.append("size", landForm.propertySize);
        formPayload.append("shape", landForm.plotShape || "");
        formPayload.append("topography", landForm.topography || "");
        formPayload.append("road_access", landForm.roadAccess || "");
        formPayload.append(
          "title_document_type",
          landForm.titleDocumentType || ""
        );
        formPayload.append("overview", landForm.overview);
        formPayload.append("description", landForm.description);
        formPayload.append("units_available", landForm.unitsAvailable || "1");
        formPayload.append("director_id", landForm.director_id || "1");
      } else {
        formPayload.append("no_of_bedroom", specifications.bedrooms || "0");
        formPayload.append(
          "number_of_bathroom",
          specifications.bathrooms || "0"
        );
        formPayload.append("size", specifications.propertySize);
        formPayload.append(
          "parking_space",
          specifications.parkingSpaces || "0"
        );
        formPayload.append("overview", specifications.overview);
        formPayload.append("description", specifications.description);
        formPayload.append("year_built", specifications.yearBuilt || "");
        formPayload.append(
          "units_available",
          specifications.unitsAvailable || "1"
        );
        formPayload.append("director_id", specifications.director_id || "1");
      }

      if (Array.isArray(features.features)) {
        features.features.forEach((feature, index) => {
          formPayload.append(`features[${index}]`, feature);
        });
      }

      if (Array.isArray(media.images)) {
        media.images.forEach((image, index) => {
          if (image instanceof File) {
            formPayload.append(`photos[${index}]`, image);
            if (index === 0) {
              formPayload.append("display_image", image);
            }
          }
        });
      }

      if (media.tourLink) {
        formPayload.append("virtual_tour", media.tourLink);
      }

      formPayload.append("payment_type", paymentStructure.paymentType);
      formPayload.append(
        "property_duration_limit",
        paymentStructure.paymentDuration
      );

      if (Array.isArray(paymentStructure.paymentSchedule)) {
        paymentStructure.paymentSchedule.forEach((schedule, index) => {
          formPayload.append(`payment_schedule[${index}]`, schedule);
        });
      }

      formPayload.append("fees_charges", paymentStructure.feesCharges);

      if (discount.discountName) {
        formPayload.append("is_discount", "1");
        formPayload.append("discount_name", discount.discountName);
        formPayload.append("discount_percentage", discount.discountOff);
        formPayload.append("discount_units", discount.unitsRequired);
        formPayload.append("discount_start_date", discount.validFrom);
        formPayload.append("discount_end_date", discount.validTo);
      } else {
        formPayload.append("is_discount", "0");
      }

      const docs = isLandProperty
        ? landForm.documents
        : specifications.documents;
      if (Array.isArray(docs)) {
        docs.forEach((doc, index) => {
          if (doc instanceof File) {
            formPayload.append(`property_agreement[${index}]`, doc);
          }
        });
      }

      formPayload.append("is_active", "1");
      formPayload.append("status", "available");

      const result = await dispatch(
        createProperty({ credentials: formPayload })
      ).unwrap();

      const createdPropertyId = result.data.property.id || 0;

      if (createdPropertyId) {
        const feePromises = fees
          .filter((fee) => fee.checked)
          .map((fee) => ({
            property_id: createdPropertyId.toString(),
            name: fee.name,
            value: fee.amount.replace(/[^\d.]/g, ""),
            type: fee.type,
          }))
          .map((feeDetail) =>
            dispatch(add_property_detail({ credentials: feeDetail }))
              .then((result) => {
                console.log(`Successfully added fee: ${feeDetail.name}`);
                return result;
              })
              .catch((error) => {
                console.error(`Failed to add fee ${feeDetail.name}:`, error);
                toast.error(`Failed to add fee ${feeDetail.name}`);
                throw error;
              })
          );

        const feeResults = await Promise.allSettled(feePromises);

        const successfulFees = feeResults.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failedFees = feeResults.filter(
          (r) => r.status === "rejected"
        ).length;

        if (failedFees === 0) {
          toast.success("All fees added successfully!");
        } else {
          toast.warning(
            `Property created but ${failedFees} fee(s) failed to add`
          );
        }

        resetFormData();
        dispatch(resetPropertyState());
      } else {
        toast.error(
          "Property created but couldn't add fees - missing property ID"
        );
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);

      if (error.response) {
        toast.error(
          `Server error: ${
            error.response.data.message || error.response.statusText
          }`
        );
      } else if (error.request) {
        toast.error(
          "No response from server. Please check your network connection."
        );
      } else {
        toast.error(`Request error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PropertyContext.Provider
      value={{
        isInfrastructure,
        setIsCancelInfrastructure,
        fees,
        setFees,
        isCancelState,
        setIsCancelState,
        formData,
        setBasicDetails,
        setBulkDetails,
        setSpecifications,
        setLandForm,
        setFeatures,
        setMedia,
        setDiscount,
        setPaymentStructure,
        submitForm,
        currentStep,
        setCurrentStep,
        isLandProperty,
        setIsLandProperty,
        isBulk,
        setIsBulk,
        showBulkModal,
        setShowBulkModal,
        showPersonnelModal,
        setPersonnelModal,
        isUserBulk,
        setIsUserBulk,
        forgotPassword,
        setForgotPassword,
        loading,
        isSubmitting,
        setIsSubmitting,
        resetFormData,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export { PropertyContext, PropertyProvider };