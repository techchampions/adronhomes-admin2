import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import * as createActions from "../propertyForm/createPropertySlice";
import * as editActions from "../editProperty/editpropslice"
import * as draftActions from "../draftProperty/draftPropertySlice";
// Create Property Hook
export const useCreatePropertyForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const createProperty = useSelector((state: RootState) => state.createProperty);

  return {
    // State
    ...createProperty,
    
    // Actions
    resetCreateForm: () => dispatch(createActions.resetCreateForm()),
    setCreateFormData: (data: any) => dispatch(createActions.setCreateFormData(data)),
    setCreateCurrentStep: (step: number) => dispatch(createActions.setCreateCurrentStep(step)),
    setIsCreateLandProperty: (isLand: boolean) => dispatch(createActions.setIsCreateLandProperty(isLand)),
    setIsCreateLandProperty2: (isLand: boolean) => dispatch(createActions.setIsCreateLandProperty2(isLand)),
    setIsCreateBulk: (isBulk: boolean) => dispatch(createActions.setIsCreateBulk(isBulk)),
    setIsCreateSubmitting: (isSubmitting: boolean) => dispatch(createActions.setIsCreateSubmitting(isSubmitting)),
    setCreateSales: (sales: boolean) => dispatch(createActions.setCreateSales(sales)),
    setCreateDirectorName: (name: string) => dispatch(createActions.setCreateDirectorName(name)),
    setCreatePreviousPropType: (type: string) => dispatch(createActions.setCreatePreviousPropType(type)),
    setCreateFees: (fees: any[]) => dispatch(createActions.setCreateFees(fees)),
    setCreateNewFees: (fees: any[]) => dispatch(createActions.setCreateNewFees(fees)),
    setCreateImagePreview: (preview: string | null) => dispatch(createActions.setCreateImagePreview(preview)),
    setCreateDisplayStatus: (status: "draft" | "publish") => dispatch(createActions.setCreateDisplayStatus(status)),
    
    // Form setters
    setCreateBasicDetails: (data: any) => dispatch(createActions.setCreateBasicDetails(data)),
    setCreateBulkDetails: (data: any) => dispatch(createActions.setCreateBulkDetails(data)),
    setCreateSpecifications: (data: any) => dispatch(createActions.setCreateSpecifications(data)),
    setCreateLandForm: (data: any) => dispatch(createActions.setCreateLandForm(data)),
    setCreateLandSizeSections: (data: any[]) => dispatch(createActions.setCreateLandSizeSections(data)),
    setCreateFeatures: (data: any) => dispatch(createActions.setCreateFeatures(data)),
    setCreateMedia: (data: any) => dispatch(createActions.setCreateMedia(data)),
    setCreateDiscount: (data: any) => dispatch(createActions.setCreateDiscount(data)),
    setCreatePaymentStructure: (data: any) => dispatch(createActions.setCreatePaymentStructure(data)),
    
    // Computed values
    get isCreateLandProperty() {
      return createProperty.metadata.isLandProperty;
    },
    
    get isCreateLandProperty2() {
      return createProperty.metadata.isLandProperty2;
    },
    
    get isCreateBulk() {
      return createProperty.metadata.isBulk;
    },
    
    get createCurrentStep() {
      return createProperty.metadata.currentStep;
    },

  };
};

// Edit Property Hook
export const useEditPropertyForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const editProperty = useSelector((state: RootState) => state.editProperty);

  return {
    // State
    ...editProperty,
    
    // Actions
    resetEditForm: () => dispatch(editActions.resetEditForm()),
    setEditFormData: (data: any) => dispatch(editActions.setEditFormData(data)),
    loadEditPropertyData: (propertyData: any) => dispatch(editActions.loadEditPropertyData(propertyData)),
    setEditCurrentStep: (step: number) => dispatch(editActions.setEditCurrentStep(step)),
    setIsEditLandProperty: (isLand: boolean) => dispatch(editActions.setIsEditLandProperty(isLand)),
    setIsEditLandProperty2: (isLand: boolean) => dispatch(editActions.setIsEditLandProperty2(isLand)),
    setIsEditBulk: (isBulk: boolean) => dispatch(editActions.setIsEditBulk(isBulk)),
    setIsEditSubmitting: (isSubmitting: boolean) => dispatch(editActions.setIsEditSubmitting(isSubmitting)),
    setEditDirectorName: (name: string) => dispatch(editActions.setEditDirectorName(name)),
    setEditPreviousPropType: (type: string) => dispatch(editActions.setEditPreviousPropType(type)),
    setEditFees: (fees: any[]) => dispatch(editActions.setEditFees(fees)),
    setEditNewFees: (fees: any[]) => dispatch(editActions.setEditNewFees(fees)),
    setEditImagePreview: (preview: string | null) => dispatch(editActions.setEditImagePreview(preview)),
    setEditDisplayStatus: (status: "draft" | "publish") => dispatch(editActions.setEditDisplayStatus(status)),
    setEditIsLoaded: (isLoaded: boolean) => dispatch(editActions.setEditIsLoaded(isLoaded)),
    
    // Form setters
    setEditBasicDetails: (data: any) => dispatch(editActions.setEditBasicDetails(data)),
    setEditBulkDetails: (data: any) => dispatch(editActions.setEditBulkDetails(data)),
    setEditSpecifications: (data: any) => dispatch(editActions.setEditSpecifications(data)),
    setEditLandForm: (data: any) => dispatch(editActions.setEditLandForm(data)),
    setEditLandSizeSections: (data: any[]) => dispatch(editActions.setEditLandSizeSections(data)),
    setEditFeatures: (data: any) => dispatch(editActions.setEditFeatures(data)),
    setEditMedia: (data: any) => dispatch(editActions.setEditMedia(data)),
    setEditDiscount: (data: any) => dispatch(editActions.setEditDiscount(data)),
    setEditPaymentStructure: (data: any) => dispatch(editActions.setEditPaymentStructure(data)),
    
    // Computed values
    get isEditLandProperty() {
      return editProperty.metadata.isLandProperty;
    },
    
    get isEditLandProperty2() {
      return editProperty.metadata.isLandProperty2;
    },
    
    get isEditBulk() {
      return editProperty.metadata.isBulk;
    },
    
    get editCurrentStep() {
      return editProperty.metadata.currentStep;
    },
    
    get isEditFormLoaded() {
      return editProperty.metadata.isLoaded;
    },
    
    get editPropertyId() {
      return editProperty.metadata.propertyId;
    },
  };
};


