// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// // Import the interfaces from your context
// import { 
//   BasicDetailsFormValues, 
//   BulkDetailsFormValues,
//   PropertySpecificationsFormValues,
//   LandFormValues,
//   FeaturesFormValues,
//   MediaFormValues,
//   DiscountFormValues,
//   PaymentStructureFormValues,
//   LandSizeSection
// } from "../../../MyContext/MyContext";

// interface EditPropertyFormData {
//   basicDetails: BasicDetailsFormValues;
//   bulkDetails: BulkDetailsFormValues;
//   specifications: PropertySpecificationsFormValues;
//   landForm: LandFormValues;
//   features: FeaturesFormValues;
//   media: MediaFormValues;
//   discount: DiscountFormValues;
//   paymentStructure: PaymentStructureFormValues;
//   LandSizeSection: LandSizeSection[];
//   display: {
//     status: "draft" | "publish";
//   };
//   metadata: {
//     propertyId: string | null;
//     isLandProperty: boolean;
//     isBulk: boolean;
//     isLoaded: boolean;
//     originalPropertyType: string;
//     directorName: string;
//   };
// }

// const initialBasicDetails: BasicDetailsFormValues = {
//   propertyName: "",
//   propertyType: "",
//   price: "",
//   initialDeposit: "",
//   address: "",
//   locationType: "",
//   purpose: [],
//   country: "",
//   state: "",
//   lga: "",
//   category: "",
//   category_id: null,
//   propertyFiles: [],
// };

// const initialBulkDetails: BulkDetailsFormValues = {
//   propertyName: "",
//   propertyType: "",
//   propertyUnits: "1",
//   price: "",
//   address: "",
//   city: "",
//   state: "",
//   initialDeposit: "",
//   country: "",
//   lga: "",
// };

// const initialSpecifications: PropertySpecificationsFormValues = {
//   director_id: "",
//   bedrooms: "",
//   bathrooms: "",
//   propertySize: "",
//   landSize: "",
//   parkingSpaces: "",
//   yearBuilt: "",
//   unitsAvailable: "",
//   description: "",
//   overview: "",
//   documents: "",
//   nearbyLandmarks: [],
//   rentDuration: "",
//   buildingCondition: "",
//   whatsAppLink: "",
//   contactNumber: "",
//   toilets: "",
//   titleDocumentTypeProp: [],
// };

// const initialLandForm: LandFormValues = {
//   director_id: "",
//   plotShape: "",
//   topography: "",
//   propertySize: "",
//   landSize: "",
//   roadAccess: [],
//   titleDocumentType: [],
//   unitsAvailable: "",
//   description: "",
//   overview: "",
//   documents: "",
//   fencing: "",
//   gatedEstate: "",
//   contactNumber: "",
//   whatsAppLink: "",
//   nearbyLandmarks: [],
// };

// const initialState: EditPropertyFormData = {
//   basicDetails: initialBasicDetails,
//   bulkDetails: initialBulkDetails,
//   specifications: initialSpecifications,
//   landForm: initialLandForm,
//   features: {
//     features: [],
//   },
//   media: {
//     mapUrl: "",
//     tourLink: "",
//     videoLink: "",
//     images: [],
//   },
//   discount: {
//     discountName: "",
//     discountType: "",
//     discountOff: "",
//     unitsRequired: "",
//     validFrom: "",
//     validTo: "",
//   },
//   paymentStructure: {
//     paymentType: "",
//     paymentDuration: "",
//     paymentSchedule: [],
//     feesCharges: "",
//   },
//   LandSizeSection: [],
//   display: {
//     status: "draft",
//   },
//   metadata: {
//     propertyId: null,
//     isLandProperty: false,
//     isBulk: false,
//     isLoaded: false,
//     originalPropertyType: "",
//     directorName: "",
//   },
// };

// const editPropertySlice = createSlice({
//   name: "editProperty",
//   initialState,
//   reducers: {
//     // Set entire form data (for initial loading)
//     setEditFormData: (state, action: PayloadAction<Partial<EditPropertyFormData>>) => {
//       return { ...state, ...action.payload };
//     },
    
//     // Reset form data
//     resetEditFormData: () => initialState,
    
//     // Set metadata
//     setEditMetadata: (state, action: PayloadAction<Partial<EditPropertyFormData['metadata']>>) => {
//       state.metadata = { ...state.metadata, ...action.payload };
//     },
    
//     // Individual form section setters
//     setEditBasicDetails: (state, action: PayloadAction<BasicDetailsFormValues>) => {
//       state.basicDetails = action.payload;
//     },
    
