// PropertyTableComponent.tsx - Updated with PromoModal
import React, { useState, useRef, useEffect } from "react";
import Pagination from "../../../components/Tables/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../components/Redux/store";
import { fetchProperties } from "../../../components/Redux/Properties/properties_Thunk";
import {
  selectPropertiesPagination,
  selectPublishedPropertiesPagination,
  selectSoldPropertiesPagination,
  setDraftedPropertiesPage,
  setPublishedPropertiesPage,
  setSoldPropertiesPage,
} from "../../../components/Redux/Properties/propertiesTable_slice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPropertyState } from "../../../components/Redux/addProperty/addProperty_slice";
import { UpdateProperty } from "../../../components/Redux/addProperty/UpdateProperties/updateThunk";
import { resetUpdatePropertyState } from "../../../components/Redux/addProperty/UpdateProperties/delete_slice";
import { DeleteProperty } from "../../../components/Redux/addProperty/UpdateProperties/deleteThunk";
import ConfirmationModal from "../../../components/Modals/delete";
import PropertyModal from "../PropertyModal";
import { directors } from "../../../components/Redux/directors/directors_thunk";
import { resetToggleFeaturedState } from "../../../components/Redux/Properties/toggle_featured_slice";
import { toggleFeatured } from "../../../components/Redux/Properties/toggle_featured_thunk";
import { useNavigate, useLocation } from "react-router-dom";
import { resetToggleLatestState } from "../../../components/Redux/Properties/toggleLatestslice";
import { toggleLatest } from "../../../components/Redux/Properties/tooggleLatestThunk";
// import { PromoModal } from "../../../components/gift/PromoModal"; // Changed from GiftModal
// import { bulkAssignMultiplePromos } from "../../../components/Redux/gift/promo/promoSlice"; // New thunk for promo assignment
import { PromoModal } from "../../../components/gift/components/promo/PromoModal";
import { bulkAssignMultiplePromos } from "../../../components/Redux/gift/promo/promoSlice";

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

interface PropertyTableProps {
  data: PropertyData[];
  CurrentPage: any;
  activeTab: any;
  triggerGiftMode?: number; // Keeping name for compatibility but now for promo mode
}