export const useDraftPropertyForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const draftProperty = useSelector((state: RootState) => state.draftProperty);

  return {
    // State
    ...draftProperty,
    
    // Actions
    resetDraftForm: () => dispatch(draftActions.resetDraftForm()),
    setDraftFormData: (data: any) => dispatch(draftActions.setDraftFormData(data)),
    loadDraftPropertyData: (propertyData: any) => dispatch(draftActions.loadDraftPropertyData(propertyData)),
    setDraftCurrentStep: (step: number) => dispatch(draftActions.setDraftCurrentStep(step)),
    setIsDraftLandProperty: (isLand: boolean) => dispatch(draftActions.setIsDraftLandProperty(isLand)),
    setIsDraftLandProperty2: (isLand: boolean) => dispatch(draftActions.setIsDraftLandProperty2(isLand)),
    setIsDraftBulk: (isBulk: boolean) => dispatch(draftActions.setIsDraftBulk(isBulk)),
    setIsDraftSubmitting: (isSubmitting: boolean) => dispatch(draftActions.setIsDraftSubmitting(isSubmitting)),
    setDraftDirectorName: (name: string) => dispatch(draftActions.setDraftDirectorName(name)),
    setDraftPreviousPropType: (type: string) => dispatch(draftActions.setDraftPreviousPropType(type)),
    setDraftFees: (fees: any[]) => dispatch(draftActions.setDraftFees(fees)),
    setDraftNewFees: (fees: any[]) => dispatch(draftActions.setDraftNewFees(fees)),
    setDraftImagePreview: (preview: string | null) => dispatch(draftActions.setDraftImagePreview(preview)),
    setDraftDisplayStatus: (status: "draft" | "publish") => dispatch(draftActions.setDraftDisplayStatus(status)),
    setDraftIsLoaded: (isLoaded: boolean) => dispatch(draftActions.setDraftIsLoaded(isLoaded)),
    
    // Form setters
    setDraftBasicDetails: (data: any) => dispatch(draftActions.setDraftBasicDetails(data)),
    setDraftBulkDetails: (data: any) => dispatch(draftActions.setDraftBulkDetails(data)),
    setDraftSpecifications: (data: any) => dispatch(draftActions.setDraftSpecifications(data)),
    setDraftLandForm: (data: any) => dispatch(draftActions.setDraftLandForm(data)),
    setDraftLandSizeSections: (data: any[]) => dispatch(draftActions.setDraftLandSizeSections(data)),
    setDraftFeatures: (data: any) => dispatch(draftActions.setDraftFeatures(data)),
    setDraftMedia: (data: any) => dispatch(draftActions.setDraftMedia(data)),
    setDraftDiscount: (data: any) => dispatch(draftActions.setDraftDiscount(data)),
    setDraftPaymentStructure: (data: any) => dispatch(draftActions.setDraftPaymentStructure(data)),
    
    // Computed values
    get isDraftLandProperty() {
      return draftProperty.metadata.isLandProperty;
    },
    
    get isDraftLandProperty2() {
      return draftProperty.metadata.isLandProperty2;
    },
    
    get isDraftBulk() {
      return draftProperty.metadata.isBulk;
    },
    
    get draftCurrentStep() {
      return draftProperty.metadata.currentStep;
    },
    
    get isDraftFormLoaded() {
      return draftProperty.metadata.isLoaded;
    },
    
    get draftPropertyId() {
      return draftProperty.metadata.propertyId;
    },
  };
};