// PromoModal.tsx - Updated to use the simple list endpoint
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchPromosList, selectPromosList, selectPromosLoading } from "../../../Redux/gift/promo/promoSlice";
import { AppDispatch } from "../../../Redux/store";

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: PropertyData[];
  onAssignPromo: (selectedPromoIds: number[]) => void;
  isLoading?: boolean;
}

interface PromoOption {
  value: number;
  label: string;
  created_at?: string;
}

export interface PropertyData {
  is_featured: any;
  is_offer: any;
  id: number;
  name: string;
  display_image: string;
  photos: string[];
  size: string;
  price: number;
  type: number;
  no_of_bedroom: number | null;
  slug: string;
  features: string[] | string;
  overview: string;
  description: string;
  street_address: string;
  country: string | null;
  state: string | null;
  lga: string | null;
  created_at: string | null;
  updated_at: string | null;
  area: string | null;
  property_map: string | null;
  property_video: string | null;
  virtual_tour: string | null;
  subscriber_form: string | null;
  status: string;
  initial_deposit: number;
  is_sold: any;
  is_active: any;
  property_duration_limit: number;
  payment_schedule: string[] | string | null;
  category: string;
  is_discount: boolean;
  discount_name: string | null;
  discount_percentage: any | null;
  discount_units: any | null;
  discount_start_date: string | null;
  discount_end_date: string | null;
  parking_space: string | null;
  number_of_bathroom: number | null;
  number_of_unit: number | null;
  property_agreement: string | null;
  payment_type: string | null;
  location_type: string | null;
  purpose: string | null;
  year_built: string | null;
  total_amount: number;
  unit_available: any;
  unit_sold: any;
  property_view: any;
  property_requests: any;
  director_id?: any | null;
  isSelected?: boolean;
}

export const PromoModal: React.FC<PromoModalProps> = ({
  isOpen,
  onClose,
  properties,
  onAssignPromo,
  isLoading = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const promosList = useSelector(selectPromosList);
  const loadingPromos = useSelector(selectPromosLoading);
  
  const [selectedPromos, setSelectedPromos] = useState<PromoOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Fetch promos list when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchPromosList());
      setSelectedPromos([]);
      setSearchTerm("");
      setSortBy("newest");
    }
  }, [isOpen, dispatch]);

  // Transform promos from API to Select options
  const promoOptions: PromoOption[] = promosList.map((promo: any) => {
    return {
      value: promo.id,
      label: `${promo.name}`,
      created_at: promo.created_at,
    };
  }).filter(promo => promo.value);

  // Sort promos based on selected sort option
  const getSortedPromos = () => {
    const sorted = [...promoOptions];
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      case "oldest":
        return sorted.sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''));
      default:
        return sorted;
    }
  };

  // Filter promos based on search
  const filteredPromoOptions = getSortedPromos().filter((promo) => {
    const matchesSearch = promo.label.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handlePromoChange = (selectedOptions: any) => {
    setSelectedPromos(selectedOptions || []);
  };

  const handleSubmit = () => {
    if (selectedPromos.length === 0) {
      alert("Please select at least one promotion");
      return;
    }
    
    const selectedPromoIds = selectedPromos.map(promo => promo.value);
    onAssignPromo(selectedPromoIds);
    onClose();
    setSelectedPromos([]);
  };

  const selectedPropertiesCount = properties.filter(p => p.isSelected).length;

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: "#F5F5F5",
      border: "none",
      borderRadius: "60px",
      padding: "4px 16px",
      minHeight: "50px",
      boxShadow: state.isFocused ? "0 0 0 2px #79B833" : "none",
      "&:hover": {
        borderColor: "#79B833",
      },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "20px",
      overflow: "hidden",
      marginTop: "8px",
      zIndex: 9999,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: "16px",
      maxHeight: "300px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#79B833" : state.isFocused ? "#79B83320" : "white",
      color: state.isSelected ? "white" : "#333",
      fontWeight: state.isSelected ? "500" : "normal",
      "&:hover": {
        backgroundColor: state.isSelected ? "#79B833" : "#79B83320",
      },
      marginBottom: "8px",
      borderRadius: "12px",
      padding: "10px 16px",
      cursor: "pointer",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#999",
      fontSize: "14px",
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "#79B83320",
      borderRadius: "20px",
      padding: "2px 8px",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "#79B833",
      fontWeight: "500",
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "#79B833",
      "&:hover": {
        backgroundColor: "#79B833",
        color: "white",
        borderRadius: "20px",
      },
    }),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[30px] w-full max-w-2xl p-8 z-10 shadow-2xl">
        <h2 className="text-2xl font-bold mb-2 text-dark">Select Promotions</h2>
        <p className="text-gray-500 mb-6">
          You have selected <span className="font-semibold text-[#79B833]">{selectedPropertiesCount}</span> {selectedPropertiesCount !== 1 ? 'properties' : 'property'}
        </p>
        
       

        <div className="mb-8">
          <label className="block text-[#4F4F4F] font-medium text-[14px] mb-2">
            Choose Promotions (Multiple selection allowed)
          </label>
          
          {loadingPromos ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#79B833]"></div>
              <span className="ml-2 text-gray-500">Loading promotions...</span>
            </div>
          ) : (
            <Select
              isMulti
              value={selectedPromos}
              onChange={handlePromoChange}
              options={filteredPromoOptions}
              placeholder="Search or select promotions..."
              styles={customStyles}
              isSearchable={true}
              className="react-select-container"
              classNamePrefix="react-select"
              noOptionsMessage={() => searchTerm ? "No promotions match your search" : "No promotions available"}
              loadingMessage={() => "Loading promotions..."}
              isDisabled={isLoading}
            />
          )}
          
          <p className="text-xs text-gray-400 mt-2">
            You can select multiple promotions to assign to the selected properties
          </p>
        </div>

        {/* Selected Promos Preview */}
        {selectedPromos.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Selected Promotions ({selectedPromos.length}):
            </p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {selectedPromos.map((promo) => (
                <span
                  key={promo.value}
                  className="px-3 py-1 bg-[#79B833] text-white text-sm rounded-full flex items-center gap-2"
                >
                  {promo.label}
                  <button
                    onClick={() => setSelectedPromos(selectedPromos.filter(p => p.value !== promo.value))}
                    className="hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

     
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedPromos.length === 0 || isLoading || loadingPromos}
            className={`px-6 py-2.5 rounded-full text-white transition-colors font-medium ${
              selectedPromos.length > 0 && !isLoading && !loadingPromos
                ? "bg-[#79B833] hover:bg-[#79B833]/80"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Assigning...
              </div>
            ) : (
              `Assign Promotion to ${selectedPropertiesCount} Property${selectedPropertiesCount !== 1 ? 'ies' : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};