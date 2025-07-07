"use client";

import { useState, useEffect } from "react";
import {
  FiMapPin,
  FiExternalLink,
  FiSquare,
  FiZap,
  FiActivity,
  FiCopy,
} from "react-icons/fi";
import Pagination from "../../components/Tables/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { selectSavedPropertyUsers, selectSavedPropertyUsersError, selectSavedPropertyUsersLoading, selectSavedPropertyUsersPagination, setSavedPropertyUsersCurrentPage } from "../../components/Redux/SavedPropertyUser_slice";
import { fetchSavedPropertyUsers } from "../../components/Redux/SavedPropertyUser_thunk";
import { AppDispatch } from "../../components/Redux/store";
import LoadingAnimations from "../../components/LoadingAnimations";



interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: number;
    name: string;
    display_image: string;
    photos: string[];
    size: string;
    price: number;
    type: number;
    no_of_bedroom: number | null;
    street_address: string;
    status: string;
    created_at: string | null;
    updated_at: string | null;
    total_amount: number;
    initial_deposit: number;
    is_sold: any;
    is_active: any;
    features: string[] | string;
    overview: string;
    description: string;
    virtual_tour: string | null;
    property_duration_limit: number;
    is_discount: boolean;
    discount_name: string | null;
    discount_percentage: any | null;
    discount_units: any | null;
    discount_start_date: string | null;
    discount_end_date: string | null;
    number_of_unit: any;
    unit_sold: number;
    unit_available: number;
    property_view: any;
    property_requests: any;
  };
}

export default function PropertyModal({
  isOpen,
  onClose,
  property,
}: PropertyModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch<AppDispatch>();

  // Get saved property users data from Redux store
  const savedUsers = useSelector(selectSavedPropertyUsers);
  const loading = useSelector(selectSavedPropertyUsersLoading);
  const pagination = useSelector(selectSavedPropertyUsersPagination);
  const error = useSelector(selectSavedPropertyUsersError);

  // Handle page change
const handlePageChange = (page: number) => {
  dispatch(setSavedPropertyUsersCurrentPage(page));
  dispatch(fetchSavedPropertyUsers({ propertyId: property.id, page })); 
};

// Fetch saved users when modal opens and property changes
useEffect(() => {
  if (isOpen && property.id) {
    dispatch(fetchSavedPropertyUsers({ propertyId: property.id, page: 1 })); 
  }
}, [isOpen, property.id, dispatch]);

  const propertyImages =
    property.photos.length > 0
      ? property.photos
      : ["/placeholder.svg?height=200&width=200"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + propertyImages.length) % propertyImages.length
    );
  };

  const getPropertyType = (type: number) => {
    switch (type) {
      case 1:
        return "Residential";
      case 2:
        return "Commercial";
      case 3:
        return "Land";
      default:
        return "Other";
    }
  };

  // Format saved users data for display
  const formatSavedUsers = () => {
    if (!savedUsers || savedUsers.length === 0) return [];
    
    return savedUsers.map((user) => ({
      name: `${user.saved_user.first_name} ${user.saved_user.last_name || ''}`.trim(),
      email: user.saved_user.email,
      phone: user.saved_user.phone_number,
      viewedDate: new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      avatar: null
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-[40px] overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
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

        <div className="p-6">
          {/* Header Stats */}
          <div className="flex justify-between items-center mb-8 text-sm text-gray-600">
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition w-full">
              <div className="flex flex-wrap justify-between items-center w-full">
                {/* Date Uploaded */}
                <div className="flex-1 min-w-[150px] mb-2 md:mb-0">
                  <div className="font-medium text-gray-800">Date Uploaded</div>
                  <div>
                    {property.created_at
                      ? new Date(property.created_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>

                {/* Views */}
                <div className="flex-1 min-w-[100px] mb-2 md:mb-0">
                  <div className="font-medium text-gray-800">Views</div>
                  <div>{property.property_view ?? 0}</div>
                </div>

                {/* Units Sold */}
                <div className="flex-1 min-w-[100px] mb-2 md:mb-0">
                  <div className="font-medium text-gray-800">Units Sold</div>
                  <div>{property.unit_sold ?? 0}</div>
                </div>

                {/* Units Available */}
                <div className="flex-1 min-w-[100px] mb-2 md:mb-0">
                  <div className="font-medium text-gray-800">
                    Units Available
                  </div>
                  <div>{property.unit_available ?? 0}</div>
                </div>

                {/* Requests & Reviews */}
                <div className="flex-1 min-w-[150px]">
                  <div className="font-medium text-gray-800">
                    Requests & Reviews
                  </div>
                  <div>{property.property_requests ?? 0}</div>
                </div>
              </div>
            </button>
          </div>

          {/* Property Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {property.name}
            </h1>
            <div className="flex items-center text-gray-600">
              <FiMapPin className="w-4 h-4 mr-1" />
              <span>{property.street_address}</span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              {propertyImages.map((image, index) => (
                <div
                  key={index}
                  className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    index === currentImageIndex
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Virtual Tour */}
          {property.virtual_tour && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800 mb-1">
                    Virtual Tour
                  </div>
                  <div className="text-sm text-gray-600">
                    {property.virtual_tour}
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(property.virtual_tour ?? "")
                  }
                  className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                  <FiCopy className="w-4 h-4 mr-2" />
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Property Details */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <FiSquare className="w-4 h-4 mr-1" />
                <span>{property.size || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <FiZap className="w-4 h-4 mr-1" />
                <span>5tr Lights</span>
              </div>
              <div className="flex items-center">
                <FiActivity className="w-4 h-4 mr-1" />
                <span>Gym</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                {getPropertyType(property.type)}
              </div>
              <div className="font-medium">Property Units: {property?.number_of_unit}</div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-8">
            <div className="text-4xl font-bold text-gray-900">
              ₦{property.price?.toLocaleString()}
            </div>
          </div>

          {/* Infrastructure Fees */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Infrastructure Fees
            </h3>
            <div className="text-2xl font-bold text-gray-900">
              ₦{property.initial_deposit?.toLocaleString()}
            </div>
          </div>

          {/* Overview */}
          {property.overview && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Overview
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {property.overview}
              </p>
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>
          )}

          {/* Features */}
          {property.features && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Features
              </h3>
              <ul className="space-y-2 text-gray-700">
                {Array.isArray(property.features) ? (
                  property.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))
                ) : (
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {property.features}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Address */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Address
            </h3>
            <p className="text-gray-700">{property.street_address}</p>
          </div>

          {/* Discount */}
          {property.is_discount && (
            <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Discount
              </h3>
              <div className="text-red-700">
                <div className="font-semibold">{property.discount_name}</div>
                <div className="text-sm">
                  {property.discount_percentage}% OFF above{" "}
                  {property.discount_units} units
                </div>
                <div className="text-sm">
                  From {property.discount_start_date} To{" "}
                  {property.discount_end_date}
                </div>
              </div>
            </div>
          )}

          {/* Saved By Users */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Saved By Users
            </h3>
            
            {error ? (
              <div className="text-center py-8 text-red-500">
                Error loading saved users: {error}
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center p-8">
               <LoadingAnimations loading={loading}/>
              </div>
            ) : savedUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users have saved this property yet.
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {formatSavedUsers().map((client, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-sm font-semibold text-gray-700">
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {client.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            Saved on {client.viewedDate}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>{client.email}</div>
                        <div>{client.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center space-x-2 mt-6">
                  <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    className="mt-8 mb-4"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}