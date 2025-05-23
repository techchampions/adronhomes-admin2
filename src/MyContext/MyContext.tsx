// PropertyContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from "react";

// Define the form data types
interface BasicDetailsFormValues {
  propertyName: string;
  propertyType: string;
  price: string;
  initialDeposit: string;
  address: string;
  locationType: string;
  purpose: string;
}

interface BulkDetailsFormValues {
  propertyName: string;
  propertyType: string;
  propertyUnits: string;
  price: string;
  address: string;
  city: string;
  state: string;
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
}

interface LandFormValues {
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
  paymentSchedule: string;
  feesCharges: string;
}

interface PropertyFormData {
  basicDetails: BasicDetailsFormValues;
  bulkDetails: BulkDetailsFormValues; // Add bulk details
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
  setBulkDetails: (data: BulkDetailsFormValues) => void; // Add this
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
}

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined
);

interface PropertyProviderProps {
  children: ReactNode;
}

const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLandProperty, setIsLandProperty] = useState<boolean>(false);
  const [isBulk, setIsBulk] = useState<boolean>(false);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [showPersonnelModal, setPersonnelModal] = useState<boolean>(false);
  const [isUserBulk, setIsUserBulk] = useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isCancelState, setIsCancelState] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
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
      // Add initial bulk details
      propertyName: "",
      propertyType: "",
      propertyUnits: "1",
      price: "",
      address: "",
      city: "",
      state: "",
    },
    specifications: {
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
      paymentSchedule: "",
      feesCharges: "",
    },
  });

  const setBasicDetails = (data: BasicDetailsFormValues) => {
    const isLand = data.propertyType.toLowerCase() === "land";
    setIsLandProperty(isLand);

    setFormData((prev) => ({
      ...prev,
      basicDetails: data,
    }));
  };

  // Add this function for bulk details
  const setBulkDetails = (data: BulkDetailsFormValues) => {
    const isLand = data.propertyType.toLowerCase() === "land";
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
    const isLand = propertyType.toLowerCase() === "land";
    if (isLandProperty !== isLand) {
      setIsLandProperty(isLand);
    }
  }, [formData.basicDetails.propertyType, formData.bulkDetails.propertyType]);

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
      const finalData = isBulk
        ? {
            ...formData,
            specifications: isLandProperty
              ? formData.landForm
              : formData.specifications,
            bulkDetails: formData.bulkDetails,
          }
        : {
            ...formData,
            specifications: isLandProperty
              ? formData.landForm
              : formData.specifications,
          };

      console.log("Submitting form data:", finalData);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form");
    }
  };

  return (
    <PropertyContext.Provider
      value={{
        isCancelState,
        setIsCancelState,
        formData,
        setBasicDetails,
        setBulkDetails, // Add this
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
         setForgotPassword
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export { PropertyContext, PropertyProvider };
