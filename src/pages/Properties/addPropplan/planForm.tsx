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
  selectPropertyCategoriesLoading,
} from "../../../components/Redux/citta/fetchCittaPropertyCategories";
import {
  clearCittaEstates,
  fetchCittaEstates,
  selectAllCittaEstates,
  selectCittaEstatesLoading,
} from "../../../components/Redux/citta/fetchCittaEstates";
import {
  clearPropertyMap,
  fetchCittaPropertyMap,
  selectFilteredPropertyMapItems,
  selectPropertyMapLoading,
} from "../../../components/Redux/citta/fetchCittaPropertyMap";
import {
  fetchPromoCodes,
  selectAllPromoCodes,
  selectPromoCodesLoading,
  selectFilteredPromoCodes,
  clearPromoCodes,
} from "../../../components/Redux/gift/promo/PromoCodelist";
import {
  fetchTerminationCodes,
  selectAllTerminationCodes,
  selectTerminationCodesLoading,
  selectFilteredTerminationCodes,
  clearTerminationCodes,
} from "../../../components/Redux/gift/promo/fetchTerminationCodes";
import {
  RefreshCwIcon,
  AlertCircle,
  TagIcon,
  AlertTriangleIcon,
} from "lucide-react";
import {
  selectSyncPropertyMapSuccess,
  selectSyncPropertyMapSyncing,
  syncPropertyMap,
} from "../../../components/Redux/citta/syncPropertyMap";
import {
  fetchCittaContractTypes,
  selectAllCittaContractTypes,
  selectCittaContractTypesLoading,
  selectCittaContractTypesDropdownOptions,
  clearCittaContractTypes,
} from "../../../components/Redux/citta/CittaContractType";
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
  appliedPromoCode?: string;
  discountedPrice?: number;
  appliedTerminationCode?: string;
  terminationDiscountedPrice?: number;
}

