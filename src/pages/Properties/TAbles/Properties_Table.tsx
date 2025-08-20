import React, { useState, useRef, useEffect } from "react";
import Pagination from "../../../components/Tables/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../components/Redux/store";
import { fetchProperties } from "../../../components/Redux/Properties/properties_Thunk";
import {
  // selectPropertiesagination,
  selectPropertiesPagination,
  setPropertiesPage,
} from "../../../components/Redux/Properties/propertiesTable_slice";
import InputField from "../../../components/input/inputtext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPropertyState } from "../../../components/Redux/addProperty/addProperty_slice";
import { UpdateProperty } from "../../../components/Redux/addProperty/UpdateProperties/updateThunk";
import { resetUpdatePropertyState } from "../../../components/Redux/addProperty/UpdateProperties/delete_slice";
import { DeleteProperty } from "../../../components/Redux/addProperty/UpdateProperties/deleteThunk";
import ConfirmationModal from "../../../components/Modals/delete";
import PropertyModal from "../PropertyModal";
import { directors } from "../../../components/Redux/directors/directors_thunk";
import OptionInputField from "../../../components/input/drop_down";
import { resetToggleFeaturedState } from "../../../components/Redux/Properties/toggle_featured_slice";
import { toggleFeatured } from "../../../components/Redux/Properties/toggle_featured_thunk";
import { useNavigate } from "react-router-dom";

export interface PropertyData {
  is_featured: any;
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
  director_id?: any | null; // Add director_id to the interface
  
}

interface PropertyTableProps {
  data: PropertyData[];
  CurrentPage:any
}

export default function PropertyTableComponent({ data,CurrentPage }: PropertyTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyData | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Get the update state from Redux
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
  interface DropdownOption {
    label: string;
    value: string | number;
  }
  const {
    loading: userLoading,
    error: userError,
    data: directorDta,
  } = useSelector((state: RootState) => state.directors);

  const labels: DropdownOption[] = Array.isArray(directorDta)
    ? directorDta.map((person) => ({
        label: `${person.first_name} ${person.last_name}`,
        value: person.id,
      }))
    : [];
  useEffect(() => {
    if (deletesuccess && propertyToDelete) {
      toast.success("Property deleted successfully!");
     dispatch(fetchProperties({ 
        page:   CurrentPage,
   
      }));
      handleCloseDeleteModal();
    }

    if (deleteerror) {
      toast.error(deleteerror || "Failed to delete property");
    }
  }, [deletesuccess, deleteerror, dispatch, propertyToDelete]);
  // Add these handler functions
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
    await dispatch(setPropertiesPage(page));
    await dispatch(fetchProperties(page));
  };

  const pagination = useSelector(selectPropertiesPagination);

  // Handle success and error states
  useEffect(() => {
    if (success) {
      toast.success("Property updated successfully!");
     dispatch(fetchProperties({ 
        page:   CurrentPage,
   
      }));
      handleCloseModal();
    }

    if (error) {
      toast.error(error.message || "Failed to update property");
    }
  }, [success, error, dispatch]);

  const getPropertyType = (type: number) => {
    switch (type) {
      case 1:
        return "Residential";
      case 2:
        return "Commercial";
      case 3:
        return "Land";
      default:
        return "Commercial";
    }
  };
  const navigate = useNavigate();

