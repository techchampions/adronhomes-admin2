// src/pages/Gifts/GiftDetail.tsx (Updated with badge and improved UI)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../firstcard";
import { toast } from "react-toastify";
import {
  selectCurrentGift,
  selectSingleGiftStats,
  selectGiftsLoading,
  selectGiftsError,
  clearCurrentGift,
  selectGiftPendingRequestsCount,
} from "../../Redux/gift/gift_slice";
import { fetchGiftById, fetchGiftRequests } from "../../Redux/gift/gift_thunk";
import { AppDispatch } from "../../Redux/store";
import { AssignPropertyModal } from "./Gifts/AssignPropertyModal";
import LoadingAnimations from "../../LoadingAnimations";
import GiftRequestsModal from "./Gifts/GiftRequestsModalComponent";

interface GiftProperty {
  id: number;
  giftId: number;
  propertyId: number;
  propertyName: string;
  quantity: number;
  status: string;
  assignedAt: string;
  pendingRequestsCount?: number;
   quantity_per_property : number

}

const GiftDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const gift = useSelector(selectCurrentGift);
  const stats = useSelector(selectSingleGiftStats);
  const loading = useSelector(selectGiftsLoading);
  const error = useSelector(selectGiftsError);
  const globalPendingCount = useSelector(selectGiftPendingRequestsCount);

  const [assignedProperties, setAssignedProperties] = useState<GiftProperty[]>(
    [],
  );
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<GiftProperty | null>(
    null,
  );
  const [pendingCounts, setPendingCounts] = useState<Record<number, number>>(
    {},
  );

  // Fetch gift details when component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchGiftById(parseInt(id)));
    }

    return () => {
      dispatch(clearCurrentGift());
    };
  }, [dispatch, id]);

  // Fetch pending request counts for each property
  useEffect(() => {
    const fetchPendingCounts = async () => {
      if (!assignedProperties.length) return;

      const counts: Record<number, number> = {};
      for (const property of assignedProperties) {
        try {
          const result = await dispatch(
            fetchGiftRequests({
              gift_id: gift?.id,
              property_id: property.propertyId,
              status: "pending",
            }),
          ).unwrap();
          counts[property.propertyId] = result.data.data.length;
        } catch (error) {
          counts[property.propertyId] = 0;
        }
      }
      setPendingCounts(counts);
    };

    fetchPendingCounts();
  }, [assignedProperties, gift?.id, dispatch]);

  // Transform gift properties from API response
  useEffect(() => {
    if (gift?.properties && Array.isArray(gift.properties)) {
      const transformedProperties: GiftProperty[] = gift.properties.map(
        (prop: any) => ({
          id: prop.pivot?.id || Math.random(),
          giftId: gift.id,
          propertyId: prop.pivot?.property_id || 0,
          propertyName: prop.name || "Unknown Property",
          quantity: prop.total_amount || gift.quantity_per_property || 1,
          status: prop.pivot?.fulfillment_status || "pending",
           quantity_per_property: gift.quantity_per_property,
          assignedAt:
            prop.pivot?.assigned_at ||
            prop.pivot?.created_at ||
            new Date().toISOString(),
        }),
      );
      setAssignedProperties(transformedProperties);
    } else {
      setAssignedProperties([]);
    }
  }, [gift]);

 

  const handleViewRequests = (property: GiftProperty) => {
    setSelectedProperty(property);
    setShowRequestsModal(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "fulfilled":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGiftStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "limited":
        return "bg-orange-100 text-orange-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "fulfilled", label: "Fulfilled" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Calculate statistics from properties
  const calculatedStats = {
    totalAssigned: assignedProperties.length,
    pendingCount: assignedProperties.filter((p) => p.status === "pending")
      .length,
    approvedCount: assignedProperties.filter((p) => p.status === "approved")
      .length,
    fulfilledCount: assignedProperties.filter((p) => p.status === "fulfilled")
      .length,
    cancelledCount: assignedProperties.filter((p) => p.status === "cancelled")
      .length,
    totalValue: gift
      ? (gift.estimated_value || 0) * assignedProperties.length
      : 0,
  };

  const displayStats = {
    totalAssigned:
      stats?.total_property_assigned || calculatedStats.totalAssigned,
    total_remaining: stats?.total_remaining || calculatedStats.fulfilledCount,
    total_claimed:stats?.total_claimed,
    totalValue: stats?.total_value || calculatedStats.totalValue,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingAnimations loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-[52px] relative">
        <Header title="Gift Details" subtitle="Error loading gift" />
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={() => navigate("/gifts")}
            className="mt-4 px-6 py-2 bg-[#79B833] text-white rounded-full hover:bg-[#79B833]/80 transition-colors"
          >
            Back to Gifts
          </button>
        </div>
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="mb-[52px] relative">
        <Header title="Gift Details" subtitle="Gift not found" />
        <div className="text-center py-8">
          <div className="flex flex-col items-center justify-center">
            <span className="text-6xl mb-4">🎁</span>
            <p className="text-gray-500 text-lg">Gift not found</p>
          </div>
          <button
            onClick={() => navigate("/gifts")}
            className="mt-6 px-6 py-2 bg-[#79B833] text-white rounded-full hover:bg-[#79B833]/80 transition-colors"
          >
            Back to Gifts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-[52px] relative">
      <Header
        title={gift.name || "Gift Details"}
        subtitle={`Manage ${gift.name || "gift"} details and associated properties`}
        buttonText="Assign to Property"
        onButtonClick={() => setShowAssignModal(true)}
      />

      {/* Gift Info Cards */}
      <div className="grid md:grid-cols-4 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen
          title="Total Properties"
          value={displayStats.totalAssigned}
          change="Properties with this gift"
        />
        <MatrixCard
          title="Total Value"
          value={formatCurrency(displayStats.totalValue)}
          change="Estimated total value"
        />
        <MatrixCard
          title="Total Claimed"
          value={displayStats.total_claimed}
          change="Successfully fulfilled"
        />
        <MatrixCard
          title="Total Remaining"
          value={displayStats.total_remaining}
          change="Awaiting fulfillment"
        />
      </div>

      {/* Gift Details Section */}
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-dark">Gift Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">Gift Name</p>
              <p className="text-dark font-medium text-lg">
                {gift.name || "Unnamed Gift"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Gift ID</p>
              <p className="text-dark font-medium">#{gift.id}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Gift Type</p>
              <p className="text-dark font-medium capitalize">
                {gift.type || "Standard"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Estimated Value</p>
              <p className="text-dark font-medium text-[#79B833] font-bold">
                {formatCurrency(gift.estimated_value || 0)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">
                Total Quantity Available
              </p>
              <p className="text-dark font-medium">
                {(gift.total_quantity || 0).toLocaleString()}{" "}
                {gift.measurement_unit || "unit"}
              </p>
              {gift.remaining_quantity !== undefined && (
                <p className="text-xs text-gray-400 mt-1">
                  Remaining: {(gift.remaining_quantity || 0).toLocaleString()}
                </p>
              )}
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">
                Quantity Per Property
              </p>
              <p className="text-dark font-medium">
                {gift.quantity_per_property || 0}{" "}
                {gift.measurement_unit || "unit"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Measurement Unit</p>
              <p className="text-dark font-medium">
                {gift.measurement_unit || "unit"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Claimed Count</p>
              <p className="text-dark font-medium">
                {(gift.claimed_count || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Status</p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getGiftStatusColor(gift.status)}`}
              >
                {gift.status
                  ? gift.status.charAt(0).toUpperCase() + gift.status.slice(1)
                  : "Unknown"}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Date Range</p>
              <p className="text-dark font-medium text-sm">
                {gift.start_date
                  ? new Date(gift.start_date).toLocaleDateString()
                  : "N/A"}{" "}
                -{" "}
                {gift.end_date
                  ? new Date(gift.end_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Created Date</p>
              <p className="text-dark font-medium">
                {gift.created_at
                  ? new Date(gift.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Table Section with Status Update and View Requests Button */}
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] relative">
        <div className="bg-white rounded-[30px] pt-[20px] lg:pt-[30px] pb-[20px] lg:pl-[43px] lg:pr-[61px] pl-[15px] pr-[15px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-dark">
            Associated Properties
          </h3>
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="py-4 pr-6 font-semibold text-[#757575] text-sm">
                    Property Name
                  </th>
                  <th className="py-4 px-6 font-semibold text-[#757575] text-sm">
                    Quantity Assigned
                  </th>
                  {/* <th className="py-4 px-6 font-semibold text-[#757575] text-sm">
                    Status
                  </th> */}
                  <th className="py-4 px-6 font-semibold text-[#757575] text-sm">
                    Assigned Date
                  </th>
                  <th className="py-4 pl-6 font-semibold text-[#757575] text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignedProperties.length > 0 ? (
                  assignedProperties.map((property) => {
                    const pendingCount =
                      pendingCounts[property.propertyId] || 0;
                    return (
                      <tr
                        key={property.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 pr-6 text-dark text-sm font-medium">
                          {property.propertyName}
                        </td>
                        <td className="py-4 px-6 text-dark text-sm">
                          {(property?.quantity_per_property)?.toLocaleString()} {gift.measurement_unit || "unit"}
                        </td>
                        {/* <td className="py-4 px-6 text-sm">
                          <div className="relative">
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}
                            >
                              {statusOptions.find(
                                (option) => option.value === property.status,
                              )?.label || property.status}
                            </div>
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg
                                className="w-3 h-3 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                            {updatingStatus === property.id && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#79B833]"></div>
                              </div>
                            )}
                          </div>
                        </td> */}
                        <td className="py-4 px-6 text-dark text-sm">
                          {new Date(property.assignedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 pl-6 text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                navigate(`/properties/${property.propertyId}`)
                              }
                              className="px-4 py-1.5 text-sm bg-[#79B833] text-white rounded-full hover:bg-[#79B833]/80 transition-colors truncate"
                            >
                              View Property
                            </button>
                            <div className="relative">
                              {pendingCount > 0 && (
                                <span className="absolute -top-2 left-2 inline-flex items-center justify-center px-2 py-1 z-10 text-xs font-bold leading-none text-white transform bg-red-500 rounded-full">
                                  {pendingCount}
                                </span>
                              )}
                              <button
                                onClick={() => handleViewRequests(property)}
                                className="relative px-4 py-1.5 text-sm bg-white text-[#79B833] border-[#79B83] border rounded-full hover:bg-[#79B833]/80 transition-colors flex items-center gap-1 truncate"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                View Requests
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-4xl mb-2">🏠</span>
                        <p>No properties associated with this gift</p>
                        <p className="text-sm mt-1">
                          Click "Assign to Property" to add properties
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assign Property Modal */}
      <AssignPropertyModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        giftId={gift.id}
        giftName={gift.name}
        quantityPerProperty={gift.quantity_per_property || 1}
        measurementUnit={gift.measurement_unit || "unit"}
        onAssignSuccess={() => dispatch(fetchGiftById(parseInt(id!)))}
      />

      {/* Gift Requests Modal - Shows requests for the selected property */}
      {selectedProperty && (
        <GiftRequestsModal
          isOpen={showRequestsModal}
          onClose={() => {
            setShowRequestsModal(false);
            setSelectedProperty(null);
          }}
          giftId={gift.id}
          giftName={gift.name}
          propertyId={selectedProperty.propertyId}
        />
      )}

      {/* Back Button */}
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mt-6">
        <button
          onClick={() => navigate("/gifts")}
          className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to All Gifts
        </button>
      </div>
    </div>
  );
};

export default GiftDetail;
