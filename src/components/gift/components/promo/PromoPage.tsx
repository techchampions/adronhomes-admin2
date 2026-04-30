// PromoPage.tsx - Single promotion view page (USING YOUR COLOR SYSTEM)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaGift,
  FaBuilding,
  FaTimesCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaPercentage,
  FaMoneyBillWave,
  FaCube,
  FaChartLine,
  FaTag,
} from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import LoadingAnimations from "../../../LoadingAnimations";
import ConfirmationModal from "../../../Modals/delete";
import {
  selectCurrentPromo,
  selectIsLoading,
  fetchPromoById,
  deletePromo,
  selectError,
  togglePromoStatus, // Import togglePromoStatus
  selectSinglePromoLoading,
  removePropertyFromPromotion,
} from "../../../Redux/gift/promo/promoSlice";
import { AppDispatch } from "../../../Redux/store";
import Header from "../../../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../../firstcard";

// Helper component for info tooltips
const InfoTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-2">
    <FaInfoCircle className="text-[#8F8F8F] text-xs cursor-help" />
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#272727] text-white text-xs rounded-lg whitespace-nowrap z-20 hidden group-hover:block">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#272727]"></div>
    </div>
  </div>
);

interface RewardItem {
  id: number;
  item_name: string;
  qty: number;
  item_price: number;
  item_id: string;
}

interface RewardGroup {
  id: number;
  logic: "AND" | "OR";
  items: RewardItem[];
}

interface Tier {
  id: number;
  name: string;
  trigger_amount: number | null;
  percentage: number | null;
  reward_groups: RewardGroup[];
}

interface Property {
  id: number;
  name: string;
  display_image: string;
  price: number;
  street_address: string;
  is_sold: number;
  is_active: number;
  status: string;
}

interface Promotion {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  is_active: number; // Add this field
  properties: Property[];
  tiers: Tier[];
}