const handleRowClick = (propertyId: number) => {
  navigate(`/properties/${propertyId}`);
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

      // Handle checkboxes (including is_discount)
      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        const numericValue = checked ? 1 : 0;

        // Handle the mutually exclusive checkboxes
        if (name === "is_active" || name === "is_sold") {
          return {
            ...prev,
            [name]: numericValue,
            // When one is checked (1), the other must be unchecked (0)
            ...(name === "is_active"
              ? { is_sold: numericValue === 1 ? 0 : prev.is_sold }
              : {}),
            ...(name === "is_sold"
              ? { is_active: numericValue === 1 ? 0 : prev.is_active }
              : {}),
          };
        }

        // Handle other checkboxes (like is_discount)
        return {
          ...prev,
          [name]: numericValue,
        };
      }

      // Handle other input types
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
  // handler for array fields
  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (!editingProperty) return;

    const { name, value } = e.target;
    const arrayValue = value.split(",").map((item) => item.trim());

    setEditingProperty({
      ...editingProperty,
      [name]: arrayValue,
    });
  };

  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(
    null
  );
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);

  // Add this handler
  const handlePropertyClick = (property: PropertyData) => {
    setSelectedProperty(property);

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
      // toast.success("Featured status updated successfully!");
     dispatch(fetchProperties({ 
        page:   CurrentPage,
   
      }));
      dispatch(resetToggleFeaturedState());
    }

    if (toggleError) {
      // toast.error(toggleError);
      dispatch(resetToggleFeaturedState());
    }
  }, [toggleSuccess, toggleError, dispatch]);

  // Handler to toggle featured status
  const handleToggleFeatured = async (propertyId: number) => {
    setLoadingPropertyId(propertyId);
    await dispatch(toggleFeatured({ id: propertyId }));
    setLoadingPropertyId(null);

  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
         <table className="w-full min-w-[800px]">
  <thead>
    <tr className="text-left">
      <th className="w-2/5 py-4 pr-6 font-normal text-[#757575] text-xs">
        Property Name
      </th>
      <th className="w-1/6 py-4 px-6 font-normal text-[#757575] text-xs">
        Price
      </th>
      <th className="w-1/6 py-4 px-6 font-normal text-[#757575] text-xs">
        Property Type
      </th>
      {/* <th className="w-1/12 py-4 px-6 font-normal text-[#757575] text-xs">
        Bedrooms
      </th> */}
      <th className="w-1/12 py-4 px-6 font-normal text-[#757575] text-xs">
        Status
      </th>
      <th className="w-1/6 py-4 pl-4 font-normal text-[#757575] text-xs">
        Actions
      </th>
      <th className="w-1/6 py-4 px-6 font-normal text-[#757575] text-xs">
        Featured
      </th>
    </tr>
  </thead>
  <tbody>
    {data && data.length > 0 ? (
      data.map((property) => (
        <tr
          key={`property-${property.id}`}
          className="hover:bg-gray-50 cursor-pointer"
        >
          <td className="w-2/5 py-4 pr-6 text-dark text-sm max-w-[300px]" onClick={() => handleRowClick(property.id)}>
            <div className="group relative">
              <div className="flex items-center">
                <div
                  className="w-10 h-10 mr-3 overflow-hidden rounded-[15px] shrink-0 bg-gray-100"
                  onClick={() => handlePropertyClick(property)}
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
                    <img src={"/location.svg"} className="mr-1 shrink-0" />
                    <span className="truncate">{property.street_address}</span>
                  </div>
                </div>
              </div>
              <div className="absolute invisible group-hover:visible z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-0 max-w-xs break-words">
                {property.name} - {property.street_address}
              </div>
            </div>
          </td>
          <td className="w-1/6 py-4 px-6 font-[325] text-dark text-sm max-w-[150px]" onClick={() => handleRowClick(property.id)}>
            <div className="group relative">
              <span className="truncate block">₦{property.price?.toLocaleString()}</span>
              <div className="absolute invisible group-hover:visible z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-0">
                ₦{property.price?.toLocaleString()}
              </div>
            </div>
          </td>
          <td className="w-1/6 py-4 px-6 font-[325] text-dark text-sm max-w-[120px]" onClick={() => handleRowClick(property.id)}>
            <div className="group relative">
              <span className="truncate block">{getPropertyType(property.type)}</span>
              <div className="absolute invisible group-hover:visible z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-0">
                {getPropertyType(property.type)}
              </div>
            </div>
          </td>
          {/* <td className="w-1/12 py-4 px-6 font-[325] text-dark text-sm max-w-[80px]" onClick={() => handleRowClick(property.id)}>
            <div className="group relative">
              <span className="truncate block">{property.no_of_bedroom || "N/A"}</span>
              <div className="absolute invisible group-hover:visible z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-0">
                {property.no_of_bedroom || "N/A"}
              </div>
            </div>
          </td> */}
          <td className="w-1/12 py-4 px-6 font-[325] text-dark text-sm max-w-[80px]" onClick={() => handleRowClick(property.id)}>
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
              {/* <button
                aria-label="Edit property"
                onClick={() => handleEditClick(property)}
              >
                <img
                  src="/ic_round-edit.svg"
                  className="w-[18px] h-[18px]"
                />
              </button> */}
              <button
                aria-label="Delete property"
                onClick={() => handleDeleteClick(property)}
              >
                <img
                  src="mingcute_delete-fill.svg"
                  className="w-[18px] h-[18px]"
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
                  toggleLoading && loadingPropertyId === property.id
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
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={7} className="py-4 text-center text-gray-500">
          No properties found
        </td>
      </tr>
    )}
  </tbody>
</table>
        </div>
      </div>
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
      {isPropertyModalOpen && selectedProperty && (
        <PropertyModal
          isOpen={isPropertyModalOpen}
          onClose={() => setIsPropertyModalOpen(false)}
          property={selectedProperty}
        />
      )}
      {/* // Update the form inside the modal with all fields */}{" "}
      {isModalOpen && editingProperty && (
        <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[30px] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Property</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Basic Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-2">
                      Basic Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Add the OptionInputField here */}
                      <div className="col-span-2">
                        <OptionInputField
                          label="Director"
                          placeholder="Select director"
                          name="director_id"
                          value={editingProperty.director_id || ""}
                          onChange={(value: any) => {
                            setEditingProperty({
                              ...editingProperty,
                              director_id: value ? Number(value) : null,
                            });
                          }}
                          options={labels}
                          dropdownTitle="Directors"
                        />
                      </div>

                      <div>
                        <InputField
                          type="text"
                          name="name"
                          value={editingProperty.name}
                          onChange={handleInputChange}
                          label="Property Name"
                          placeholder="Enter property name"
                          required
                        />
                      </div>

                      <div>
                        <InputField
                          type="text"
                          name="size"
                          value={editingProperty.size || ""}
                          onChange={handleInputChange}
                          label="Size"
                          placeholder="e.g. 540sqm"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Price (₦)
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={editingProperty.price || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Total Amount (₦)
                        </label>
                        <input
                          type="number"
                          name="total_amount"
                          value={editingProperty.total_amount || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Initial Deposit (₦)
                        </label>
                        <input
                          type="number"
                          name="initial_deposit"
                          value={editingProperty.initial_deposit || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Property Type
                        </label>
                        <select
                          name="type"
                          value={editingProperty.type}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                          required
                        >
                          <option value={1}>Residential</option>
                          <option value={2}>Commercial</option>
                          <option value={3}>Land</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Status
                        </label>
                        <select
                          name="status"
                          value={editingProperty.status || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                        >
                          <option value="For Sale">For Sale</option>
                          <option value="For Rent">For Rent</option>
                          <option value="Sold Out">Sold Out</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Category
                        </label>
                        <select
                          name="category"
                          value={editingProperty.category || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                        >
                          <option value="single">Single</option>
                          <option value="multiple">Multiple</option>
                        </select>
                      </div>

                      {/* Discount Fields */}
                      <div className="flex items-center col-span-2">
                        <input
                          type="checkbox"
                          name="is_discount"
                          checked={editingProperty?.is_discount || false}
                          onChange={handleInputChange}
                          className="mr-2 accent-black"
                        />
                        <label className="font-[325] text-[14px] text-gray-700">
                          Has Discount
                        </label>
                      </div>

                      {editingProperty.is_discount && (
                        <>
                          <div>
                            <InputField
                              type="text"
                              name="discount_name"
                              value={editingProperty.discount_name || ""}
                              onChange={handleInputChange}
                              label="Discount Name"
                              placeholder="Enter discount name"
                            />
                          </div>
                          <div>
                            <InputField
                              type="number"
                              name="discount_percentage"
                              value={editingProperty.discount_percentage || ""}
                              onChange={handleInputChange}
                              label="Discount Percentage"
                              placeholder="Enter discount percentage"
                            />
                          </div>
                          <div>
                            <InputField
                              type="number"
                              name="discount_units"
                              value={editingProperty.discount_units || ""}
                              onChange={handleInputChange}
                              label="Discount Units"
                              placeholder="Enter discount units"
                            />
                          </div>
                          <div>
                            <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                              Discount Start Date
                            </label>
                            <input
                              type="date"
                              name="discount_start_date"
                              value={editingProperty.discount_start_date || ""}
                              onChange={handleInputChange}
                              className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                            />
                          </div>
                          <div>
                            <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                              Discount End Date
                            </label>
                            <input
                              type="date"
                              name="discount_end_date"
                              value={editingProperty.discount_end_date || ""}
                              onChange={handleInputChange}
                              className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-2">
                      Location Information
                    </h3>
                    <div className="grid  md:grid-cols-2 gap-4">
                      <div>
                        <InputField
                          type="text"
                          name="street_address"
                          value={editingProperty.street_address || ""}
                          onChange={handleInputChange}
                          label="Street Address"
                          placeholder="Enter street address"
                          required
                        />
                      </div>

                      <div>
                        <InputField
                          type="text"
                          name="country"
                          value={editingProperty.country || ""}
                          onChange={handleInputChange}
                          label="Country"
                          placeholder="Enter country"
                        />
                      </div>

                      <div>
                        <InputField
                          type="text"
                          name="state"
                          value={editingProperty.state || ""}
                          onChange={handleInputChange}
                          label="State"
                          placeholder="Enter state"
                        />
                      </div>

                      <div>
                        <InputField
                          type="text"
                          name="lga"
                          value={editingProperty.lga || ""}
                          onChange={handleInputChange}
                          label="LGA"
                          placeholder="Enter local government area"
                        />
                      </div>

                      <div>
                        <InputField
                          type="text"
                          name="area"
                          value={editingProperty.area || ""}
                          onChange={handleInputChange}
                          label="Area"
                          placeholder="Enter area"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Location Type
                        </label>
                        <select
                          name="location_type"
                          value={editingProperty.location_type || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                        >
                          <option value="">Select Location Type</option>
                          <option value="Urban">Urban</option>
                          <option value="Suburban">Suburban</option>
                          <option value="Rural">Rural</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Purpose
                        </label>
                        <select
                          name="purpose"
                          value={editingProperty.purpose || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                        >
                          <option value="">Select Purpose</option>
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Industrial">Industrial</option>
                        </select>
                      </div>

                      <div>
                        <InputField
                          type="text"
                          name="year_built"
                          value={editingProperty.year_built || ""}
                          onChange={handleInputChange}
                          label="Year Built"
                          placeholder="Enter year built"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-2">
                      Property Details
                    </h3>
                    <div className="grid  md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Bedrooms
                        </label>
                        <input
                          type="number"
                          name="no_of_bedroom"
                          value={editingProperty.no_of_bedroom || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Bathrooms
                        </label>
                        <input
                          type="number"
                          name="number_of_bathroom"
                          value={editingProperty.number_of_bathroom || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                        />
                      </div>

                      <div>
                        <InputField
                          type="text"
                          name="parking_space"
                          value={editingProperty.parking_space || ""}
                          onChange={handleInputChange}
                          label="Parking Space"
                          placeholder="Enter parking space details"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Units
                        </label>
                        <input
                          type="number"
                          name="number_of_unit"
                          value={editingProperty.number_of_unit || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Duration Limit (months)
                        </label>
                        <input
                          type="number"
                          name="property_duration_limit"
                          value={editingProperty.property_duration_limit || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Payment Type
                        </label>
                        <select
                          name="payment_type"
                          value={editingProperty.payment_type || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                        >
                          <option value="">Select Payment Type</option>
                          <option value="One-time">One-time</option>
                          <option value="Installment">Installment</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={editingProperty.is_active === 1}
                          onChange={handleInputChange}
                          className="mr-2 accent-black"
                        />
                        <label className="font-[325] text-[14px] text-gray-700">
                          Active
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_sold"
                          checked={editingProperty.is_sold === 1}
                          onChange={handleInputChange}
                          className="mr-2 accent-black"
                        />
                        <label className="font-[325] text-[14px] text-gray-700">
                          Sold
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <div className="grid  gap-4">
                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Overview
                        </label>
                        <textarea
                          name="overview"
                          value={editingProperty.overview || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[15px] min-h-[100px]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={editingProperty.description || ""}
                          onChange={handleInputChange}
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[15px] min-h-[150px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-2">Media</h3>
                    <div className="grid  md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Display Image
                        </label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            onClick={triggerFileInput}
                            className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                          >
                            Select Image
                          </button>
                          {imagePreview ? (
                            <div className="w-16 h-16 overflow-hidden rounded-md">
                              <img
                                src={imagePreview}
                                alt="Property preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : editingProperty.display_image ? (
                            <div className="w-16 h-16 overflow-hidden rounded-md">
                              <img
                                src={editingProperty.display_image}
                                alt="Property preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                          Additional Photos
                        </label>
                        <input
                          type="file"
                          multiple
                          onChange={handleImageChange}
                          accept="image/*"
                          className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                        />
                        {editingProperty.photos &&
                          editingProperty.photos.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {editingProperty.photos.map((photo, index) => (
                                <div
                                  key={index}
                                  className="w-16 h-16 overflow-hidden rounded-md"
                                >
                                  <img
                                    src={photo}
                                    alt={`Property ${index}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                      </div>

                      <div>
                        <InputField
                          type="text"
                          name="property_map"
                          value={editingProperty.property_map || ""}
                          onChange={handleInputChange}
                          label="Property Map URL"
                          placeholder="Enter map URL"
                        />
                      </div>

                      <div>
                        <InputField
                          type="text"
                          name="property_video"
                          value={editingProperty.property_video || ""}
                          onChange={handleInputChange}
                          label="Property Video URL"
                          placeholder="Enter video URL"
                        />
                      </div>

                      <div>
                        <InputField
                          type="text"
                          name="virtual_tour"
                          value={editingProperty.virtual_tour || ""}
                          onChange={handleInputChange}
                          label="Virtual Tour URL"
                          placeholder="Enter virtual tour URL"
                        />
                      </div>

                      <div>
                        <InputField
                          type="text"
                          name="property_agreement"
                          value={editingProperty.property_agreement || ""}
                          onChange={handleInputChange}
                          label="Property Agreement URL"
                          placeholder="Enter agreement URL"
                        />
                      </div>

                      <div>
                        <InputField
                          type="text"
                          name="subscriber_form"
                          value={editingProperty.subscriber_form || ""}
                          onChange={handleInputChange}
                          label="Subscriber Form URL"
                          placeholder="Enter subscriber form URL"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Schedule */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-2">
                      Payment Schedule
                    </h3>
                    <div className="bg-[#F5F5F5] p-4 rounded-[15px]">
                      <textarea
                        name="payment_schedule"
                        value={
                          Array.isArray(editingProperty.payment_schedule)
                            ? editingProperty.payment_schedule.join(", ")
                            : editingProperty.payment_schedule?.replace(
                                /[\[\]"]/g,
                                ""
                              ) || ""
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          setEditingProperty({
                            ...editingProperty,
                            payment_schedule: value.includes(",")
                              ? value.split(",").map((item) => item.trim())
                              : value.trim(),
                          });
                        }}
                        className="w-full relative bg-white flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[15px] min-h-[100px]"
                        placeholder="Enter payment schedule (e.g., monthly, quarterly)"
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-2">Features</h3>
                    <div className="bg-[#F5F5F5] p-4 rounded-[15px]">
                      <textarea
                        name="features"
                        value={
                          Array.isArray(editingProperty.features)
                            ? editingProperty.features.join(", ")
                            : editingProperty.features?.replace(
                                /[\[\]"]/g,
                                ""
                              ) || ""
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          setEditingProperty({
                            ...editingProperty,
                            features: value.includes(",")
                              ? value.split(",").map((item) => item.trim())
                              : value.trim(),
                          });
                        }}
                        className="w-full relative bg-white flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[15px] min-h-[100px]"
                        placeholder="Enter features as comma-separated list"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="lg:px-[66px] lg:py-[21px] py-2 px-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-[60px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`lg:px-[66px] lg:py-[15px] py-2 px-3 bg-[#79B833] text-sm font-bold text-white rounded-[60px] ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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
