// GiftFormPage.tsx - Updated to handle URL params for editing - FIXED DATA TRANSFORMATION
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import GiftForm from "../GiftForm";
import { AppDispatch, RootState } from "../../Redux/store";
import { fetchGiftById } from "../../Redux/gift/gift_thunk";
import { resetForm, setEditingMode } from "../../Redux/gift/giftFormSlice";
import LoadingAnimations from "../../LoadingAnimations";

function EditGiftFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [editingGift, setEditingGift] = useState<{
    id: string;
    data: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch gift data if editing (URL has id)
  useEffect(() => {
    const loadGiftForEditing = async () => {
      if (id) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await dispatch(fetchGiftById(parseInt(id))).unwrap();

          if (response.success && response.data) {
            const gift = response.data;

            // FIXED: Transform API data to the format expected by GiftForm
            // The GiftForm expects fields like 'name', 'type', etc., NOT 'gift.name'
            const transformedData = {
              name: gift.gift?.name || "",
              type: gift.gift?.type || "",
              estimated_value: gift.gift?.estimated_value || "",
              total_quantity: gift.gift?.total_quantity || "",
              quantity_per_property: gift.gift?.quantity_per_property || "",
              remaining_quantity: gift.gift?.remaining_quantity || "",
              claimed_count: gift.gift?.claimed_count || 0,
              measurement_unit: gift.gift?.measurement_unit || "",
              start_date: gift.gift?.start_date
                ? gift.gift.start_date.split("T")[0]
                : "",
              end_date: gift.gift?.end_date
                ? gift.gift.end_date.split("T")[0]
                : "",
              description: gift.gift?.description || "",
              redemption_instructions: gift.gift?.redemption_instructions || "",
              terms_and_conditions: gift.gift?.terms_and_conditions || "",
              status: gift.gift?.status || "active",
              display_image: gift.gift?.display_image || "",
              metadata: gift.gift?.metadata || {
                brand: "",
                warranty_period: "",
                installation_included: "false",
              },
            };

            setEditingGift({ id: id, data: transformedData });
          } else {
            setError("Gift not found");
          }
        } catch (err: any) {
          console.error("Failed to fetch gift:", err);
          setError(err.message || "Failed to load gift data");
        } finally {
          setIsLoading(false);
        }
      } else {
        // Reset form for new gift
        dispatch(resetForm());
        setEditingGift(null);
      }
    };

    loadGiftForEditing();
  }, [id, dispatch]);

  const handleCancel = () => {
    setEditingGift(null);
    navigate("/gifts");
  };

  const handleSuccess = () => {
    console.log("Operation successful");
    setEditingGift(null);
    navigate("/gifts");
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
            onClick={() => navigate("/gifts")}
            className="mt-4 px-4 py-2 bg-[#79B833] text-white rounded-full hover:bg-[#6aa82a]"
          >
            Back to Gifts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 bg-white">
      <GiftForm
        editingData={editingGift}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
        isEditingcondition={!!editingGift}
      />
    </div>
  );
}

export default EditGiftFormPage;