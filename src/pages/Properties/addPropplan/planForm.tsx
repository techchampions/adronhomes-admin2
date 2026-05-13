import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
} from "react";
import InputField from "../../../components/input/inputtext";
import EnhancedOptionInputField from "../../../components/input/enhancedSelecet";
import { formatToNaira, validationSchema } from "./types";
import { getIn, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  clearPropertyCategories,
  fetchCittaPropertyCategories,
  selectAllPropertyCategories,
  selectPropertyCategoriesLoading
} from "../../../components/Redux/citta/fetchCittaPropertyCategories";
import {
  clearCittaEstates,
  fetchCittaEstates,
  selectAllCittaEstates,
  selectCittaEstatesLoading
} from "../../../components/Redux/citta/fetchCittaEstates";
import {
  clearPropertyMap,
  fetchCittaPropertyMap,
  selectFilteredPropertyMapItems,
  selectPropertyMapLoading
} from "../../../components/Redux/citta/fetchCittaPropertyMap";
import { RefreshCwIcon, AlertCircle } from "lucide-react";
import { selectSyncPropertyMapSuccess, selectSyncPropertyMapSyncing, syncPropertyMap } from "../../../components/Redux/citta/syncPropertyMap";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../components/Redux/hook";

// Duration interface
interface Duration {
  id: any;
  duration: any;
  price: any;
  citta_id: string;   
  property_code?: string;
  property_id?: number;
  pre_filled?: boolean;
}

export interface LandSizeSection {
  id: number;
  size: any;
  durations: Duration[];
  citta_category_id?: string;
  citta_estate_name?: string;
  citta_estate_code?: string;
  citta_property_category?: string;
}

interface PropertyListingPageProps {
  setLandSizeSections: (data: LandSizeSection[]) => void;
  initialData?: LandSizeSection[];
  isEditMode?: boolean;
}

interface PropertyListingFormValues {
  landSizeSections: LandSizeSection[];
}

export interface PropertyListingPageRef {
  handleSubmit: () => Promise<boolean>;
  isValid: boolean;
  values: LandSizeSection[];
}

const PropertyListingPage = forwardRef<
  PropertyListingPageRef,
  PropertyListingPageProps
