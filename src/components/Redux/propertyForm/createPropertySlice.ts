import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CreatePropertyFormData,
  BasicDetailsFormValues,
  BulkDetailsFormValues,
  PropertySpecificationsFormValues,
  LandFormValues,
  FeaturesFormValues,
  MediaFormValues,
  DiscountFormValues,
  PaymentStructureFormValues,
  Fee,
} from "../../../MyContext/MyContext";
import { LandSizeSection } from "../../../pages/Properties/addPropplan/planForm";

const initialBasicDetails: BasicDetailsFormValues = {
  propertyName: "",
  propertyType: "",
  price: "",
  initialDeposit: "",
  address: "",
  locationType: "",
  purpose: ["Bungalow"],
  country: "",
  state: "",
  lga: "",
  category: "",
  category_id: "",
  propertyFiles: [],
};

const initialBulkDetails: BulkDetailsFormValues = {
  propertyName: "",
  propertyType: "",
  propertyUnits: "1",
  price: "",
  address: "",
  city: "",
  state: "",
  initialDeposit: "",
  country: "",
  lga: "",
};

const initialSpecifications: PropertySpecificationsFormValues = {
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
  documents: "",
  nearbyLandmarks: [],
  rentDuration: "",
  buildingCondition: "",
  whatsAppLink: "",
  contactNumber: "",
  toilets: "",
  titleDocumentTypeProp: ["C of O"],
};

const initialLandForm: LandFormValues = {
  director_id: "",
  plotShape: "",
  topography: "",
  propertySize: "",
  landSize: "",
  roadAccess: [],
  titleDocumentType: [],
  unitsAvailable: "",
  description: "",
  overview: "",
  documents: "",
  fencing: "",
  gatedEstate: "",
  contactNumber: "",
  whatsAppLink: "",
  nearbyLandmarks: [],
};

