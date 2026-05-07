// GiftModal.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { selectAllGifts, selectGiftsLoading } from "../Redux/gift/gift_slice";
import { fetchGifts } from "../Redux/gift/gift_thunk";
import { AppDispatch } from "../Redux/store";

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: PropertyData[];
  onAssignGift: (selectedGiftIds: number[]) => void;
  isLoading?: boolean;
}

interface GiftOption {
  value: number;
  label: string;
  type?: string;
  estimated_value?: number;
  remaining_quantity?: number;
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

export const GiftModal: React.FC<GiftModalProps> = ({
  isOpen,
  onClose,
  properties,
  onAssignGift,
  isLoading = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const gifts = useSelector(selectAllGifts);
  const loadingGifts = useSelector(selectGiftsLoading);
  
  const [selectedGifts, setSelectedGifts] = useState<GiftOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Fetch gifts when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchGifts({ page: 1, per_page: 100 }));
      setSelectedGifts([]);
      setSearchTerm("");
      setSelectedType("all");
    }
  }, [isOpen, dispatch]);

  // Transform gifts from API to Select options
  const giftOptions: GiftOption[] = gifts.map((gift: any) => ({
    value: gift.id,
    label: `${gift.name} - ${gift.type} (₦${gift.estimated_value?.toLocaleString()})`,
    type: gift.type,
    estimated_value: gift.estimated_value,
    remaining_quantity: gift.remaining_quantity,
  }));

  // Get unique gift types for filtering
  const giftTypes = ["all", ...new Set(gifts.map((gift: any) => gift.type).filter(Boolean))];

  // Filter gifts based on search and type
  const filteredGiftOptions = giftOptions.filter((gift) => {
    const matchesSearch = gift.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || gift.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleGiftChange = (selectedOptions: any) => {
    setSelectedGifts(selectedOptions || []);
  };

  const handleSubmit = () => {
    if (selectedGifts.length === 0) {
      alert("Please select at least one gift");
      return;
    }
    
    const selectedGiftIds = selectedGifts.map(gift => gift.value);
    onAssignGift(selectedGiftIds);
    onClose();
    setSelectedGifts([]);
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
        <h2 className="text-2xl font-bold mb-2 text-dark">Select Gifts</h2>
        <p className="text-gray-500 mb-6">
          You have selected <span className="font-semibold text-[#79B833]">{selectedPropertiesCount}</span> property{selectedPropertiesCount !== 1 ? 'ies' : ''}
        </p>
        
        {/* Search and Filter Section */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search gifts by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:border-transparent capitalize"
            >
              {giftTypes.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type === "all" ? "All Types" : type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-[#4F4F4F] font-medium text-[14px] mb-2">
            Choose Gifts (Multiple selection allowed)
          </label>
          
          {loadingGifts ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#79B833]"></div>
              <span className="ml-2 text-gray-500">Loading gifts...</span>
            </div>
          ) : (
            <Select
              isMulti
              value={selectedGifts}
              onChange={handleGiftChange}
              options={filteredGiftOptions}
              placeholder="Search or select gifts..."
              styles={customStyles}
              isSearchable={true}
              className="react-select-container"
              classNamePrefix="react-select"
              noOptionsMessage={() => searchTerm || selectedType !== "all" ? "No gifts match your filters" : "No gifts available"}
              loadingMessage={() => "Loading gifts..."}
              isDisabled={isLoading}
            />
          )}
          
          <p className="text-xs text-gray-400 mt-2">
            You can select multiple gifts to assign to the selected properties
          </p>
        </div>

        {/* Selected Gifts Preview */}
        {selectedGifts.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Selected Gifts ({selectedGifts.length}):
            </p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {selectedGifts.map((gift) => (
                <span
                  key={gift.value}
                  className="px-3 py-1 bg-[#79B833] text-white text-sm rounded-full flex items-center gap-2"
                >
                  {gift.label.split(' - ')[0]}
                  <button
                    onClick={() => setSelectedGifts(selectedGifts.filter(g => g.value !== gift.value))}
                    className="hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gift Statistics Summary */}
        {selectedGifts.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-2xl">
            <p className="text-sm font-medium text-blue-800 mb-2">Summary:</p>
            <div className="space-y-1 text-sm text-blue-700">
              <p>• {selectedGifts.length} gift(s) will be assigned to {selectedPropertiesCount} property(s)</p>
              <p>• Total assignments: {selectedGifts.length * selectedPropertiesCount}</p>
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
            disabled={selectedGifts.length === 0 || isLoading || loadingGifts}
            className={`px-6 py-2.5 rounded-full text-white transition-colors font-medium ${
              selectedGifts.length > 0 && !isLoading && !loadingGifts
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
              `Assign Gift to ${selectedPropertiesCount} Property${selectedPropertiesCount !== 1 ? 'ies' : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};