export default function PromoSinglePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const promoData = useSelector(selectCurrentPromo);
  const isLoading = useSelector(selectSinglePromoLoading);
  const error = useSelector(selectError);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tiers" | "properties">("tiers");
  const [togglingStatusId, setTogglingStatusId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchPromoById(id));
    }
  }, [dispatch, id]);

  const promo: Promotion | null = (() => {
    if (!promoData) return null;
    if ((promoData as any).data) return (promoData as any).data;
    if ((promoData as any).id) return promoData as unknown as Promotion;
    return null;
  })();

  const handleEdit = () => navigate(`/promotions/edit/${id}`);
  const handleDelete = async () => {
    if (!id) return;
    const result = await dispatch(deletePromo(id));
    if (deletePromo.fulfilled.match(result)) {
      navigate("/promotions");
    }
    setDeleteModalOpen(false);
  };
  const handleBack = () => navigate("/promotions");

  // Add toggle status handler
  const handleToggleStatus = async (
    e: React.MouseEvent,
    promoItem: Promotion,
  ) => {
    e.stopPropagation();

    // Don't allow toggling if already toggling
    if (togglingStatusId === promoItem.id) return;

    setTogglingStatusId(promoItem.id);

    try {
      // Dispatch the toggle action
      await dispatch(togglePromoStatus(promoItem.id.toString())).unwrap();
      // Refresh the promotion data to show updated status
      if (id) {
        await dispatch(fetchPromoById(id));
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
    } finally {
      setTogglingStatusId(null);
    }
  };

  // Get status badge for promotion
  const getStatusBadge = (promoItem: Promotion) => {
    if (promoItem.is_active === 1) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          Active
        </span>
      );
    }
    if (promoItem.is_active === 0) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          Disabled
        </span>
      );
    }

    return (
      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
        Draft
      </span>
    );
  };

  // Calculate promotion status with clear explanation
  const getPromotionStatus = () => {
    const hasProperties = promo?.properties?.length! > 0;
    const hasTiers = promo?.tiers?.length! > 0;

    if (hasProperties && hasTiers) {
      return {
        text: "Active",
        subtext: "This promotion is active and customers can earn rewards",
        color: "bg-[#EFFFDE] border-[#79B833]",
        badgeColor: "#79B833",
        icon: <FaCheckCircle className="text-[#79B833]" />,
      };
    } else if (!hasTiers) {
      return {
        text: "Setup Incomplete",
        subtext: "Add reward levels to start giving customers rewards",
        color: "bg-[#f5f5f5] border-[#8F8F8F]",
        badgeColor: "#8F8F8F",
        icon: <FaGift className="text-[#8F8F8F]" />,
      };
    } else if (!hasProperties) {
      return {
        text: "No Properties Linked",
        subtext:
          "Link properties to know which properties this promotion applies to",
        color: "bg-[#f5f5f5] border-[#8F8F8F]",
        badgeColor: "#8F8F8F",
        icon: <FaBuilding className="text-[#8F8F8F]" />,
      };
    }
    return {
      text: "Draft",
      subtext: "Complete both sections above to activate",
      color: "bg-[#f5f5f5] border-[#8F8F8F]",
      badgeColor: "#8F8F8F",
      icon: null,
    };
  };
  // Add state for tracking which property is being removed
  const [removingPropertyId, setRemovingPropertyId] = useState<number | null>(
    null,
  );

  // Add confirmation modal state for property removal
  const [propertyDeleteModalOpen, setPropertyDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Handler for removing a property from promotion
  const handleRemoveProperty = async (propertyId: number) => {
    // Find the property to show in confirmation
    const property = promo?.properties?.find((p) => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setPropertyDeleteModalOpen(true);
    }
  };

  // Confirm removal function
  const confirmRemoveProperty = async () => {
    if (!selectedProperty || !promo?.id) return;

    setRemovingPropertyId(selectedProperty.id);

    try {
      // Call your API to remove property from promotion
      // This depends on your API structure
      await dispatch(
        removePropertyFromPromotion({
          promo_id: promo.id,
          property_id: selectedProperty.id,
        }),
      ).unwrap();

      // Refresh the promotion data
      if (id) {
        await dispatch(fetchPromoById(id));
      }

      // Close modal
      setPropertyDeleteModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error("Failed to remove property:", error);
    } finally {
      setRemovingPropertyId(null);
    }
  };

  const status = getPromotionStatus();
  const isActive = promo?.is_active === 1;
  const showToggle = promo?.is_active !== undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F6F8] flex items-center justify-center">
        <LoadingAnimations loading={isLoading} />
      </div>
    );
  }

  if (error || !promo) {
    return (
      <div className="min-h-screen bg-[#F6F6F8] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-[#f5f5f5] p-10 max-w-md text-center">
          <FaTimesCircle className="text-6xl text-[#8F8F8F] mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-[#272727] mb-3">
            {error ? "Oops! Something went wrong" : "Promotion Not Found"}
          </h3>
          <p className="text-[#717171] mb-8">
            {error ||
              "We couldn't find the promotion you're looking for. It might have been deleted or the link is incorrect."}
          </p>
          <button
            onClick={handleBack}
            className="px-8 py-3.5 bg-[#79B833] hover:bg-[#6aa82a] text-white rounded-xl font-medium transition-all flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Back to All Promotions
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Promotion"
        description="Are you sure you want to delete this promotion? This action cannot be undone. All reward data will be lost."
        subjectName={promo.name}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={isLoading}
        confirmButtonText="Yes, Delete"
        cancelButtonText="No, Keep It"
      />

      <div className="min-h-screen bg-[#F6F6F8]">
        {/* Simple Sticky Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-[#f5f5f5] sticky top-0 z-10 shadow-sm">
          <div className="mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left section - Back button and Title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-[#F6F6F8] rounded-xl transition-colors flex-shrink-0"
              >
                <FaArrowLeft className="text-lg sm:text-xl text-[#717171]" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#272727] tracking-tight truncate">
                  {promo.name}
                </h1>
                <p className="text-xs text-[#8F8F8F] mt-0.5">
                  Promotion ID: #{promo.id}
                </p>
              </div>
            </div>

            {/* Right section - Actions - Wraps on mobile */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Status Badge - Hidden on very small screens? Or keep it */}
              <div
                className={`px-3 sm:px-4 py-2 rounded-xl ${status.color} border hidden sm:block`}
              >
                <div className="flex items-center gap-2">
                  {status.icon}
                  <div>
                    <p className="text-sm font-semibold text-[#272727]">
                      {status.text}
                    </p>
                    <p className="text-xs text-[#717171] hidden md:block">
                      {status.subtext}
                    </p>
                  </div>
                </div>
              </div>

              {/* Compact status for mobile */}
              <div
                className={`px-3 py-1.5 rounded-lg ${status.color} border sm:hidden`}
              >
                <div className="flex items-center gap-1.5">
                  {status.icon}
                  <p className="text-xs font-semibold text-[#272727]">
                    {status.text}
                  </p>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEdit}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white border-2 border-[#f5f5f5] hover:border-[#79B833] rounded-xl text-xs sm:text-sm font-medium text-[#272727] transition-all hover:shadow-md whitespace-nowrap"
              >
                <MdEdit className="text-base sm:text-lg" />
                <span className="hidden sm:inline">Edit</span>
              </button>

              {/* Delete Button */}
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white border-2 border-[#f5f5f5] hover:bg-red-50 hover:border-[#D70E0E] text-[#D70E0E] rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
              >
                <MdDelete className="text-base sm:text-lg" />
                <span className="hidden sm:inline">Delete</span>
              </button>

              {/* Status Badge and Toggle Switch */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Show status badge here for mobile? Already have above, so maybe hide this one */}
                <div className="hidden lg:flex items-center gap-2">
                  {getStatusBadge(promo)}
                </div>

                {showToggle && (
                  <div className="flex items-center gap-2">
                    {/* Show status text for mobile next to toggle */}
                    <span
                      className={`text-xs font-medium lg:hidden ${isActive ? "text-[#79B833]" : "text-[#8F8F8F]"}`}
                    >
                      {isActive ? "Active" : "Disabled"}
                    </span>

                    <button
                      onClick={(e) => handleToggleStatus(e, promo)}
                      disabled={togglingStatusId === promo.id}
                      className={`
              relative inline-flex h-5 sm:h-6 w-9 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:ring-offset-2 flex-shrink-0
              ${isActive ? "bg-[#79B833]" : "bg-gray-300"}
              ${togglingStatusId === promo.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
                    >
                      <span
                        className={`
                inline-block h-3.5 sm:h-4 w-3.5 sm:w-4 transform rounded-full bg-white transition-transform
                ${isActive ? "translate-x-5 sm:translate-x-6" : "translate-x-1"}
              `}
                      />
                      {togglingStatusId === promo.id && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-2.5 sm:h-3 w-2.5 sm:w-3 border-2 border-white border-t-transparent"></div>
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <MatrixCardGreen
              title="Total Tiers"
              change="Reward tiers in this promotion"
              value={promo.tiers?.length || 0}
            />
            <MatrixCard
              title="Total Properties"
              value={promo.properties?.length || 0}
              change="Properties linked to this promotion"
            />
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#f5f5f5] overflow-hidden">
            {/* Simple Tabs */}
            <div className="border-b border-[#f5f5f5] bg-[#F6F6F8]/30">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("tiers")}
                  className={`flex-1 md:flex-none px-6 py-4 font-semibold text-base transition-all relative ${
                    activeTab === "tiers"
                      ? "text-[#79B833] border-b-2 border-[#79B833] bg-white"
                      : "text-[#717171] hover:text-[#272727]"
                  }`}
                >
                  <FaGift className="inline mr-2 text-lg" />
                  Reward Levels ({promo.tiers?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("properties")}
                  className={`flex-1 md:flex-none px-6 py-4 font-semibold text-base transition-all relative ${
                    activeTab === "properties"
                      ? "text-[#79B833] border-b-2 border-[#79B833] bg-white"
                      : "text-[#717171] hover:text-[#272727]"
                  }`}
                >
                  <FaBuilding className="inline mr-2 text-lg" />
                  Properties ({promo.properties?.length || 0})
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* ====================== REWARDS SECTION ====================== */}
              {activeTab === "tiers" && (
                <div>
                  {promo.tiers && promo.tiers.length > 0 ? (
                    <div className="space-y-6">
                      {promo.tiers.map((tier, index) => (
                        <div
                          key={tier.id}
                          className="bg-white border border-[#f5f5f5] rounded-xl overflow-hidden hover:shadow-md transition-all"
                        >
                          {/* Tier Header - Simple and Clear */}
                          <div className="bg-[#79B833] px-6 py-5">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <FaGift className="text-white text-xl" />
                                  <h3 className="text-xl font-bold text-white">
                                    Reward Level {index + 1}
                                  </h3>
                                </div>
                                {tier.name && (
                                  <p className="text-white/90 text-sm mt-1">
                                    {tier.name}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-white/70">
                                  Level ID
                                </div>
                                <div className="text-white font-mono text-sm">
                                  #{tier.id}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Reward Rules - Easy to Understand */}
                          <div className="p-6 border-b border-[#f5f5f5]">
                            <div className="grid md:grid-cols-2 gap-6">
                              {tier.trigger_amount && (
                                <div className="bg-[#F6F6F8] rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FaMoneyBillWave className="text-[#79B833]" />
                                    <p className="text-sm font-semibold text-[#272727]">
                                      Customer Must Spend:
                                    </p>
                                  </div>
                                  <p className="text-3xl font-bold text-[#79B833]">
                                    ₦{tier.trigger_amount.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-[#717171] mt-1">
                                    Minimum purchase amount to qualify
                                  </p>
                                </div>
                              )}
                              {tier.percentage && (
                                <div className="bg-[#EFFFDE] rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FaPercentage className="text-[#79B833]" />
                                    <p className="text-sm font-semibold text-[#272727]">
                                      Reward Earned:
                                    </p>
                                  </div>
                                  <p className="text-3xl font-bold text-[#79B833]">
                                    {tier.percentage}% OFF
                                  </p>
                                  <p className="text-xs text-[#717171] mt-1">
                                    Discount on future purchases
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Reward Items - What they actually get */}
                          <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <FaCube className="text-[#717171]" />
                              <h4 className="font-semibold text-[#272727]">
                                What Customers Receive:
                              </h4>
                            </div>

                            {tier.reward_groups?.length > 0 ? (
                              <div className="space-y-4">
                                {tier.reward_groups.map((group, gIndex) => (
                                  <div
                                    key={group.id}
                                    className="bg-[#F6F6F8] rounded-xl p-5"
                                  >
                                    <div className="flex items-center justify-between mb-4">
                                      <p className="text-sm font-medium text-[#272727]">
                                        Reward Package {gIndex + 1}
                                      </p>
                                      <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                                          group.logic === "AND"
                                            ? "bg-[#EFFFDE] text-[#79B833]"
                                            : "bg-[#f5f5f5] text-[#8F8F8F]"
                                        }`}
                                      >
                                        {group.logic === "AND"
                                          ? "Must Get ALL Items"
                                          : "Choose ONE Item"}
                                        <InfoTooltip
                                          text={
                                            group.logic === "AND"
                                              ? "Customer receives ALL items in this package"
                                              : "Customer can choose ONE item from this package"
                                          }
                                        />
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {group.items.map((item) => (
                                        <div
                                          key={item.id}
                                          className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm border border-[#f5f5f5]"
                                        >
                                          <div>
                                            <p className="font-medium text-[#272727]">
                                              {item.item_name}
                                            </p>
                                            <p className="text-xs text-[#8F8F8F] mt-0.5">
                                              Item ID: {item.item_id}
                                            </p>
                                          </div>
                                          <div className="text-center bg-[#EFFFDE] px-3 py-1 rounded-lg">
                                            <p className="text-xs text-[#717171]">
                                              Quantity
                                            </p>
                                            <p className="text-xl font-bold text-[#79B833]">
                                              {item.qty}
                                            </p>
                                            <p className="text-xs text-[#717171]">
                                              Item Price
                                            </p>
                                            <p className="text-xl font-bold text-[#79B833]">
                                              ₦{item.item_price.toFixed(2)}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 bg-[#F6F6F8] rounded-xl">
                                <p className="text-[#717171]">
                                  No items configured for this reward level yet.
                                </p>
                                <p className="text-xs text-[#8F8F8F] mt-1">
                                  Click Edit to add reward items
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-[#F6F6F8] rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaGift className="text-4xl text-[#8F8F8F]" />
                      </div>
                      <p className="text-xl font-medium text-[#272727] mb-2">
                        No Reward Levels Yet
                      </p>
                      <p className="text-[#717171] mb-6 max-w-md mx-auto">
                        This promotion doesn't have any rewards defined yet. Add
                        reward levels to start offering customers benefits when
                        they shop.
                      </p>
                      <button
                        onClick={handleEdit}
                        className="px-6 py-3 bg-[#79B833] hover:bg-[#6aa82a] text-white rounded-xl font-medium transition-all inline-flex items-center gap-2"
                      >
                        <FaGift /> Add Reward Levels
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ====================== PROPERTIES SECTION ====================== */}
              {activeTab === "properties" && (
                <div>
                  {promo.properties && promo.properties.length > 0 ? (
                    <>
                      <p className="text-[#717171] mb-6 text-sm">
                        These properties are offering this promotion. Customers
                        shopping at these locations can earn the rewards shown
                        above.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {promo.properties.map((property: any) => (
                          <div
                            key={property.id}
                            className="bg-white rounded-xl overflow-hidden border border-[#f5f5f5] hover:border-[#79B833] hover:shadow-md transition-all group relative"
                          >
                            {/* Delete Button - Absolute positioned */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add your delete property handler here
                                handleRemoveProperty(property.id);
                              }}
                              className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-red-50 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                              title="Remove property from promotion"
                            >
                              <MdDelete className="text-red-600 text-lg" />
                            </button>

                            <div
                              onClick={() =>
                                navigate(`/properties/${property.id}`)
                              }
                              className="cursor-pointer"
                            >
                              <div className="h-48 overflow-hidden bg-[#F6F6F8]">
                                <img
                                  src={
                                    property.display_image?.replace(
                                      /\\/g,
                                      "",
                                    ) || "/default-property-image.jpg"
                                  }
                                  alt={property.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="p-5">
                                <h4 className="font-bold text-lg text-[#272727] mb-2 group-hover:text-[#79B833] transition-colors">
                                  {property.name}
                                </h4>
                                <p className="text-sm text-[#717171] mb-4 line-clamp-2">
                                  {property.street_address}
                                </p>

                                <div className="flex justify-between items-center pt-3 border-t border-[#f5f5f5]">
                                  <div>
                                    <p className="text-xs text-[#8F8F8F]">
                                      Property Price
                                    </p>
                                    <p className="text-xl font-bold text-[#79B833]">
                                      ₦{property.price?.toLocaleString()}
                                    </p>
                                  </div>
                                  <span
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                      property.is_sold
                                        ? "bg-red-50 text-[#D70E0E]"
                                        : property.is_active === 1
                                          ? "bg-[#EFFFDE] text-[#79B833]"
                                          : "bg-[#F6F6F8] text-[#8F8F8F]"
                                    }`}
                                  >
                                    {property.is_sold
                                      ? "Sold"
                                      : property.is_active === 1
                                        ? "Active"
                                        : "Inactive"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-[#F6F6F8] rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBuilding className="text-4xl text-[#8F8F8F]" />
                      </div>
                      <p className="text-xl font-medium text-[#272727] mb-2">
                        No Properties Linked
                      </p>
                      <p className="text-[#717171] mb-6 max-w-md mx-auto">
                        This promotion isn't active at any properties yet. Link
                        properties to start offering these rewards to customers.
                      </p>
                      <button
                        onClick={() => navigate("/properties")}
                        className="px-6 py-3 bg-[#79B833] hover:bg-[#6aa82a] text-white rounded-xl font-medium transition-all inline-flex items-center gap-2"
                      >
                        <FaBuilding /> Link Properties
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <ConfirmationModal
          isOpen={propertyDeleteModalOpen}
          title="Remove Property"
          description="Are you sure you want to remove this property from the promotion? Customers at this property will no longer be able to earn these rewards."
          subjectName={selectedProperty?.name || ""}
          onClose={() => {
            setPropertyDeleteModalOpen(false);
            setSelectedProperty(null);
          }}
          onConfirm={confirmRemoveProperty}
          loading={removingPropertyId !== null}
          confirmButtonText="Yes, Remove"
          cancelButtonText="No, Keep It"
        />
      </div>
    </>
  );
}