const initialState: CreatePropertyFormData = {
  basicDetails: initialBasicDetails,
  bulkDetails: initialBulkDetails,
  specifications: initialSpecifications,
  landForm: initialLandForm,
  features: {
    features: ["Gym", "Swimming Pool", "Drainage", "Super Market"],
  },
  media: {
    mapUrl: "",
    tourLink: "",
    videoLink: "",
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
  LandSizeSection: [],
  display: {
    status: "draft",
  },
  metadata: {
    currentStep: 1,
    isLandProperty: false,
    isLandProperty2: false,
    isBulk: false,
    isSubmitting: false,
    sales: false,
    director_name: "",
    previousPropType: "",
    showBulkModal: false,
    showPersonnelModal: false,
    isUserBulk: false,
    forgotPassword: false,
    isCancelState: false,
    isInfrastructure: false,
    option: 0,
    fees: [],
    newFees: [],
    imagePreview: null,
  },
};

const createPropertySlice = createSlice({
  name: "createProperty",
  initialState,
  reducers: {
    // Reset entire form
    resetCreateForm: () => initialState,

    // Set entire form data
    setCreateFormData: (
      state,
      action: PayloadAction<Partial<CreatePropertyFormData>>
    ) => {
      return { ...state, ...action.payload };
    },

    // Metadata actions
    setCreateCurrentStep: (state, action: PayloadAction<number>) => {
      state.metadata.currentStep = action.payload;
    },

    setIsCreateLandProperty: (state, action: PayloadAction<boolean>) => {
      state.metadata.isLandProperty = action.payload;
    },

    setIsCreateLandProperty2: (state, action: PayloadAction<boolean>) => {
      state.metadata.isLandProperty2 = action.payload;
    },

    setIsCreateBulk: (state, action: PayloadAction<boolean>) => {
      state.metadata.isBulk = action.payload;
    },

    setIsCreateSubmitting: (state, action: PayloadAction<boolean>) => {
      state.metadata.isSubmitting = action.payload;
    },

    setCreateSales: (state, action: PayloadAction<boolean>) => {
      state.metadata.sales = action.payload;
    },

    setCreateDirectorName: (state, action: PayloadAction<string>) => {
      state.metadata.director_name = action.payload;
    },

    setCreatePreviousPropType: (state, action: PayloadAction<string>) => {
      state.metadata.previousPropType = action.payload;
    },

    setCreateFees: (state, action: PayloadAction<Fee[]>) => {
      state.metadata.fees = action.payload;
    },

    setCreateNewFees: (state, action: PayloadAction<Fee[]>) => {
      state.metadata.newFees = action.payload;
    },

    setCreateImagePreview: (state, action: PayloadAction<string | null>) => {
      state.metadata.imagePreview = action.payload;
    },

    setCreateDisplayStatus: (
      state,
      action: PayloadAction<"draft" | "publish">
    ) => {
      state.display.status = action.payload;
    },

    // Modal controls
    setShowCreateBulkModal: (state, action: PayloadAction<boolean>) => {
      state.metadata.showBulkModal = action.payload;
    },

    setShowCreatePersonnelModal: (state, action: PayloadAction<boolean>) => {
      state.metadata.showPersonnelModal = action.payload;
    },

    // Form data setters
    setCreateBasicDetails: (
      state,
      action: PayloadAction<BasicDetailsFormValues>
    ) => {
      state.basicDetails = action.payload;
    },

    setCreateBulkDetails: (
      state,
      action: PayloadAction<BulkDetailsFormValues>
    ) => {
      state.bulkDetails = action.payload;
    },

    setCreateSpecifications: (
      state,
      action: PayloadAction<PropertySpecificationsFormValues>
    ) => {
      state.specifications = action.payload;
    },

    setCreateLandForm: (state, action: PayloadAction<LandFormValues>) => {
      state.landForm = action.payload;
    },

    setCreateLandSizeSections: (
      state,
      action: PayloadAction<LandSizeSection[]>
    ) => {
      state.LandSizeSection = action.payload;
    },

    setCreateFeatures: (state, action: PayloadAction<FeaturesFormValues>) => {
      state.features = action.payload;
    },

    setCreateMedia: (state, action: PayloadAction<MediaFormValues>) => {
      state.media = action.payload;
    },

    setCreateDiscount: (state, action: PayloadAction<DiscountFormValues>) => {
      state.discount = action.payload;
    },

    setCreatePaymentStructure: (
      state,
      action: PayloadAction<PaymentStructureFormValues>
    ) => {
      state.paymentStructure = action.payload;
    },

    // Individual field updates
    updateCreateBasicDetail: <K extends keyof BasicDetailsFormValues>(
      state: CreatePropertyFormData,
      action: PayloadAction<{ field: K; value: BasicDetailsFormValues[K] }>
    ) => {
      state.basicDetails[action.payload.field] = action.payload.value;
    },

    updateCreateSpecification: <
      K extends keyof PropertySpecificationsFormValues
    >(
      state: CreatePropertyFormData,
      action: PayloadAction<{
        field: K;
        value: PropertySpecificationsFormValues[K];
      }>
    ) => {
      state.specifications[action.payload.field] = action.payload.value;
    },

    updateCreateLandField: <K extends keyof LandFormValues>(
      state: CreatePropertyFormData,
      action: PayloadAction<{ field: K; value: LandFormValues[K] }>
    ) => {
      state.landForm[action.payload.field] = action.payload.value;
    },

    // Array helpers
    addCreateMediaImage: (state, action: PayloadAction<File | string>) => {
      state.media.images.push(action.payload);
    },

    removeCreateMediaImage: (state, action: PayloadAction<number>) => {
      state.media.images.splice(action.payload, 1);
    },

    addCreateFeature: (state, action: PayloadAction<string>) => {
      if (!state.features.features.includes(action.payload)) {
        state.features.features.push(action.payload);
      }
    },

    removeCreateFeature: (state, action: PayloadAction<string>) => {
      state.features.features = state.features.features.filter(
        (feature: string) => feature !== action.payload
      );
    },

    addCreatePaymentSchedule: (state, action: PayloadAction<string>) => {
      if (!state.paymentStructure.paymentSchedule.includes(action.payload)) {
        state.paymentStructure.paymentSchedule.push(action.payload);
      }
    },

    removeCreatePaymentSchedule: (state, action: PayloadAction<string>) => {
      state.paymentStructure.paymentSchedule =
        state.paymentStructure.paymentSchedule.filter(
          (schedule: string) => schedule !== action.payload
        );
    },
  },
});

export const {
  resetCreateForm,
  setCreateFormData,
  setCreateCurrentStep,
  setIsCreateLandProperty,
  setIsCreateLandProperty2,
  setIsCreateBulk,
  setIsCreateSubmitting,
  setCreateSales,
  setCreateDirectorName,
  setCreatePreviousPropType,
  setCreateFees,
  setCreateNewFees,
  setCreateImagePreview,
  setCreateDisplayStatus,
  setShowCreateBulkModal,
  setShowCreatePersonnelModal,
  setCreateBasicDetails,
  setCreateBulkDetails,
  setCreateSpecifications,
  setCreateLandForm,
  setCreateLandSizeSections,
  setCreateFeatures,
  setCreateMedia,
  setCreateDiscount,
  setCreatePaymentStructure,
  updateCreateBasicDetail,
  updateCreateSpecification,
  updateCreateLandField,
  addCreateMediaImage,
  removeCreateMediaImage,
  addCreateFeature,
  removeCreateFeature,
  addCreatePaymentSchedule,
  removeCreatePaymentSchedule,
} = createPropertySlice.actions;

export default createPropertySlice.reducer;