//     setEditBulkDetails: (state, action: PayloadAction<BulkDetailsFormValues>) => {
//       state.bulkDetails = action.payload;
//     },
    
//     setEditSpecifications: (state, action: PayloadAction<PropertySpecificationsFormValues>) => {
//       state.specifications = action.payload;
//     },
    
//     setEditLandForm: (state, action: PayloadAction<LandFormValues>) => {
//       state.landForm = action.payload;
//     },
    
//     setEditLandSizeSections: (state, action: PayloadAction<LandSizeSection[]>) => {
//       state.LandSizeSection = action.payload;
//     },
    
//     setEditFeatures: (state, action: PayloadAction<FeaturesFormValues>) => {
//       state.features = action.payload;
//     },
    
//     setEditMedia: (state, action: PayloadAction<MediaFormValues>) => {
//       state.media = action.payload;
//     },
    
//     setEditDiscount: (state, action: PayloadAction<DiscountFormValues>) => {
//       state.discount = action.payload;
//     },
    
//     setEditPaymentStructure: (state, action: PayloadAction<PaymentStructureFormValues>) => {
//       state.paymentStructure = action.payload;
//     },
    
//     setEditDisplayStatus: (state, action: PayloadAction<"draft" | "publish">) => {
//       state.display.status = action.payload;
//     },
    
//     // Individual field setters for finer control
//     updateEditBasicDetail: <K extends keyof BasicDetailsFormValues>(
//       state: EditPropertyFormData,
//       action: PayloadAction<{ field: K; value: BasicDetailsFormValues[K] }>
//     ) => {
//       state.basicDetails[action.payload.field] = action.payload.value;
//     },
    
//     updateEditSpecification: <K extends keyof PropertySpecificationsFormValues>(
//       state: EditPropertyFormData,
//       action: PayloadAction<{ field: K; value: PropertySpecificationsFormValues[K] }>
//     ) => {
//       state.specifications[action.payload.field] = action.payload.value;
//     },
    
//     updateEditLandField: <K extends keyof LandFormValues>(
//       state: EditPropertyFormData,
//       action: PayloadAction<{ field: K; value: LandFormValues[K] }>
//     ) => {
//       state.landForm[action.payload.field] = action.payload.value;
//     },
    
//     // Array field helpers
//     addEditMediaImage: (state, action: PayloadAction<File | string>) => {
//       state.media.images.push(action.payload);
//     },
    
//     removeEditMediaImage: (state, action: PayloadAction<number>) => {
//       state.media.images.splice(action.payload, 1);
//     },
    
//     addEditFeature: (state, action: PayloadAction<string>) => {
//       if (!state.features.features.includes(action.payload)) {
//         state.features.features.push(action.payload);
//       }
//     },
    
//     removeEditFeature: (state, action: PayloadAction<string>) => {
//       state.features.features = state.features.features.filter(
//         feature => feature !== action.payload
//       );
//     },
    
//     // Fee management (you might want to add fees to your interface)
//     setEditFees: (state, action: PayloadAction<any[]>) => {
//       // Assuming you add fees to your EditPropertyFormData interface
//       // state.fees = action.payload;
//     },
    
//     // Set property type flags
//     setIsEditLandProperty: (state, action: PayloadAction<boolean>) => {
//       state.metadata.isLandProperty = action.payload;
//     },
    
//     setIsEditBulk: (state, action: PayloadAction<boolean>) => {
//       state.metadata.isBulk = action.payload;
//     },
    
//     // Mark form as loaded
//     setEditFormLoaded: (state, action: PayloadAction<boolean>) => {
//       state.metadata.isLoaded = action.payload;
//     },
//   },
// });

// export const {
//   setEditFormData,
//   resetEditFormData,
//   setEditMetadata,
//   setEditBasicDetails,
//   setEditBulkDetails,
//   setEditSpecifications,
//   setEditLandForm,
//   setEditLandSizeSections,
//   setEditFeatures,
//   setEditMedia,
//   setEditDiscount,
//   setEditPaymentStructure,
//   setEditDisplayStatus,
//   updateEditBasicDetail,
//   updateEditSpecification,
//   updateEditLandField,
//   addEditMediaImage,
//   removeEditMediaImage,
//   addEditFeature,
//   removeEditFeature,
//   setEditFees,
//   setIsEditLandProperty,
//   setIsEditBulk,
//   setEditFormLoaded,
// } = editPropertySlice.actions;

// export default editPropertySlice.reducer;