export interface LandSizeSection {
  id: number;
  size: any;
  durations: Duration[];
  citta_category_id?: string;
  citta_estate_name?: string;
  citta_estate_code?: string;
  citta_property_category?: string;
  citta_promo_code?: string;
  citta_promo_name?: string;
  citta_termination_code?: string;
  citta_termination_name?: string;
  citta_contract_type?: string; // Added contract type field
  citta_contract_type_name?: string; // Added contract type name
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

// Helper functions
const extractDiscountFromPromo = (pName: string): number | null => {
  const match = pName.match(/(\d+(?:\.\d+)?)%/);
  if (match) return parseFloat(match[1]);
  return null;
};

const extractDiscountFromTermination = (pName: string): number | null => {
  // Termination codes might have different format, e.g., "30.00" meaning 30% off
  const match = pName.match(/(\d+(?:\.\d+)?)/);
  if (match) return parseFloat(match[1]);
  return null;
};

const calculateDiscountedPrice = (
  originalPrice: number,
  discountPercent: number | null,
): number => {
  if (!discountPercent) return originalPrice;
  return originalPrice * (1 - discountPercent / 100);
};

const PropertyListingPage = forwardRef<
  PropertyListingPageRef,
  PropertyListingPageProps
>(({ setLandSizeSections, initialData = [], isEditMode = false }, ref) => {
  const dispatch = useAppDispatch();

  const [selectedEstate, setSelectedEstate] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  // Removed standalone selectedContractType - now each section has its own
  const [availableSizes, setAvailableSizes] = useState<any[]>([]);
  const [landSizeSections, setLocalLandSizeSections] =
    useState<LandSizeSection[]>(initialData);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isAutoPopulating, setIsAutoPopulating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState<any>(null);
  const [selectedTerminationCode, setSelectedTerminationCode] =
    useState<any>(null);

  // Redux selectors
  const categories = useSelector(selectAllPropertyCategories);
  const categoriesLoading = useSelector(selectPropertyCategoriesLoading);
  const estates = useSelector(selectAllCittaEstates);
  const estatesLoading = useSelector(selectCittaEstatesLoading);
  const contractTypes = useSelector(selectAllCittaContractTypes);
  const contractTypesLoading = useSelector(selectCittaContractTypesLoading);
  const contractTypesDropdownOptions = useSelector(
    selectCittaContractTypesDropdownOptions,
  );
  const propertyMapItems = useSelector(selectFilteredPropertyMapItems);
  const propertyMapLoading = useSelector(selectPropertyMapLoading);
  const syncSuccess = useSelector(selectSyncPropertyMapSuccess);
  const syncSyncing = useSelector(selectSyncPropertyMapSyncing);

  const allPromoCodes = useSelector(selectAllPromoCodes);
  const promoCodesLoading = useSelector(selectPromoCodesLoading);
  const filteredPromoCodes = useSelector(selectFilteredPromoCodes);

  const allTerminationCodes = useSelector(selectAllTerminationCodes);
  const terminationCodesLoading = useSelector(selectTerminationCodesLoading);
  const filteredTerminationCodes = useSelector(selectFilteredTerminationCodes);

  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = async () => {
    setIsRefreshing(true);

    dispatch(clearPropertyCategories());
    dispatch(clearCittaEstates());
    dispatch(clearPropertyMap());
    dispatch(clearPromoCodes());
    dispatch(clearTerminationCodes());
    dispatch(clearCittaContractTypes());

    setSelectedEstate(null);
    setSelectedCategory(null);
    setSelectedContractType(null); // Reset contract type
    setLocalLandSizeSections([]);
    setAvailableSizes([]);
    setSelectedPromoCode(null);
    setSelectedTerminationCode(null);

    await Promise.all([
      dispatch(fetchCittaPropertyCategories()).unwrap(),
      dispatch(fetchCittaEstates()).unwrap(),
      dispatch(fetchCittaContractTypes()).unwrap(), // Fetch contract types independently
      dispatch(fetchPromoCodes()).unwrap(),
      dispatch(fetchTerminationCodes()).unwrap(),
    ]);

    setIsRefreshing(false);
  };

  // Load Edit Mode Data
  useEffect(() => {
    if (
      initialData?.length > 0 &&
      estates.length > 0 &&
      categories.length > 0 &&
      contractTypes.length > 0
    ) {
      setLocalLandSizeSections(initialData);

      if (initialData[0]?.citta_estate_code) {
        const estate = estates.find(
          (e) => e.EstateCode === initialData[0].citta_estate_code,
        );
        if (estate) setSelectedEstate(estate);
      }

      if (initialData[0]?.citta_property_category) {
        const category = categories.find(
          (c) => c.pName === initialData[0].citta_property_category,
        );
        if (category) setSelectedCategory(category);
      }

      // Load saved contract type
      if (initialData[0]?.citta_contract_type) {
        const contractType = contractTypes.find(
          (c) => c.code === initialData[0].citta_contract_type,
        );
        if (contractType) setSelectedContractType(contractType);
      }

      if (initialData[0]?.citta_promo_code) {
        const promo = allPromoCodes.find(
          (p) => p.pCode === initialData[0].citta_promo_code,
        );
        if (promo) setSelectedPromoCode(promo);
      }

      if (initialData[0]?.citta_termination_code) {
        const termination = allTerminationCodes.find(
          (t) => t.pCode === initialData[0].citta_termination_code,
        );
        if (termination) setSelectedTerminationCode(termination);
      }
    }
  }, [
    initialData,
    estates,
    categories,
    contractTypes,
    allPromoCodes,
    allTerminationCodes,
  ]);

  // Fetch Property Map
  useEffect(() => {
    if (selectedEstate?.EstateCode && selectedCategory?.pCode) {
      dispatch(
        fetchCittaPropertyMap({
          estate_code: selectedEstate.EstateCode,
          category_code: selectedCategory.pCode,
          // contract_type is NOT passed to API since it's standalone
        }),
      );
    }
  }, [selectedEstate, selectedCategory, dispatch]);

  // Extract unique sizes
  useEffect(() => {
    if (propertyMapItems?.length > 0) {
      const uniqueSizes = [
        ...new Map(propertyMapItems.map((item) => [item.size, item])).values(),
      ];
      setAvailableSizes(uniqueSizes);
    } else {
      setAvailableSizes([]);
    }
  }, [propertyMapItems]);

  // Auto-populate when data is available
  useEffect(() => {
    if (
      propertyMapItems?.length > 0 &&
      !isAutoPopulating &&
      landSizeSections.length === 0 &&
      selectedEstate &&
      selectedCategory &&
      !isRefreshing
    ) {
      autoPopulateFromPropertyMap();
    }
  }, [propertyMapItems, selectedEstate, selectedCategory, isRefreshing]);

  const applyDiscountsToDurations = (
    sections: LandSizeSection[],
    promoCode: any,
    terminationCode: any,
  ): LandSizeSection[] => {
    const promoDiscount = extractDiscountFromPromo(promoCode?.pName || "");
    const terminationDiscount = extractDiscountFromTermination(
      terminationCode?.pName || "",
    );

    return sections.map((section) => ({
      ...section,
      citta_promo_code: promoCode?.pCode || undefined,
      citta_promo_name: promoCode?.pName || "",
      citta_termination_code: terminationCode?.pCode || undefined,
      citta_termination_name: terminationCode?.pName || "",
      durations: section.durations.map((duration) => {
        const originalPrice = parseFloat(duration.price);
        let finalPrice = originalPrice;

        // Apply termination discount first (if any)
        if (terminationDiscount) {
          finalPrice = calculateDiscountedPrice(
            finalPrice,
            terminationDiscount,
          );
        }

        // Then apply promo discount on top (if any)
        if (promoDiscount) {
          finalPrice = calculateDiscountedPrice(finalPrice, promoDiscount);
        }

        return {
          ...duration,
          discountedPrice:
            promoDiscount || terminationDiscount ? finalPrice : undefined,
          appliedPromoCode: promoCode?.pCode,
          appliedTerminationCode: terminationCode?.pCode,
          terminationDiscountedPrice: terminationDiscount
            ? finalPrice
            : undefined,
        };
      }),
    }));
  };

  const autoPopulateFromPropertyMap = () => {
    setIsAutoPopulating(true);

    const groupedBySize = propertyMapItems.reduce((acc: any, item: any) => {
      if (!acc[item.size]) acc[item.size] = [];
      acc[item.size].push(item);
      return acc;
    }, {});

    const newSections: LandSizeSection[] = Object.entries(groupedBySize).map(
      ([size, items]: any) => {
        const durations: Duration[] = items.map((item: any) => {
          const originalPrice = parseFloat(item.trimmed_price);
          let finalPrice = originalPrice;

          const promoDiscount = extractDiscountFromPromo(
            selectedPromoCode?.pName || "",
          );
          const terminationDiscount = extractDiscountFromTermination(
            selectedTerminationCode?.pName || "",
          );

          if (terminationDiscount) {
            finalPrice = calculateDiscountedPrice(
              finalPrice,
              terminationDiscount,
            );
          }
          if (promoDiscount) {
            finalPrice = calculateDiscountedPrice(finalPrice, promoDiscount);
          }

          return {
            id: Date.now() + Math.random(),
            duration: item.duration,
            price: item.trimmed_price?.toString() || "",
            citta_id: item.property_code || "",
            property_code: item.property_code || "",
            property_id: item.id,
            pre_filled: true,
            discountedPrice:
              promoDiscount || terminationDiscount ? finalPrice : undefined,
            appliedPromoCode: selectedPromoCode?.pCode,
            appliedTerminationCode: selectedTerminationCode?.pCode,
            terminationDiscountedPrice: terminationDiscount
              ? finalPrice
              : undefined,
          };
        });

        return {
          id: Date.now() + Math.random(),
          size,
          durations,
          citta_category_id: String(selectedCategory?.pCode || ""),
          citta_estate_name: selectedEstate?.EstateName || "",
          citta_estate_code: selectedEstate?.EstateCode || "",
          citta_property_category: selectedCategory?.pName || "",
          citta_promo_code: selectedPromoCode?.pCode || undefined,
          citta_promo_name: selectedPromoCode?.pName || "",
          citta_termination_code: selectedTerminationCode?.pCode || undefined,
          citta_termination_name: selectedTerminationCode?.pName || "",
          // No default contract type - each section will have its own selection
          citta_contract_type: "",
          citta_contract_type_name: "",
        };
      },
    );

    setLocalLandSizeSections(newSections);
    setIsAutoPopulating(false);
  };

  const applyPromoCodeToAllSections = (promoCode: any) => {
    const updatedSections = applyDiscountsToDurations(
      landSizeSections,
      promoCode,
      selectedTerminationCode,
    );
    setLocalLandSizeSections(updatedSections);
  };

  const applyTerminationCodeToAllSections = (terminationCode: any) => {
    const updatedSections = applyDiscountsToDurations(
      landSizeSections,
      selectedPromoCode,
      terminationCode,
    );
    setLocalLandSizeSections(updatedSections);
  };

  const handleEstateChange = (value: string) => {
    const estate = estates.find((e) => e.EstateCode === value);
    setSelectedEstate(estate);
    setSelectedCategory(null);
    setSelectedPromoCode(null);
    setSelectedTerminationCode(null);
    // Don't reset contract type - it's standalone
    setLocalLandSizeSections([]);
    setAvailableSizes([]);
    dispatch(clearPropertyMap());
  };

  const handleCategoryChange = (value: string) => {
    const category = categories.find((c) => String(c.pCode) === value);
    setSelectedCategory(category);
    setSelectedPromoCode(null);
    setSelectedTerminationCode(null);
    // Don't reset contract type - it's standalone
    setLocalLandSizeSections([]);
    setAvailableSizes([]);
    dispatch(clearPropertyMap());
  };

  // New function to handle contract type change for a specific section
  const handleSectionContractTypeChange = (
    sectionId: number,
    contractTypeCode: string,
  ) => {
    const contractType = contractTypes.find((c) => c.code === contractTypeCode);

    setLocalLandSizeSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              citta_contract_type: contractType?.code || "",
              citta_contract_type_name: contractType?.name || "",
            }
          : section,
      ),
    );
  };

  const addLandSizeSection = () => {
    const newSection: LandSizeSection = {
      id: Date.now(),
      size: "",
      durations: [
        {
          id: Date.now() + 1,
          duration: "",
          price: "",
          citta_id: "",
          property_code: "",
          property_id: undefined,
        },
      ],
      citta_category_id: String(selectedCategory?.pCode || ""),
      citta_estate_name: selectedEstate?.EstateName || "",
      citta_estate_code: selectedEstate?.EstateCode || "",
      citta_property_category: selectedCategory?.pName || "",
      citta_promo_code: selectedPromoCode?.pCode || undefined,
      citta_promo_name: selectedPromoCode?.pName || "",
      citta_termination_code: selectedTerminationCode?.pCode || undefined,
      citta_termination_name: selectedTerminationCode?.pName || "",
      // No default contract type - user will select per section
      citta_contract_type: "",
      citta_contract_type_name: "",
    };
    setLocalLandSizeSections((prev) => [...prev, newSection]);
  };

  const removeLandSizeSection = (sectionId: number) => {
    if (landSizeSections.length > 1) {
      setLocalLandSizeSections((prev) =>
        prev.filter((s) => s.id !== sectionId),
      );
    }
  };

  const addDurationToSection = (sectionId: number) => {
    setLocalLandSizeSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              durations: [
                ...section.durations,
                {
                  id: Date.now(),
                  duration: "",
                  price: "",
                  citta_id: "",
                  property_code: "",
                  property_id: undefined,
                },
              ],
            }
          : section,
      ),
    );
  };

  const removeDurationFromSection = (sectionId: number, durationId: number) => {
    setLocalLandSizeSections((prev) =>
      prev.map((section) =>
        section.id === sectionId && section.durations.length > 1
          ? {
              ...section,
              durations: section.durations.filter((d) => d.id !== durationId),
            }
          : section,
      ),
    );
  };

  const updateLandSize = (sectionId: number, value: string) => {
    const propertyItems = propertyMapItems.filter(
      (item) => item.size === value,
    );
    const promoDiscount = extractDiscountFromPromo(
      selectedPromoCode?.pName || "",
    );
    const terminationDiscount = extractDiscountFromTermination(
      selectedTerminationCode?.pName || "",
    );

    setLocalLandSizeSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const newDurations = propertyItems.map((item) => {
            const originalPrice = item.trimmed_price;
            let finalPrice = originalPrice;

            if (terminationDiscount) {
              finalPrice = calculateDiscountedPrice(
                finalPrice,
                terminationDiscount,
              );
            }
            if (promoDiscount) {
              finalPrice = calculateDiscountedPrice(finalPrice, promoDiscount);
            }

            return {
              id: Date.now() + Math.random(),
              duration: item.duration,
              price: item.trimmed_price?.toString() || "",
              citta_id: item.property_code || "",
              property_code: item.property_code || "",
              property_id: item.id,
              pre_filled: true,
              discountedPrice:
                promoDiscount || terminationDiscount ? finalPrice : undefined,
              appliedPromoCode: selectedPromoCode?.pCode,
              appliedTerminationCode: selectedTerminationCode?.pCode,
              terminationDiscountedPrice: terminationDiscount
                ? finalPrice
                : undefined,
            };
          });

          return {
            ...section,
            size: value,
            durations:
              newDurations.length > 0 ? newDurations : section.durations,
          };
        }
        return section;
      }),
    );
  };

  const updateDuration = (
    sectionId: number,
    durationId: number,
    field: keyof Duration,
    value: string,
  ) => {
    setLocalLandSizeSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              durations: section.durations.map((duration) =>
                duration.id === durationId
                  ? { ...duration, [field]: value }
                  : duration,
              ),
            }
          : section,
      ),
    );
  };

  // Formik setup with proper synchronization
  const formik = useFormik<PropertyListingFormValues>({
    initialValues: { landSizeSections },
    validationSchema,
    enableReinitialize: false,
    onSubmit: (values) => {
      setLandSizeSections(values.landSizeSections);
    },
  });

  // Keep formik values in sync with local state
  useEffect(() => {
    const currentFormikValues = formik.values.landSizeSections;
    if (
      JSON.stringify(currentFormikValues) !== JSON.stringify(landSizeSections)
    ) {
      formik.setValues({ landSizeSections });
    }
  }, [landSizeSections, formik]);

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
      // Contract type is optional - don't require it
      // if (!selectedContractType) {
      //   toast.warning("Please select a contract type");
      //   return false;
      // }

      // Ensure formik has the latest values before validation
      await formik.setValues({ landSizeSections });

      // Validate form
      const errors = await formik.validateForm();

      if (Object.keys(errors).length > 0) {
        // Log errors for debugging
        console.log("Validation errors:", errors);

        // Show specific error message
        const errorMessages: string[] = [];
        if (errors.landSizeSections) {
          if (Array.isArray(errors.landSizeSections)) {
            errors.landSizeSections.forEach(
              (sectionError: any, index: number) => {
                if (sectionError?.size)
                  errorMessages.push(
                    `Section ${index + 1}: ${sectionError.size}`,
                  );
                if (sectionError?.durations) {
                  if (Array.isArray(sectionError.durations)) {
                    sectionError.durations.forEach(
                      (durationError: any, durIndex: number) => {
                        if (durationError?.duration)
                          errorMessages.push(
                            `Section ${index + 1}, Duration ${durIndex + 1}: ${durationError.duration}`,
                          );
                        if (durationError?.price)
                          errorMessages.push(
                            `Section ${index + 1}, Duration ${durIndex + 1}: ${durationError.price}`,
                          );
                      },
                    );
                  }
                }
              },
            );
          }
        }

        if (errorMessages.length > 0) {
          toast.error(`Please fix: ${errorMessages.join(", ")}`);
        } else {
          toast.error("Please fix the errors in the form");
        }
        return false;
      }

      await formik.submitForm();
      toast.success("Land sizes saved successfully!");
      return true;
    },
    isValid: formik.isValid,
    get values() {
      return landSizeSections;
    },
  }));

  const getErrorMessage = (fieldPath: string): string | undefined =>
    submitAttempted ? getIn(formik.errors, fieldPath) : undefined;

  const isDataEmpty =
    propertyMapItems.length === 0 &&
    !propertyMapLoading &&
    selectedEstate &&
    selectedCategory &&
    !isAutoPopulating &&
    !isRefreshing;

  const showLoadingIndicator =
    (propertyMapLoading || isAutoPopulating) &&
    selectedEstate &&
    selectedCategory;

  return (
    <div>
      <div className="mx-auto">
        <div className="flex justify-between mb-4">
          <p className="text-base font-semibold text-gray-800">
            Link Property to Citta
          </p>
          <button
            type="button"
            onClick={refreshAllData}
            disabled={isRefreshing || syncSyncing}
            className={`px-4 py-2 text-white text-sm font-medium rounded-[60px] transition-colors flex items-center gap-2 ${
              isRefreshing || syncSyncing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#57713A] hover:bg-[#57713A]/80"
            }`}
          >
            {isRefreshing || syncSyncing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <RefreshCwIcon size={16} />
            )}
            <span>Refresh Citta Data</span>
          </button>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Estate & Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border border-gray-200">
          <EnhancedOptionInputField
            label="Select Citta Estate *"
            placeholder="Choose an estate..."
            value={selectedEstate?.EstateCode || ""}
            onChange={handleEstateChange}
            options={estates.map((estate) => ({
              value: estate.EstateCode,
              label: `${estate.EstateCode} - ${estate.EstateName}`,
              original: estate,
            }))}
            isSearchable
            isLoading={estatesLoading || isRefreshing}
          />

          <EnhancedOptionInputField
            label="Select Citta Property Category *"
            placeholder="Choose a category..."
            value={
              selectedCategory?.pCode ? String(selectedCategory.pCode) : ""
            }
            onChange={handleCategoryChange}
            options={categories.map((category) => ({
              value: String(category.pCode),
              label: `${category.pCode} - ${category.pName}`,
              original: category,
            }))}
            isSearchable
            isLoading={categoriesLoading || isRefreshing}
          />
        </div>

        {/* Standalone Contract Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-6 rounded-2xl border border-gray-200">
          <EnhancedOptionInputField
            label="Select Contract Type (Optional)"
            placeholder="Choose a contract type..."
            value={selectedContractType?.code || ""}
            onChange={handleContractTypeChange}
            options={contractTypesDropdownOptions}
            isSearchable
            isLoading={contractTypesLoading || isRefreshing}
            // helperText="Contract type is independent and will be applied to all property sections"
          />
        </div>

        {/* Promo Code & Termination Code Selection */}
        {selectedEstate &&
          selectedCategory &&
          !showLoadingIndicator &&
          !isDataEmpty && (
            <div className="space-y-6">
              {/* Promo Code Section */}
              <div className="p-6 rounded-2xl border border-gray-200 bg-[#57713A]/40">
                <div className="flex items-center gap-2 mb-4">
                  <TagIcon className="h-5 w-5 text-[#57713A]" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Apply Promo Code
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Select a promo code to apply to property
                </p>

                <EnhancedOptionInputField
                  label="Select Promo Code"
                  placeholder="Search and select a promo code..."
                  value={selectedPromoCode?.pCode || ""}
                  onChange={(value: string) => {
                    const promoCode = allPromoCodes.find(
                      (p) => p.pCode === value,
                    );
                    setSelectedPromoCode(promoCode);
                    applyPromoCodeToAllSections(promoCode);
                  }}
                  options={filteredPromoCodes.map((code) => ({
                    value: code.pCode,
                    label: `${code.pCode} - ${code.pName}`,
                    original: code,
                  }))}
                  isSearchable
                  isLoading={promoCodesLoading || isRefreshing}
                />

                {selectedPromoCode && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">Active Promo:</span>{" "}
                      {selectedPromoCode.pCode} -{" "}
                      {extractDiscountFromPromo(selectedPromoCode.pName)}%
                      discount
                    </p>
                  </div>
                )}
              </div>

              {/* Termination Code Section */}
              <div className="p-6 rounded-2xl border border-gray-200 bg-orange-50/30">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangleIcon className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Apply Termination Code
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Select a termination code to apply discount
                </p>

                <EnhancedOptionInputField
                  label="Select Termination Code"
                  placeholder="Search and select a termination code..."
                  value={selectedTerminationCode?.pCode || ""}
                  onChange={(value: string) => {
                    const terminationCode = allTerminationCodes.find(
                      (t) => t.pCode === value,
                    );
                    setSelectedTerminationCode(terminationCode);
                    applyTerminationCodeToAllSections(terminationCode);
                  }}
                  options={filteredTerminationCodes.map((code) => ({
                    value: code.pCode,
                    label: `${code.pCode} - ${code.pName}% off`,
                    original: code,
                  }))}
                  isSearchable
                  isLoading={terminationCodesLoading || isRefreshing}
                />

                {selectedTerminationCode && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <span className="font-semibold">
                        Active Termination Code:
                      </span>{" "}
                      {selectedTerminationCode.pCode} -{" "}
                      {selectedTerminationCode.pName}% discount
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      This discount will be applied before the promo code
                      discount
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Loading Indicator */}
        {showLoadingIndicator && (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border-2 border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#57713A] border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading property data...
            </p>
          </div>
        )}

        {/* Empty Data */}
        {isDataEmpty && !showLoadingIndicator && (
          <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border-2 border-slate-200">
            <AlertCircle className="h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No Data Available
            </h3>
            <p className="text-slate-600 text-center max-w-md">
              No property data found for the selected estate and category.
            </p>
          </div>
        )}

        {/* Land Sizes Section */}
        {!showLoadingIndicator && !isDataEmpty && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-semibold text-gray-800">
                Land Sizes & Pricing
              </h2>
              <button
                type="button"
                onClick={addLandSizeSection}
                className="px-4 py-2 bg-[#57713A] text-white rounded-lg text-sm hover:bg-[#57713A]/80"
              >
                + Add Land Size
              </button>
            </div>

            <div className="space-y-8">
              {landSizeSections.map((section, sectionIndex) => (
                <div
                  key={section.id}
                  className="border border-gray-200 rounded-2xl p-6 relative bg-gray-50/50"
                >
                  {landSizeSections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLandSizeSection(section.id)}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                    >
                      ✕
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <EnhancedOptionInputField
                      label="Land Size *"
                      placeholder="Select land size..."
                      value={section.size || ""}
                      onChange={(value: string) =>
                        updateLandSize(section.id, value)
                      }
                      options={availableSizes.map((item) => ({
                        value: item.size,
                        label: item.size,
                        original: item,
                      }))}
                      isSearchable
                      isLoading={propertyMapLoading}
                      error={getErrorMessage(
                        `landSizeSections[${sectionIndex}].size`,
                      )}
                    />

                    {/* Contract Type selection - now beside each land size */}
                    <EnhancedOptionInputField
                      label="Select Contract Type (Optional)"
                      placeholder="Choose a contract type..."
                      value={section.citta_contract_type || ""}
                      onChange={(value: string) =>
                        handleSectionContractTypeChange(section.id, value)
                      }
                      options={contractTypesDropdownOptions}
                      isSearchable
                      isLoading={contractTypesLoading || isRefreshing}
                    />
                  </div>

                  {/* Display contract type info if selected */}
                  {selectedContractType && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Contract Type:</span>{" "}
                        {selectedContractType.code} -{" "}
                        {selectedContractType.name}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {section.durations.map((duration, durationIndex) => (
                      <div
                        key={duration.id}
                        className="flex gap-4 items-end p-4 bg-white border border-gray-200 rounded-xl flex-wrap md:flex-nowrap"
                      >
                        <div className="flex-1 min-w-[150px]">
                          <InputField
                            label="Duration (months)"
                            type="number"
                            value={duration.duration || ""}
                            onChange={(e) =>
                              updateDuration(
                                section.id,
                                duration.id,
                                "duration",
                                e.target.value,
                              )
                            }
                            error={getErrorMessage(
                              `landSizeSections[${sectionIndex}].durations[${durationIndex}].duration`,
                            )}
                            placeholder={""}
                          />
                        </div>

                        <div className="flex-1 min-w-[150px]">
                          <InputField
                            label="Original Price (₦)"
                            type="text"
                            value={
                              duration.discountedPrice
                                ? formatToNaira(duration.discountedPrice)
                                : formatToNaira(duration.price || "")
                            }
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, "");
                              updateDuration(
                                section.id,
                                duration.id,
                                "price",
                                raw,
                              );
                            }}
                            error={getErrorMessage(
                              `landSizeSections[${sectionIndex}].durations[${durationIndex}].price`,
                            )}
                            placeholder={""}
                          />
                        </div>

                        <div className="flex-1 min-w-[150px]">
                          <InputField
                            label="Final Price (₦)"
                            type="text"
                            value={
                              duration.discountedPrice
                                ? formatToNaira(duration.discountedPrice)
                                : formatToNaira(duration.price || "")
                            }
                            onChange={() => {}}
                            placeholder={""}
                            disabled
                          />
                        </div>

                        <div className="flex-1 min-w-[180px]">
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
                            onClick={() =>
                              removeDurationFromSection(section.id, duration.id)
                            }
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addDurationToSection(section.id)}
                    className="mt-4 text-sm text-[#57713A] hover:text-[#57713A]/80 font-medium"
                  >
                    + Add Duration
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
});

PropertyListingPage.displayName = "PropertyListingPage";
export default PropertyListingPage;
