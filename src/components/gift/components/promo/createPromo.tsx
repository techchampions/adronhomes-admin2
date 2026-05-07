// PromoFormPage.tsx - Creation only (no editing)
import React from "react";
import { useNavigate } from "react-router-dom";
import PromoForm from "./PromoForm";
import PromoFormPage from "./PromoFormPage";
import { resetForm } from "../../../Redux/gift/promo/promoFormSlice";
import { AppDispatch } from "../../../Redux/store";
import { useDispatch } from "react-redux";

function CreatePromoFormPage() {
  const navigate = useNavigate();
 const dispatch = useDispatch<AppDispatch>();
 
  const handleCancel = () => {
    navigate("/promotions");
  };

  const handleSuccess = () => {
    console.log("Promotion created successfully");
      dispatch(resetForm());
    navigate("/promotions");
  };

  return (
    <div className="container mx-auto py-8 bg-white">
      <PromoForm
        editingData={null}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
        isEditingcondition={false}
      />
    </div>
  );
}

export default CreatePromoFormPage;