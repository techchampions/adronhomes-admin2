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
  FaTag
} from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import LoadingAnimations from "../../../LoadingAnimations";
import ConfirmationModal from "../../../Modals/delete";
import { 
  selectCurrentPromo, 
  selectIsLoading, 
  fetchPromoById, 
  deletePromo, 
  selectError 
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
  item_id: string;
}

interface RewardGroup {
  id: number;
  logic: 'AND' | 'OR';
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
  properties: Property[];
  tiers: Tier[];
}

export default function PromoSinglePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const promoData = useSelector(selectCurrentPromo);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tiers' | 'properties'>('tiers');

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
      navigate('/promotions');
    }
    setDeleteModalOpen(false);
  };
  const handleBack = () => navigate('/promotions');

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
        icon: <FaCheckCircle className="text-[#79B833]" />
      };
    } else if (!hasTiers) {
      return {
        text: "Setup Incomplete",
        subtext: "Add reward levels to start giving customers rewards",
        color: "bg-[#f5f5f5] border-[#8F8F8F]",
        badgeColor: "#8F8F8F",
        icon: <FaGift className="text-[#8F8F8F]" />
      };
    } else if (!hasProperties) {
      return {
        text: "No Properties Linked",
        subtext: "Link properties to know which properties this promotion applies to",
        color: "bg-[#f5f5f5] border-[#8F8F8F]",
        badgeColor: "#8F8F8F",
        icon: <FaBuilding className="text-[#8F8F8F]" />
      };
    }
    return {
      text: "Draft",
      subtext: "Complete both sections above to activate",
      color: "bg-[#f5f5f5] border-[#8F8F8F]",
      badgeColor: "#8F8F8F",
      icon: null
    };
  };

  const status = getPromotionStatus();

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
            {error || "We couldn't find the promotion you're looking for. It might have been deleted or the link is incorrect."}
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
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-[#F6F6F8] rounded-xl transition-colors"
              >
                <FaArrowLeft className="text-xl text-[#717171]" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#272727] tracking-tight">{promo.name}</h1>
                <p className="text-xs text-[#8F8F8F] mt-0.5">Promotion ID: #{promo.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Badge with Explanation */}
              <div className={`px-4 py-2 rounded-xl ${status.color} border`}>
                <div className="flex items-center gap-2">
                  {status.icon}
                  <div>
                    <p className="text-sm font-semibold text-[#272727]">{status.text}</p>
                    <p className="text-xs text-[#717171]">{status.subtext}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#f5f5f5] hover:border-[#79B833] rounded-xl text-sm font-medium text-[#272727] transition-all hover:shadow-md"
              >
                <MdEdit className="text-lg" /> Edit
              </button>

              <button
                onClick={() => setDeleteModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#f5f5f5] hover:bg-red-50 hover:border-[#D70E0E] text-[#D70E0E] rounded-xl text-sm font-medium transition-all"
              >
                <MdDelete className="text-lg" /> Delete
              </button>
            </div>
          </div>
        </div>

        <div className=" mx-auto px-6 py-8">
          {/* Simple Explanation Cards for Non-Technical Users */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* What are Rewards? Card */}
            {/* <div className="bg-[#79B833] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FaGift className="text-3xl" />
                    <FaTag className="text-2xl opacity-80" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Reward Levels</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    These are the rewards customers earn when they spend money in your properties. 
                    Each level has its own rules (like "spend ₦50,000 get 10% off").
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{promo.tiers?.length || 0}</div>
                  <p className="text-xs text-white/80 mt-1">Active Levels</p>
                </div>
              </div>
            </div> */}
  {/* <div className="grid md:grid-cols-2 gap-6 mb-12"> */}
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
          {/* </div> */}
            {/* What are Properties? Card */}
            {/* <div className="bg-[#272727] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FaBuilding className="text-3xl" />
                    <FaChartLine className="text-2xl opacity-80" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Linked Properties</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    These are the properties where this promotion is active. Customers shopping 
                    at these properties can earn the rewards shown above.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{promo.properties?.length || 0}</div>
                  <p className="text-xs text-white/70 mt-1">Active Properties</p>
                </div>
              </div>
            </div> */}
          </div>

          {/* How This Promotion Works - Simple Explanation */}
          {/* <div className="bg-white rounded-2xl shadow-sm border border-[#f5f5f5] p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#EFFFDE] rounded-xl flex items-center justify-center">
                <FaInfoCircle className="text-[#79B833] text-xl" />
              </div>
              <h2 className="text-xl font-bold text-[#272727]">How This Promotion Works</h2>
            </div>
            <p className="text-[#4F4F4F] leading-relaxed">
              When customers shop at <strong className="text-[#79B833]">{promo.properties?.length || 0} property(s)</strong> linked to this promotion, 
              they can earn <strong className="text-[#79B833]">{promo.tiers?.length || 0} different reward level(s)</strong>. 
              Each reward level has its own spending target and reward. For example: 
              <strong className="block mt-2 text-sm bg-[#F6F6F8] p-3 rounded-lg text-[#272727]">
                💡 "Spend ₦50,000 and get 10% off your next purchase"
              </strong>
            </p>
          </div> */}

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#f5f5f5] overflow-hidden">
            {/* Simple Tabs */}
            <div className="border-b border-[#f5f5f5] bg-[#F6F6F8]/30">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('tiers')}
                  className={`flex-1 md:flex-none px-6 py-4 font-semibold text-base transition-all relative ${
                    activeTab === 'tiers'
                      ? 'text-[#79B833] border-b-2 border-[#79B833] bg-white'
                      : 'text-[#717171] hover:text-[#272727]'
                  }`}
                >
                  <FaGift className="inline mr-2 text-lg" />
                  Reward Levels ({promo.tiers?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`flex-1 md:flex-none px-6 py-4 font-semibold text-base transition-all relative ${
                    activeTab === 'properties'
                      ? 'text-[#79B833] border-b-2 border-[#79B833] bg-white'
                      : 'text-[#717171] hover:text-[#272727]'
                  }`}
                >
                  <FaBuilding className="inline mr-2 text-lg" />
                  Properties ({promo.properties?.length || 0})
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* ====================== REWARDS SECTION ====================== */}
              {activeTab === 'tiers' && (
                <div>
                  {promo.tiers && promo.tiers.length > 0 ? (
                    <div className="space-y-6">
                      {promo.tiers.map((tier, index) => (
                        <div key={tier.id} className="bg-white border border-[#f5f5f5] rounded-xl overflow-hidden hover:shadow-md transition-all">
                          {/* Tier Header - Simple and Clear */}
                          <div className="bg-[#79B833] px-6 py-5">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <FaGift className="text-white text-xl" />
                                  <h3 className="text-xl font-bold text-white">Reward Level {index + 1}</h3>
                                </div>
                                {tier.name && (
                                  <p className="text-white/90 text-sm mt-1">{tier.name}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-white/70">Level ID</div>
                                <div className="text-white font-mono text-sm">#{tier.id}</div>
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
                                    <p className="text-sm font-semibold text-[#272727]">Customer Must Spend:</p>
                                  </div>
                                  <p className="text-3xl font-bold text-[#79B833]">
                                    ₦{tier.trigger_amount.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-[#717171] mt-1">Minimum purchase amount to qualify</p>
                                </div>
                              )}
                              {tier.percentage && (
                                <div className="bg-[#EFFFDE] rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FaPercentage className="text-[#79B833]" />
                                    <p className="text-sm font-semibold text-[#272727]">Reward Earned:</p>
                                  </div>
                                  <p className="text-3xl font-bold text-[#79B833]">
                                    {tier.percentage}% OFF
                                  </p>
                                  <p className="text-xs text-[#717171] mt-1">Discount on future purchases</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Reward Items - What they actually get */}
                          <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <FaCube className="text-[#717171]" />
                              <h4 className="font-semibold text-[#272727]">What Customers Receive:</h4>
                            </div>

                            {tier.reward_groups?.length > 0 ? (
                              <div className="space-y-4">
                                {tier.reward_groups.map((group, gIndex) => (
                                  <div key={group.id} className="bg-[#F6F6F8] rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                      <p className="text-sm font-medium text-[#272727]">
                                        Reward Package {gIndex + 1}
                                      </p>
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        group.logic === 'AND' 
                                          ? 'bg-[#EFFFDE] text-[#79B833]' 
                                          : 'bg-[#f5f5f5] text-[#8F8F8F]'
                                      }`}>
                                        {group.logic === 'AND' ? 'Must Get ALL Items' : 'Choose ONE Item'}
                                        <InfoTooltip text={group.logic === 'AND' 
                                          ? "Customer receives ALL items in this package" 
                                          : "Customer can choose ONE item from this package"
                                        } />
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {group.items.map((item) => (
                                        <div key={item.id} className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm border border-[#f5f5f5]">
                                          <div>
                                            <p className="font-medium text-[#272727]">{item.item_name}</p>
                                            <p className="text-xs text-[#8F8F8F] mt-0.5">Item ID: {item.item_id}</p>
                                          </div>
                                          <div className="text-center bg-[#EFFFDE] px-3 py-1 rounded-lg">
                                            <p className="text-xs text-[#717171]">Quantity</p>
                                            <p className="text-xl font-bold text-[#79B833]">{item.qty}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 bg-[#F6F6F8] rounded-xl">
                                <p className="text-[#717171]">No items configured for this reward level yet.</p>
                                <p className="text-xs text-[#8F8F8F] mt-1">Click Edit to add reward items</p>
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
                      <p className="text-xl font-medium text-[#272727] mb-2">No Reward Levels Yet</p>
                      <p className="text-[#717171] mb-6 max-w-md mx-auto">
                        This promotion doesn't have any rewards defined yet. Add reward levels to start offering customers benefits when they shop.
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
              {activeTab === 'properties' && (
                <div>
                  {promo.properties && promo.properties.length > 0 ? (
                    <>
                      <p className="text-[#717171] mb-6 text-sm">
                        These properties are offering this promotion. Customers shopping at these locations can earn the rewards shown above.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {promo.properties.map((property: any) => (
                          <div
                            key={property.id}
                            onClick={() => navigate(`/properties/${property.id}`)}
                            className="bg-white rounded-xl overflow-hidden border border-[#f5f5f5] hover:border-[#79B833] hover:shadow-md transition-all cursor-pointer group"
                          >
                            <div className="h-48 overflow-hidden bg-[#F6F6F8]">
                              <img
                                src={property.display_image?.replace(/\\/g, '') || '/default-property-image.jpg'}
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
                                  <p className="text-xs text-[#8F8F8F]">Property Price</p>
                                  <p className="text-xl font-bold text-[#79B833]">
                                    ₦{property.price?.toLocaleString()}
                                  </p>
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                  property.is_sold 
                                    ? 'bg-red-50 text-[#D70E0E]' 
                                    : property.is_active === 1
                                    ? 'bg-[#EFFFDE] text-[#79B833]'
                                    : 'bg-[#F6F6F8] text-[#8F8F8F]'
                                }`}>
                                  {property.is_sold ? 'Sold' : property.is_active === 1 ? 'Active' : 'Inactive'}
                                </span>
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
                      <p className="text-xl font-medium text-[#272727] mb-2">No Properties Linked</p>
                      <p className="text-[#717171] mb-6 max-w-md mx-auto">
                        This promotion isn't active at any properties yet. Link properties to start offering these rewards to customers.
                      </p>
                      <button
                        onClick={() => navigate('/properties')}
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
      </div>
    </>
  );
}