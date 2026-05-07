// PromoFormPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import PromoForm from "./PromoForm";
import LoadingAnimations from "../../../LoadingAnimations";
import { resetForm } from "../../../Redux/gift/giftFormSlice";
import { fetchPromoById } from "../../../Redux/gift/promo/promoSlice";
import { AppDispatch } from "../../../Redux/store";
;

function PromoFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [editingPromo, setEditingPromo] = useState<{
    id: string;
    data: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPromoForEditing = async () => {
      if (id) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await dispatch(fetchPromoById(id)).unwrap();

          if (response.success && response.data) {
            const promo = response.data;

            const transformedData = {
              promo_name: promo.name || "",
              tiers: promo.tiers?.map((tier: any) => ({
                trigger_amount: tier.trigger_amount || null,
                percentage: tier.percentage || null,
                reward_groups: tier.reward_groups?.map((group: any) => ({
                  logic: group.logic || "AND",
                  items: group.items?.map((item: any) => ({
                    item_id: item.item_id || "",
                    name: item.item_name || "",
                    qty: item.qty || 1,
                    item_price: item.item_price || 0
                  })) || [{ item_id: "", name: "", qty: 1 }],
                })) || [{ logic: "AND", items: [{ item_id: "", name: "", qty: 1 }] }],
              })) || [{
                trigger_amount: null,
                percentage: null,
                reward_groups: [{ logic: "AND", items: [{ item_id: "", name: "", qty: 1 }] }],
              }],
            };

            setEditingPromo({ id: id, data: transformedData });
          } else {
            setError("Promotion not found");
          }
        } catch (err: any) {
          console.error("Failed to fetch promo:", err);
          setError(err.message || "Failed to load promotion data");
        } finally {
          setIsLoading(false);
        }
      } else {
        dispatch(resetForm());
        setEditingPromo(null);
      }
    };

    loadPromoForEditing();
  }, [id, dispatch]);

  const handleCancel = () => {
    setEditingPromo(null);
    navigate("/promotions");
  };

  const handleSuccess = () => {
    console.log("Operation successful");
    setEditingPromo(null);
    navigate(`/promotions${editingPromo ? `/${editingPromo.id}` : ""}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 bg-white">
        <div className="flex justify-center items-center h-screen">
          <LoadingAnimations loading={isLoading} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 bg-white">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate("/promotions")}
            className="mt-4 px-4 py-2 bg-[#79B833] text-white rounded-full hover:bg-[#6aa82a]"
          >
            Back to Promotions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 bg-white">
      <PromoForm
        editingData={editingPromo}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
        isEditingcondition={!!editingPromo}
      />
    </div>
  );
}

export default PromoFormPage;