export default function PropertyTableComponent({
  data,
  CurrentPage,
  activeTab,
  triggerGiftMode,
}: PropertyTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyData | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Promo mode states (renamed from gift mode)
  const [isPromoMode, setIsPromoMode] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [propertiesWithSelection, setPropertiesWithSelection] = useState<PropertyData[]>([]);
  const [assigningPromos, setAssigningPromos] = useState(false);

  // Listen for triggerGiftMode changes from parent (now triggers promo mode)
  useEffect(() => {
    if (triggerGiftMode && triggerGiftMode > 0) {
      setIsPromoMode(true);
    }
  }, [triggerGiftMode]);

  // Update properties with selection state when entering promo mode
  useEffect(() => {
    if (isPromoMode) {
      const updatedProperties = data.map(property => ({
        ...property,
        isSelected: false
      }));
      setPropertiesWithSelection(updatedProperties);
    }
  }, [isPromoMode, data]);

  const navigateToPropertyDetails = (propertyId: number) => {
    if (!isPromoMode) {
      const hasInfoTech = location.pathname.includes('/info-tech');
      navigate(hasInfoTech ? `/info-tech/properties/${propertyId}` : `/properties/${propertyId}`);
    }
  };

  const handlePromoClick = () => {
    setIsPromoMode(true);
  };

  const handleCheckboxToggle = (propertyId: number) => {
    setPropertiesWithSelection(prev =>
      prev.map(property =>
        property.id === propertyId
          ? { ...property, isSelected: !property.isSelected }
          : property
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = propertiesWithSelection.every(p => p.isSelected);
    setPropertiesWithSelection(prev =>
      prev.map(property => ({ ...property, isSelected: !allSelected }))
    );
  };

  // Updated handleAssignPromo to use bulkAssignMultiplePromos API
  const handleAssignPromo = async (selectedPromoIds: number[]) => {
    const selectedPropertyIds = propertiesWithSelection
      .filter(p => p.isSelected)
      .map(p => p.id);

    if (selectedPropertyIds.length === 0) {
      toast.warning("No properties selected");
      return;
    }

    if (selectedPromoIds.length === 0) {
      toast.warning("No promotions selected");
      return;
    }

    setAssigningPromos(true);
    
    try {
      // Prepare payload in the expected format
      const payload = {
        promo_ids: selectedPromoIds,
        property_ids: selectedPropertyIds
      };

      console.log("Assigning promotions with payload:", payload);

      // Call the bulk assign API - You'll need to create this thunk
      await dispatch(bulkAssignMultiplePromos(payload)).unwrap();
      
      toast.success(
        `${selectedPromoIds.length} promotion(s) assigned to ${selectedPropertyIds.length} property(s) successfully!`
      );
      
      // Exit promo mode and refresh data
      setIsPromoMode(false);
      setShowPromoModal(false);
      
      // Refresh properties list
      dispatch(
        fetchProperties({
          page: CurrentPage,
        })
      );
      
    } catch (error: any) {
      console.error("Error assigning promotions:", error);
      toast.error(error?.message || "Failed to assign promotions. Please try again.");
    } finally {
      setAssigningPromos(false);
    }
  };

  const handleCancelPromoMode = () => {
    setIsPromoMode(false);
  };

  const { loading, success, error } = useSelector(
    (state: RootState) => state.updateproperty
  );
  const {
    loading: deleteloading,
    success: deletesuccess,
    error: deleteerror,
  } = useSelector((state: RootState) => state.DeleteProperty);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<PropertyData | null>(
    null
  );
  
  const {
    data: directorDta,
  } = useSelector((state: RootState) => state.directors);

  useEffect(() => {
    if (deletesuccess && propertyToDelete) {
      toast.success("Property deleted successfully!");
      dispatch(
        fetchProperties({
          page: CurrentPage,
        })
      );
      handleCloseDeleteModal();
    }

    if (deleteerror) {
      toast.error(deleteerror || "Failed to delete property");
    }
  }, [deletesuccess, deleteerror, dispatch, propertyToDelete, CurrentPage]);
  
  const handleDeleteClick = (property: PropertyData) => {
    setPropertyToDelete(property);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    dispatch(directors());
  }, [dispatch]);

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPropertyToDelete(null);
    dispatch(resetUpdatePropertyState());
  };

  const handleConfirmDelete = async () => {
    if (propertyToDelete) {
      await dispatch(
        DeleteProperty({ propertyId: propertyToDelete.id.toString() })
      );
    }
  };

  const handlePageChange = async (page: any) => {
    if (activeTab === "Published") {
      await dispatch(setPublishedPropertiesPage({ type: "published", page }));
    } else if (activeTab === "Sold") {
      await dispatch(setSoldPropertiesPage({ type: "sold", page }));
    } else if (activeTab === "Drafted") {
      await dispatch(setDraftedPropertiesPage({ type: "drafted", page }));
    }
  };

  const pagination = useSelector((state: RootState) => {
    switch (activeTab) {
      case "Published":
        return selectPublishedPropertiesPagination(state);
      case "Sold":
        return selectSoldPropertiesPagination(state);
      case "Drafted":
        return selectPropertiesPagination(state); 
      default:
        return selectPublishedPropertiesPagination(state);
    }
  });

  useEffect(() => {
    if (success) {
      toast.success("Property updated successfully!");
      dispatch(
        fetchProperties({
          page: CurrentPage,
        })
      );
      handleCloseModal();
    }

    if (error) {
      toast.error(error.message || "Failed to update property");
    }
  }, [success, error, dispatch, CurrentPage]);

  const getPropertyType = (type: number) => {
    switch (type) {
      case 1:
        return "land";
      case 2:
        return "Residential";
      case 3:
        return "industrial";
      default:
        return "Commercial";
    }
  };

  const handleRowClick = (propertyId: number) => {
    if (!isPromoMode) {
      navigateToPropertyDetails(propertyId);
    }
  };
  
  const handleEditClick = (property: PropertyData) => {
    setEditingProperty(property);
    setImagePreview(property.display_image || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
    setImagePreview(null);
    setImageFile(null);
    dispatch(resetPropertyState());
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!editingProperty) return;

    const { name, value, type } = e.target;

    setEditingProperty((prev) => {
      if (!prev) return null;

      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        const numericValue = checked ? 1 : 0;

        if (name === "is_active" || name === "is_sold") {
          return {
            ...prev,
            [name]: numericValue,
            ...(name === "is_active"
              ? { is_sold: numericValue === 1 ? 0 : prev.is_sold }
              : {}),
            ...(name === "is_sold"
              ? { is_active: numericValue === 1 ? 0 : prev.is_active }
              : {}),
          };
        }

        return {
          ...prev,
          [name]: numericValue,
        };
      }

      return {
        ...prev,
        [name]:
          name === "total_amount" ||
          name === "no_of_bedroom" ||
          name === "type" ||
          name === "director_id"
            ? Number(value)
            : value,
      };
    });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProperty) return;

    const formData = new FormData();
    formData.append("name", editingProperty.name);
    formData.append("street_address", editingProperty.street_address);
    formData.append("total_amount", editingProperty.total_amount.toString());
    formData.append("type", editingProperty.type.toString());
    if (editingProperty.director_id) {
      formData.append("director_id", editingProperty.director_id.toString());
    }
    if (editingProperty.no_of_bedroom) {
      formData.append(
        "no_of_bedroom",
        editingProperty.no_of_bedroom.toString()
      );
    }
    formData.append(
      "is_active",
      editingProperty.is_active?.toString() || "false"
    );
    formData.append("is_sold", editingProperty.is_sold?.toString() || "false");

    if (imageFile) {
      formData.append("display_image", imageFile);
    }

    await dispatch(
      UpdateProperty({
        UpdateId: editingProperty.id,
        credentials: formData,
      })
    );
  };
  
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(
    null
  );
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);

  const handlePropertyClick = (property: PropertyData) => {
    setSelectedProperty(property);
    setIsPropertyModalOpen(true);
  };

  const {
    loading: toggleLoading,
    success: toggleSuccess,
    error: toggleError,
  } = useSelector((state: RootState) => state.toggleFeatured);

  const [loadingPropertyId, setLoadingPropertyId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (toggleSuccess) {
      dispatch(
        fetchProperties({
          page: CurrentPage,
        })
      );
      dispatch(resetToggleFeaturedState());
    }

    if (toggleError) {
      dispatch(resetToggleFeaturedState());
    }
  }, [toggleSuccess, toggleError, dispatch, CurrentPage]);

  const handleToggleFeatured = async (propertyId: number) => {
    setLoadingPropertyId(propertyId);
    await dispatch(toggleFeatured({ id: propertyId }));
    setLoadingPropertyId(null);
  };
  
  const {
    loading: toggleLatestLoading,
    success: toggleLatestSuccess,
    error: toggleLatestError,
  } = useSelector((state: RootState) => state.toggleLatest);
  
  const [loadingLatestPropertyId, setLoadingLatestPropertyId] = useState<
    number | null
  >(null);
  
  useEffect(() => {
    if (toggleLatestSuccess) {
      dispatch(
        fetchProperties({
          page: CurrentPage,
        })
      );
      dispatch(resetToggleLatestState());
    }

    if (toggleLatestError) {
      dispatch(resetToggleLatestState());
    }
  }, [toggleLatestSuccess, toggleLatestError, dispatch, CurrentPage]);
  
  const handleToggleLatest = async (propertyId: number) => {
    setLoadingLatestPropertyId(propertyId);
    await dispatch(toggleLatest({ id: propertyId }));
    setLoadingLatestPropertyId(null);
  };

  const displayData = isPromoMode ? propertiesWithSelection : data;
  const selectedCount = isPromoMode 
    ? propertiesWithSelection.filter(p => p.isSelected).length 
    : 0;

  return (
    <>
      {/* Promo Mode Banner - Updated from Gift Mode */}
      {isPromoMode && (
        <div className="mb-4 p-4 bg-[#79B833]/10 rounded-[20px] border border-[#79B833]/30 flex items-center justify-between">
          <div>
            <span className="font-semibold text-[#79B833]">Promotion Mode Active</span>
            <span className="ml-2 text-gray-600">
              {selectedCount} {selectedCount !== 1 ? 'properties' : 'property'} selected
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancelPromoMode}
              className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={assigningPromos}
            >
              Cancel
            </button>
            <button
              onClick={() => setShowPromoModal(true)}
              disabled={selectedCount === 0 || assigningPromos}
              className={`px-4 py-2 rounded-full text-white transition-colors ${
                selectedCount > 0 && !assigningPromos
                  ? "bg-[#79B833] hover:bg-[#79B833]/80"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {assigningPromos ? "Assigning..." : `Select Promotion (${selectedCount})`}
            </button>
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                {isPromoMode && (
                  <th className="w-10 py-4 pr-2">
                    <input
                      type="checkbox"
                      checked={propertiesWithSelection.length > 0 && propertiesWithSelection.every(p => p.isSelected)}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-[#79B833] focus:ring-[#79B833] accent-[#79B833]"
                      disabled={assigningPromos}
                    />
                  </th>
                )}
                <th className="w-2/5 py-4 pr-6 font-normal text-[#757575] text-xs">
                  Property Name
                </th>
                <th className="w-1/6 py-4 px-6 font-normal text-[#757575] text-xs">
                  Price
                </th>
                <th className="w-1/6 py-4 px-6 font-normal text-[#757575] text-xs">
                  Property Type
                </th>
                <th className="w-1/12 py-4 px-6 font-normal text-[#757575] text-xs">
                  Status
                </th>
                <th className="w-1/6 py-4 pl-4 font-normal text-[#757575] text-xs">
                  Actions
                </th>
                <th className="w-1/6 py-4 px-6 font-normal text-[#757575] text-xs">
                  Featured
                </th>
                <th className="w-1/6 py-4 px-6 font-normal text-[#757575] text-xs">
                  Latest
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData && displayData.length > 0 ? (
                displayData.map((property) => (
                  <tr
                    key={`property-${property.id}`}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    {isPromoMode && (
                      <td className="w-10 py-4 pr-2">
                        <input
                          type="checkbox"
                          checked={property.isSelected || false}
                          onChange={() => handleCheckboxToggle(property.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-gray-300 text-[#79B833] focus:ring-[#79B833] accent-[#79B833]"
                          disabled={assigningPromos}
                        />
                       </td>
                    )}
                    <td
                      className="w-2/5 py-4 pr-6 text-dark text-sm max-w-[300px]"
                      onClick={() => handleRowClick(property.id)}
                    >
                      <div className="group relative">
                        <div className="flex items-center">
                          <div
                            className="w-10 h-10 mr-3 overflow-hidden rounded-[15px] shrink-0 bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePropertyClick(property);
                            }}
                          >
                            <img
                              src={
                                property.display_image ||
                                "/default-property-image.jpg"
                              }
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className="font-[350] truncate mb-[12px]"
                              onClick={() => handlePropertyClick(property)}
                            >
                              {property.name}
                            </div>
                            <div
                              className="font-[325] text-[#757575] text-xs truncate flex"
                              onClick={() => handlePropertyClick(property)}
                            >
                              <img
                                src={"/location.svg"}
                                className="mr-1 shrink-0"
                                alt="location"
                              />
                              <span className="truncate">
                                {property.street_address}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute invisible group-hover:visible z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-0 max-w-xs break-words">
                          {property.name} - {property.street_address}
                        </div>
                      </div>
                     </td>
                    <td
                      className="w-1/6 py-4 px-6 font-[325] text-dark text-sm max-w-[150px]"
                      onClick={() => handleRowClick(property.id)}
                    >
                      <div className="group relative">
                        <span className="truncate block">
                          ₦{property.price?.toLocaleString()}
                        </span>
                        <div className="absolute invisible group-hover:visible z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-0">
                          ₦{property.price?.toLocaleString()}
                        </div>
                      </div>
                     </td>
                    <td
                      className="w-1/6 py-4 px-6 font-[325] text-dark text-sm max-w-[120px]"
                      onClick={() => handleRowClick(property.id)}
                    >
                      <div className="group relative">
                        <span className="truncate block">
                          {getPropertyType(property.type)}
                        </span>
                        <div className="absolute invisible group-hover:visible z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-0">
                          {getPropertyType(property.type)}
                        </div>
                      </div>
                     </td>
                    <td
                      className="w-1/12 py-4 px-6 font-[325] text-dark text-sm max-w-[80px]"
                      onClick={() => handleRowClick(property.id)}
                    >
                      <div className="group relative">
                        <span className="truncate block">
                          {property.is_sold
                            ? "Sold"
                            : property.is_active
                            ? "Active"
                            : "Available"}
                        </span>
                        <div className="absolute invisible group-hover:visible z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-0">
                          {property.is_sold
                            ? "Sold"
                            : property.is_active
                            ? "Active"
                            : "Available"}
                        </div>
                      </div>
                     </td>
                    <td className="w-1/6 py-4 pl-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          aria-label="Delete property"
                          onClick={() => handleDeleteClick(property)}
                          disabled={assigningPromos}
                        >
                          <img
                            src="mingcute_delete-fill.svg"
                            className="w-[18px] h-[18px]"
                            alt="delete"
                          />
                        </button>
                      </div>
                     </td>
                    <td className="w-1/6 py-4 px-6 text-sm">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={property.is_featured === 1}
                          onChange={() => handleToggleFeatured(property.id)}
                          disabled={
                            (toggleLoading && loadingPropertyId === property.id) || assigningPromos
                          }
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer transition-colors duration-300 ${
                            toggleLoading && loadingPropertyId === property.id
                              ? "bg-gray-300"
                              : property.is_featured === 1
                              ? "bg-[#79B833]"
                              : "bg-gray-400"
                          } peer-checked:bg-[#79B833] peer-disabled:opacity-70 relative`}
                        >
                          <div
                            className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 transform ${
                              property.is_featured === 1 ? "translate-x-5" : ""
                            }`}
                          ></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {toggleLoading && loadingPropertyId === property.id
                            ? "Updating..."
                            : property.is_featured === 1
                            ? "On"
                            : "Off"}
                        </span>
                      </label>
                     </td>
                    <td className="w-1/6 py-4 px-6 text-sm">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={property.is_offer === 1}
                          onChange={() => handleToggleLatest(property.id)}
                          disabled={
                            (toggleLatestLoading && loadingLatestPropertyId === property.id) || assigningPromos
                          }
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer transition-colors duration-300 ${
                            toggleLatestLoading &&
                            loadingLatestPropertyId === property.id
                              ? "bg-gray-300"
                              : property.is_offer === 1
                              ? "bg-[#79B833]"
                              : "bg-gray-400"
                          } peer-checked:bg-[#79B833] peer-disabled:opacity-70 relative`}
                        >
                          <div
                            className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 transform ${
                              property.is_offer === 1 ? "translate-x-5" : ""
                            }`}
                          ></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {toggleLatestLoading &&
                          loadingLatestPropertyId === property.id
                            ? "Updating..."
                            : property.is_offer === 1
                            ? "On"
                            : "Off"}
                        </span>
                      </label>
                     </td>
                   </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isPromoMode ? 8 : 7} className="py-4 text-center text-gray-500">
                    No properties found
                   </td>
                 </tr>
              )}
            </tbody>
           </table>
        </div>
      </div>

      {/* Promo Modal - Updated to use PromoModal */}
      <PromoModal
        isOpen={showPromoModal}
        onClose={() => setShowPromoModal(false)}
        properties={propertiesWithSelection.filter(p => p.isSelected)}
        onAssignPromo={handleAssignPromo}
        isLoading={assigningPromos}
      />

      {/* delete property */}
      {isDeleteModalOpen && propertyToDelete && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Delete Property"
          description="Are you sure you want to delete"
          subjectName={propertyToDelete.name}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          loading={deleteloading}
          confirmButtonText="Delete Property"
          cancelButtonText="Cancel"
        />
      )}

      {/* Property Modal */}
      {isPropertyModalOpen && selectedProperty && (
        <PropertyModal
          isOpen={isPropertyModalOpen}
          onClose={() => setIsPropertyModalOpen(false)}
          property={selectedProperty}
        />
      )}

      <div className="w-full">
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          className="mt-8 mb-4"
        />
      </div>
    </>
  );
}