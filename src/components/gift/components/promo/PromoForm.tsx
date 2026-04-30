// PromoForm.tsx - Complete with Redux sync (no steps)
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  selectPromoFormData,
  selectIsEditing,
  selectEditingId,
  selectIsFormLoading,
  selectFormError,
  selectIsFormDirty,
} from "../../../Redux/gift/promo/promoFormSelectors";
import {
  clearDirty,
  setEditingMode,
  resetForm,
  updateField,
  updateNestedField,
  addTier,
  removeTier,
  addRewardGroup,
  removeRewardGroup,
  addRewardItem,
  removeRewardItem,
  setLoading,
  setError,
} from "../../../Redux/gift/promo/promoFormSlice";
import { Link } from "react-router-dom";
import { AppDispatch } from "../../../Redux/store";
import { createPromo, updatePromo, clearPromoSuccess } from "../../../Redux/gift/promo/promoSlice";
import InputField from "../../../input/inputtext";

interface PromoFormProps {
  editingData?: {
    id: string;
    data: any;
  } | null;
  onSubmit?: (data: any, isEditing: boolean, id?: string) => void;
  onCancel?: () => void;
  onSuccess?: () => void;
  isEditingcondition?: boolean;
}

const PromoForm: React.FC<PromoFormProps> = ({
  editingData = null,
  onSubmit,
  onCancel,
  onSuccess,
  isEditingcondition = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector(selectPromoFormData);
  const isEditing = useSelector(selectIsEditing);
  const editingId = useSelector(selectEditingId);
  const isLoading = useSelector(selectIsFormLoading);
  const formError = useSelector(selectFormError);
  const isDirty = useSelector(selectIsFormDirty);

  const [showSuccess, setShowSuccess] = useState(false);

  // Validation schema
  const validationSchema = Yup.object({
    promo_name: Yup.string()
      .required("Promotion name is required")
      .min(3, "Name must be at least 3 characters")
      .max(200, "Name must not exceed 200 characters"),
    tiers: Yup.array().of(
      Yup.object({
        trigger_amount: Yup.number()
          .nullable()
          .typeError("Must be a number")
          .min(0, "Trigger amount must be positive"),
        percentage: Yup.number()
          .nullable()
          .min(0, "Percentage must be at least 0")
          .max(100, "Percentage cannot exceed 100")
          .typeError("Must be a number"),
        reward_groups: Yup.array().of(
          Yup.object({
            logic: Yup.string().oneOf(["AND", "OR"]),
            items: Yup.array().of(
              Yup.object({
                name: Yup.string().required("Gift name is required"),
                qty: Yup.number()
                  .min(1, "Quantity must be at least 1")
                  .required("Quantity is required"),
                item_price: Yup.number()
                  .nullable()
                  .min(0, "item_price must be at least 0")
                  .typeError("Must be a number"),
              })
            ).min(1, "At least one reward item is required"),
          })
        ).min(1, "At least one reward group is required"),
      })
    ).min(1, "At least one tier is required"),
  });

  const formik = useFormik<typeof formData>({
    initialValues: formData,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      // Validate all items have names
      let hasEmptyItems = false;
      values.tiers.forEach((tier, tierIndex) => {
        tier.reward_groups.forEach((group, groupIndex) => {
          group.items.forEach((item, itemIndex) => {
            if (!item.name) {
              hasEmptyItems = true;
              formik.setFieldError(
                `tiers.${tierIndex}.reward_groups.${groupIndex}.items.${itemIndex}.name`,
                "Gift name is required"
              );
            }
          });
        });
      });

      if (hasEmptyItems) {
        return;
      }

      // Prepare submission data
      const submissionData = {
        promo_name: values.promo_name,
        tiers: values.tiers.map(tier => ({
          trigger_amount: tier.trigger_amount,
          percentage: tier.percentage,
          reward_groups: tier.reward_groups.map(group => ({
            logic: group.logic,
            items: group.items.map(item => ({
              item_id: item.item_id || item.name,
              name: item.name,
              qty: item.qty,
              item_price: item.item_price || 0
            }))
          }))
        }))
      };

      if (onSubmit) {
        await onSubmit(submissionData, isEditing, editingId || undefined);
      } else {
        // Default Redux submission
        dispatch(setLoading(true));
        dispatch(clearPromoSuccess());

        try {
          if (isEditing && editingId) {
            // Update existing promo
            const result = await dispatch(
              updatePromo({
                id: editingId,
                data: submissionData,
              })
            ).unwrap();

            if (result.success) {
              dispatch(clearDirty());
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
              if (onSuccess) onSuccess();
            }
          } else {
            // Create new promo
            const result = await dispatch(createPromo(submissionData)).unwrap();

            if (result.success) {
              dispatch(clearDirty());
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
              if (onSuccess) onSuccess();
            }
          }
        } catch (error: any) {
          dispatch(setError(error.message || "Failed to save promotion"));
        } finally {
          dispatch(setLoading(false));
        }
      }
    },
  });

  // Initialize form when editing data is provided
  useEffect(() => {
    if (editingData && editingData.data) {
      dispatch(setEditingMode({ id: editingData.id, data: editingData.data }));
    } else if (!editingData && !isEditingcondition) {
      dispatch(resetForm());
    }
  }, [editingData, dispatch, isEditingcondition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (!isEditingcondition) {
        dispatch(resetForm());
      }
    };
  }, [dispatch, isEditingcondition]);

  // Handlers
  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      const { name, value } = e.target;
      dispatch(updateField({ field: name as keyof typeof formData, value }));
      formik.setFieldValue(name, value);
      formik.setFieldTouched(name, true, false);
    },
    [dispatch, formik]
  );

  const handleAddTier = useCallback(() => {
    dispatch(addTier());
    const tiers = [...formik.values.tiers];
    tiers.push({
      trigger_amount: null,
      percentage: null,
      reward_groups: [{ logic: "AND", items: [{ item_id: "", name: "", qty: 1, item_price: 0 }] }],
    });
    formik.setFieldValue("tiers", tiers);
  }, [dispatch, formik]);

  const handleRemoveTier = useCallback(
    (index: number) => {
      dispatch(removeTier(index));
      const tiers = [...formik.values.tiers];
      tiers.splice(index, 1);
      formik.setFieldValue("tiers", tiers);
    },
    [dispatch, formik]
  );

  const handleAddRewardGroup = useCallback(
    (tierIndex: number) => {
      dispatch(addRewardGroup({ tierIndex }));
      const tiers = [...formik.values.tiers];
      tiers[tierIndex].reward_groups.push({
        logic: "AND",
        items: [{ item_id: "", name: "", qty: 1, item_price: 0 }],
      });
      formik.setFieldValue("tiers", tiers);
    },
    [dispatch, formik]
  );

  const handleRemoveRewardGroup = useCallback(
    (tierIndex: number, groupIndex: number) => {
      dispatch(removeRewardGroup({ tierIndex, groupIndex }));
      const tiers = [...formik.values.tiers];
      if (tiers[tierIndex].reward_groups.length > 1) {
        tiers[tierIndex].reward_groups.splice(groupIndex, 1);
        formik.setFieldValue("tiers", tiers);
      }
    },
    [dispatch, formik]
  );

  const handleAddItem = useCallback(
    (tierIndex: number, groupIndex: number) => {
      dispatch(addRewardItem({ tierIndex, groupIndex }));
      const tiers = [...formik.values.tiers];
      tiers[tierIndex].reward_groups[groupIndex].items.push({
        item_id: "",
        name: "",
        qty: 1,
        item_price: 0,
      });
      formik.setFieldValue("tiers", tiers);
    },
    [dispatch, formik]
  );

  const handleRemoveItem = useCallback(
    (tierIndex: number, groupIndex: number, itemIndex: number) => {
      dispatch(removeRewardItem({ tierIndex, groupIndex, itemIndex }));
      const tiers = [...formik.values.tiers];
      const items = tiers[tierIndex].reward_groups[groupIndex].items;
      if (items.length > 1) {
        items.splice(itemIndex, 1);
        formik.setFieldValue("tiers", tiers);
      }
    },
    [dispatch, formik]
  );

  const handleUpdateTier = useCallback(
    (tierIndex: number, field: string, value: any) => {
      dispatch(updateNestedField({ tierIndex, field, value }));
      const tiers = [...formik.values.tiers];
      (tiers[tierIndex] as any)[field] = value;
      formik.setFieldValue("tiers", tiers);
      formik.setFieldTouched(`tiers.${tierIndex}.${field}`, true, false);
    },
    [dispatch, formik]
  );

  const handleUpdateLogic = useCallback(
    (tierIndex: number, groupIndex: number, logic: "AND" | "OR") => {
      dispatch(updateNestedField({ tierIndex, groupIndex, field: "logic", value: logic }));
      const tiers = [...formik.values.tiers];
      tiers[tierIndex].reward_groups[groupIndex].logic = logic;
      formik.setFieldValue("tiers", tiers);
    },
    [dispatch, formik]
  );

  const handleUpdateItem = useCallback(
    (
      tierIndex: number,
      groupIndex: number,
      itemIndex: number,
      field: string,
      value: any
    ) => {
      dispatch(updateNestedField({ tierIndex, groupIndex, itemIndex, field, value }));
      const tiers = [...formik.values.tiers];
      const item = tiers[tierIndex].reward_groups[groupIndex].items[itemIndex];
      
      if (field === "name") {
        item.name = value;
        item.item_id = value;
      } else if (field === "item_id") {
        item.item_id = value;
        item.name = value;
      } else if (field === "qty") {
        item.qty = parseInt(value) || 1;
      } else if (field === "item_price") {
        item.item_price = parseFloat(value) || 0;
      }
      
      formik.setFieldValue("tiers", tiers);
      formik.setFieldTouched(
        `tiers.${tierIndex}.reward_groups.${groupIndex}.items.${itemIndex}.${field}`,
        true,
        false
      );
    },
    [dispatch, formik]
  );

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoading && formik.isValid) {
      await formik.submitForm();
    }
  };

  const getFieldError = (path: string): string | undefined => {
    const keys = path.split(".");
    let current: any = formik.errors;
    for (const key of keys) {
      if (current && typeof current === "object") {
        current = current[key];
      } else {
        return undefined;
      }
    }
    return typeof current === "string" ? current : undefined;
  };

  const getFieldTouched = (path: string): boolean => {
    const keys = path.split(".");
    let current: any = formik.touched;
    for (const key of keys) {
      if (current && typeof current === "object") {
        current = current[key];
      } else {
        return false;
      }
    }
    return !!current;
  };

  const shouldShowError = (path: string): boolean => {
    return getFieldTouched(path) && !!getFieldError(path);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 max-w-5xl mx-auto p-6" noValidate>
      <div className="flex justify-between items-start flex-wrap">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditing ? "Edit Promotion" : "Create New Promotion"}
          </h2>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update promotion details"
              : "Create a promotion with tiered rewards for property purchases"}
          </p>
          {isDirty && (
            <p className="text-amber-600 text-sm mt-2">You have unsaved changes</p>
          )}
          {formError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{formError}</p>
            </div>
          )}
          {showSuccess && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">
                {isEditing ? "Promotion updated successfully!" : "Promotion created successfully!"}
              </p>
            </div>
          )}
        </div>
        <Link
          to={"/promotions"}
          className="px-4 py-3 bg-[#79B833] font-medium text-white rounded-full hover:bg-[#6aa82a] transition-colors"
        >
          Go back to Promotions
        </Link>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-[30px] border border-gray-200 p-6">
        <InputField
          label="Promotion Name"
          name="promo_name"
          placeholder="e.g., Ember Mega Property Promo 2026"
          value={formik.values.promo_name}
          onChange={handleFieldChange}
          required
          error={shouldShowError("promo_name") && getFieldError("promo_name")}
        />
      </div>

      {/* Tiers Section */}
      <div className="space-y-8">
        {formik.values.tiers.map((tier, tierIndex) => (
          <div
            key={tierIndex}
            className="border-2 border-gray-200 rounded-[30px] p-6 bg-white hover:border-[#79B833] transition-colors"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-semibold text-gray-800">
                Tier {tierIndex + 1}
              </h4>
              {formik.values.tiers.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTier(tierIndex)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Remove Tier
                </button>
              )}
            </div>

            {/* Tier Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <InputField
                label="Trigger Amount (₦)"
                placeholder="Minimum deposit amount (optional)"
                type="number"
                value={tier.trigger_amount || ""}
                onChange={(e) =>
                  handleUpdateTier(tierIndex, "trigger_amount", e.target.value ? parseFloat(e.target.value) : null)
                }
                error={
                  shouldShowError(`tiers.${tierIndex}.trigger_amount`) &&
                  getFieldError(`tiers.${tierIndex}.trigger_amount`)
                }
              />
              <InputField
                label="Discount Percentage (%)"
                placeholder="Discount percentage (optional)"
                type="number"
                value={tier.percentage || ""}
                onChange={(e) =>
                  handleUpdateTier(tierIndex, "percentage", e.target.value ? parseFloat(e.target.value) : null)
                }
                error={
                  shouldShowError(`tiers.${tierIndex}.percentage`) &&
                  getFieldError(`tiers.${tierIndex}.percentage`)
                }
              />
            </div>

            {/* Reward Groups */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h5 className="text-lg font-medium text-gray-700">Reward Groups</h5>
                <button
                  type="button"
                  onClick={() => handleAddRewardGroup(tierIndex)}
                  className="text-sm text-[#79B833] hover:text-[#6aa82a] font-medium"
                >
                  + Add Reward Group
                </button>
              </div>

              {tier.reward_groups.map((group, groupIndex) => (
                <div key={groupIndex} className="bg-gray-50 rounded-xl p-6 relative">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-gray-700">
                      Reward Group {groupIndex + 1}
                    </span>
                    {tier.reward_groups.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRewardGroup(tierIndex, groupIndex)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Group
                      </button>
                    )}
                  </div>

                  {/* Logic Buttons */}
                  <div className="flex justify-end items-center mb-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateLogic(tierIndex, groupIndex, "AND")}
                        className={`px-4 py-1.5 text-sm rounded-[30px] font-medium transition-colors ${
                          group.logic === "AND"
                            ? "bg-[#79B833] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        AND
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateLogic(tierIndex, groupIndex, "OR")}
                        className={`px-4 py-1.5 text-sm rounded-[30px] font-medium transition-colors ${
                          group.logic === "OR"
                            ? "bg-[#79B833] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        OR
                      </button>
                    </div>
                  </div>

                  {/* Reward Items */}
                  <div className="space-y-4">
                    {group.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-4 items-start">
                        <div className="flex-1">
                          <InputField
                            label={itemIndex === 0 ? "Gift Name" : undefined}
                            placeholder="Enter gift name (e.g., 50kg Bag of Rice)"
                            value={item.name}
                            onChange={(e) =>
                              handleUpdateItem(tierIndex, groupIndex, itemIndex, "name", e.target.value)
                            }
                            error={
                              shouldShowError(
                                `tiers.${tierIndex}.reward_groups.${groupIndex}.items.${itemIndex}.name`
                              ) &&
                              getFieldError(
                                `tiers.${tierIndex}.reward_groups.${groupIndex}.items.${itemIndex}.name`
                              )
                            }
                            required
                          />
                        </div>

                        <div className="w-32">
                          <InputField
                            label={itemIndex === 0 ? "Quantity" : undefined}
                            type="number"
                            placeholder="Qty"
                            value={item.qty}
                            onChange={(e) =>
                              handleUpdateItem(tierIndex, groupIndex, itemIndex, "qty", e.target.value)
                            }
                            error={
                              shouldShowError(
                                `tiers.${tierIndex}.reward_groups.${groupIndex}.items.${itemIndex}.qty`
                              ) &&
                              getFieldError(
                                `tiers.${tierIndex}.reward_groups.${groupIndex}.items.${itemIndex}.qty`
                              )
                            }
                            required
                          />
                        </div>

                        <div className="w-32">
                          <InputField
                            label={itemIndex === 0 ? "item_price (₦)" : undefined}
                            type="number"
                            placeholder="item_price"
                            value={item.item_price || ""}
                            onChange={(e) =>
                              handleUpdateItem(tierIndex, groupIndex, itemIndex, "item_price", e.target.value)
                            }
                            error={
                              shouldShowError(
                                `tiers.${tierIndex}.reward_groups.${groupIndex}.items.${itemIndex}.item_price`
                              ) &&
                              getFieldError(
                                `tiers.${tierIndex}.reward_groups.${groupIndex}.items.${itemIndex}.item_price`
                              )
                            }
                          />
                        </div>

                        {group.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(tierIndex, groupIndex, itemIndex)}
                            className="mt-8 text-red-600 hover:text-red-800 text-xl font-bold"
                            aria-label="Remove item"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddItem(tierIndex, groupIndex)}
                      className="text-sm text-[#79B833] hover:text-[#6aa82a] font-medium transition-colors"
                    >
                      + Add Item to this Group
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Tier Button */}
      <div>
        <button
          type="button"
          onClick={handleAddTier}
          className="flex items-center gap-2 text-[#79B833] hover:text-[#6aa82a] font-medium transition-colors"
        >
          <span className="text-lg">+</span>
          Add New Tier
        </button>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(resetForm());
              onCancel();
            }}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 text-white bg-[#79B833] rounded-full hover:bg-[#79B833]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Promotion"
          ) : (
            "Create Promotion"
          )}
        </button>
      </div>
    </form>
  );
};

export default PromoForm;