>(({
  setLandSizeSections,
  initialData = [],
  isEditMode = false
}, ref) => {
  const dispatch = useAppDispatch();

  const [selectedEstate, setSelectedEstate] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [availableSizes, setAvailableSizes] = useState<any[]>([]);
  const [landSizeSections, setLocalLandSizeSections] = useState<LandSizeSection[]>(initialData);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isAutoPopulating, setIsAutoPopulating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redux selectors
  const categories = useSelector(selectAllPropertyCategories);
  const categoriesLoading = useSelector(selectPropertyCategoriesLoading);
  const estates = useSelector(selectAllCittaEstates);
  const estatesLoading = useSelector(selectCittaEstatesLoading);
  const propertyMapItems = useSelector(selectFilteredPropertyMapItems);
  const propertyMapLoading = useSelector(selectPropertyMapLoading);
  const syncSuccess = useSelector(selectSyncPropertyMapSuccess);
  const syncSyncing = useSelector(selectSyncPropertyMapSyncing);

  const refreshAllData = async () => {
    setIsRefreshing(true);
    dispatch(clearPropertyCategories());
    dispatch(clearCittaEstates());
    dispatch(clearPropertyMap());

    setSelectedEstate(null);
    setSelectedCategory(null);
    setLocalLandSizeSections([]);
    setAvailableSizes([]);

    await Promise.all([
      dispatch(fetchCittaPropertyCategories()).unwrap(),
      dispatch(fetchCittaEstates()).unwrap(),
    ]);

    setIsRefreshing(false);
  };

  const handleSyncPropertyMap = async () => {
    try {
      const result = await dispatch(syncPropertyMap()).unwrap();
      if (result.success) {
        await refreshAllData();
        toast.success("Property map synced and data refreshed successfully!");
      }
    } catch (error) {
      console.error("Failed to sync property map:", error);
      toast.error("Failed to sync property map. Please try again.");
    }
  };

  // Initial load
  useEffect(() => {
    refreshAllData();
  }, []);

  useEffect(() => {
    if (syncSuccess) refreshAllData();
  }, [syncSuccess]);

  // Load edit mode data
  useEffect(() => {
    if (initialData?.length > 0 && estates.length > 0 && categories.length > 0) {
      setLocalLandSizeSections(initialData);

      if (initialData[0]?.citta_estate_name) {
        const estate = estates.find(e => e.pName === initialData[0].citta_estate_name);
        if (estate) setSelectedEstate(estate);
      }
      if (initialData[0]?.citta_category_id) {
        const category = categories.find(c => String(c.pCode) === String(initialData[0].citta_category_id));
        if (category) setSelectedCategory(category);
      }
    }
  }, [initialData, estates, categories]);

  // Fetch Property Map when estate & category are selected
  useEffect(() => {
    if (selectedEstate?.pName && selectedCategory?.pName) {
      console.log('Fetching property map for:', {
        estate_name: selectedEstate.pName,
        category_name: selectedCategory.pName
      });

      dispatch(fetchCittaPropertyMap({
        estate_name: selectedEstate.pName,
        category_name: selectedCategory.pName,
      }));
    }
  }, [selectedEstate, selectedCategory, dispatch]);

  // Extract unique sizes
  useEffect(() => {
    if (propertyMapItems?.length > 0) {
      const uniqueSizes = [...new Map(propertyMapItems.map(item => [item.size, item])).values()];
      setAvailableSizes(uniqueSizes);
    } else {
      setAvailableSizes([]);
    }
  }, [propertyMapItems]);

  // Auto-populate
  useEffect(() => {
    if (propertyMapItems?.length > 0 && !isAutoPopulating && landSizeSections.length === 0 &&
        selectedEstate && selectedCategory && !isRefreshing) {
      autoPopulateFromPropertyMap();
    }
  }, [propertyMapItems, selectedEstate, selectedCategory, isRefreshing]);

  const autoPopulateFromPropertyMap = async () => {
    setIsAutoPopulating(true);

    const groupedBySize = propertyMapItems.reduce((acc, item) => {
      if (!acc[item.size]) acc[item.size] = [];
      acc[item.size].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    const newSections: LandSizeSection[] = [];

    for (const [size, items] of Object.entries(groupedBySize)) {
      const durations: Duration[] = items.map(item => ({
        id: Date.now() + Math.random(),
        duration: item.duration,
        price: item.trimmed_price?.toString() || "",
        citta_id: item.property_code || "",
        property_code: item.property_code || "",
        property_id: item.id,
        pre_filled: true
      }));

      newSections.push({
        id: Date.now() + Math.random(),
        size,
        durations,
        citta_category_id: String(selectedCategory?.pCode || ""),
        citta_estate_name: selectedEstate?.pName || "",
        citta_estate_code: selectedEstate?.pCode || "",
        citta_property_category: String(selectedCategory?.pCode || ""),
      });
    }

    setLocalLandSizeSections(newSections);
    setIsAutoPopulating(false);
  };

  const handleEstateChange = (value: string, estate: any) => {
    setSelectedEstate(estate);
    setLocalLandSizeSections([]);
  };

  const handleCategoryChange = (value: string, category: any) => {
    setSelectedCategory(category);
    setLocalLandSizeSections([]);
  };

  const estateOptions = estates.map(estate => ({
    value: estate.pCode,
    label: `${estate.pCode} - ${estate.pName}`,
    original: estate
  }));

  const categoryOptions = categories.map(category => ({
    value: String(category.pCode),
    label: `${category.pCode} - ${category.pName}`,
    original: category
  }));

  const sizeOptions = availableSizes.map(item => ({
    value: item.size,
    label: item.size,
    original: item
  }));

  const addLandSizeSection = () => {
    const newSection: LandSizeSection = {
      id: Date.now(),
      size: "",
      durations: [{
        id: Date.now() + 1,
        duration: "",
        price: "",
        citta_id: "",
        property_code: "",
        property_id: undefined
      }],
      citta_category_id: String(selectedCategory?.pCode || ""),
      citta_estate_name: selectedEstate?.pName || "",
      citta_estate_code: selectedEstate?.pCode || "",
      citta_property_category: String(selectedCategory?.pCode || ""),
    };
    setLocalLandSizeSections(prev => [...prev, newSection]);
  };

  const removeLandSizeSection = (sectionId: number) => {
    if (landSizeSections.length > 1) {
      setLocalLandSizeSections(prev => prev.filter(s => s.id !== sectionId));
    }
  };

  const addDurationToSection = (sectionId: number) => {
    setLocalLandSizeSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              durations: [
                ...section.durations,
                { id: Date.now(), duration: "", price: "", citta_id: "", property_code: "", property_id: undefined }
              ]
            }
          : section
      )
    );
  };

  const removeDurationFromSection = (sectionId: number, durationId: number) => {
    setLocalLandSizeSections(prev =>
      prev.map(section =>
        section.id === sectionId && section.durations.length > 1
          ? {
              ...section,
              durations: section.durations.filter(d => d.id !== durationId)
            }
          : section
      )
    );
  };

  const updateLandSize = (sectionId: number, value: string) => {
    const propertyItems = propertyMapItems.filter(item => item.size === value);

    setLocalLandSizeSections(prev =>
      prev.map(section => {
        if (section.id === sectionId) {
          const newDurations = propertyItems.map(item => ({
            id: Date.now() + Math.random(),
            duration: item.duration,
            price: item.trimmed_price?.toString() || "",
            citta_id: item.property_code || "",
            property_code: item.property_code || "",
            property_id: item.id,
            pre_filled: true
          }));

          return {
            ...section,
            size: value,
            durations: newDurations.length > 0 ? newDurations : section.durations
          };
        }
        return section;
      })
    );
  };

  const updateDuration = (
    sectionId: number,
    durationId: number,
    field: keyof Duration,
    value: string
  ) => {
    setLocalLandSizeSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              durations: section.durations.map(duration =>
                duration.id === durationId ? { ...duration, [field]: value } : duration
              )
            }
          : section
      )
    );
  };

  const formik = useFormik<PropertyListingFormValues>({
    initialValues: { landSizeSections },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      setLandSizeSections(values.landSizeSections);
    },
  });

  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      setSubmitAttempted(true);

      if (!selectedEstate) {
        toast.warning("Please select an estate");
        return false;
      }
      if (!selectedCategory) {
        toast.warning("Please select a property category");
        return false;
      }

      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        toast.error("Please fix the errors in the form");
        return false;
      } else {
        await formik.submitForm();
        toast.success("Land sizes saved successfully!");
        return true;
      }
    },
    isValid: formik.isValid,
    get values() {
      return formik.values.landSizeSections;
    },
  }));

  const getErrorMessage = (fieldPath: string): string | undefined =>
    submitAttempted ? getIn(formik.errors, fieldPath) : undefined;

  // Check if data is empty after fetching
  const isDataEmpty = propertyMapItems.length === 0 && 
                      !propertyMapLoading && 
                      selectedEstate && 
                      selectedCategory && 
                      !isAutoPopulating &&
                      !isRefreshing;

  // Show loading indicator while fetching
  const showLoadingIndicator = (propertyMapLoading || isAutoPopulating) && 
                               selectedEstate && 
                               selectedCategory;

  return (
    <div className="">
      <div className="mx-auto">
        <div className="flex justify-end mb-2 mt-[-10px]">
          <button
            type="button"
            onClick={handleSyncPropertyMap}
            disabled={isRefreshing || syncSyncing}
            className={`px-4 py-2 text-white text-sm font-medium rounded-[60px] transition-colors flex items-center gap-2 ${
              isRefreshing || syncSyncing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#57713A] hover:bg-[#57713A]/80'
            }`}
          >
            {(isRefreshing || syncSyncing) ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <RefreshCwIcon size={16} />
            )}
            <span>Refresh Citta Data</span>
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-8">
          {/* Estate & Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <EnhancedOptionInputField
              label="Select Estate *"
              placeholder="Choose an estate..."
              value={selectedEstate?.pCode || ""}
              onChange={(value: string) => {
                const estate = estates.find(e => e.pCode === value);
                handleEstateChange(value, estate);
              }}
              options={estateOptions}
              isSearchable
              isLoading={estatesLoading || isRefreshing}
            />

            <EnhancedOptionInputField
              label="Property Category *"
              placeholder="Choose a category..."
              value={selectedCategory?.pCode ? String(selectedCategory.pCode) : ""}
              onChange={(value: string) => {
                const category = categories.find(c => String(c.pCode) === value);
                handleCategoryChange(value, category);
              }}
              options={categoryOptions}
              isSearchable
              isLoading={categoriesLoading || isRefreshing}
            />
          </div>

          {/* Loading Indicator */}
          {showLoadingIndicator && (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border-2 border-gray-200">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#57713A] border-t-transparent mb-4"></div>
              <p className="text-gray-600 font-medium">Loading property data...</p>
              <p className="text-gray-400 text-sm mt-1">Fetching available land sizes and pricing</p>
            </div>
          )}

          {/* Empty Data Notification */}
          {isDataEmpty && !showLoadingIndicator && (
       <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border-2 border-slate-200">
  <AlertCircle className="h-12 w-12 text-slate-500 mb-4" />
  <h3 className="text-lg font-semibold text-slate-800 mb-2">No Data Available</h3>
  <p className="text-slate-600 text-center max-w-md mb-4">
    No property data found for {selectedEstate?.pName} - {selectedCategory?.pName}. 
    Please try refreshing the data or contact support.
  </p>
</div>
          )}

          {/* Land Sizes Section */}
          {!showLoadingIndicator && !isDataEmpty && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-base font-semibold text-gray-800">Land Sizes & Pricing</h2>
              </div>

              <div className="space-y-8">
                {landSizeSections.map((section, sectionIndex) => (
                  <div key={section.id} className="border border-gray-200 rounded-2xl p-6 relative bg-gray-50/50">
                    {landSizeSections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLandSizeSection(section.id)}
                        className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}

                    <div className="mb-6">
                      <EnhancedOptionInputField
                        label="Land Size *"
                        placeholder="Select land size..."
                        name={`landSizeSections[${sectionIndex}].size`}
                        value={section.size || ""}
                        onChange={(value: string) => updateLandSize(section.id, value)}
                        options={sizeOptions}
                        isSearchable
                        isLoading={propertyMapLoading}
                        error={getErrorMessage(`landSizeSections[${sectionIndex}].size`)}
                        disabled
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-md font-medium text-gray-700">Duration & Pricing</h3>
                      </div>

                      {section.durations.map((duration, durationIndex) => (
                        <div key={duration.id} className="flex gap-4 items-end p-4 bg-white border border-gray-200 rounded-xl">
                          <div className="flex-1">
                            <InputField
                              label="Duration (months)"
                              placeholder="Enter duration"
                              type="number"
                              value={duration.duration || ""}
                              onChange={(e) => updateDuration(section.id, duration.id, "duration", e.target.value)}
                              error={getErrorMessage(`landSizeSections[${sectionIndex}].durations[${durationIndex}].duration`)}
                              disabled
                            />
                          </div>

                          <div className="flex-1">
                            <InputField
                              disabled
                              label="Price (₦)"
                              placeholder="Enter price"
                              type="text"
                              value={formatToNaira(duration.price || "")}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/[^0-9]/g, "");
                                updateDuration(section.id, duration.id, "price", raw);
                              }}
                              error={getErrorMessage(`landSizeSections[${sectionIndex}].durations[${durationIndex}].price`)}
                            />
                          </div>

                          <div className="flex-1">
                            <label className="block text-sm mb-1">
                              Citta Property Code
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={duration.citta_id || ""}
                              className="w-full px-3 py-2 rounded-full bg-gray-100 cursor-not-allowed"
                            />
                          </div>

                          {section.durations.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => removeDurationFromSection(section.id, duration.id)}
                              className="h-10 px-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-[60px] flex items-center justify-center flex-shrink-0"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {landSizeSections.length === 0 && !isAutoPopulating && !isRefreshing && !propertyMapLoading && selectedEstate && selectedCategory && propertyMapItems.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">
                      Select an estate and category above to load available land sizes
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
});

PropertyListingPage.displayName = "PropertyListingPage";
export default PropertyListingPage;