import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaXmark } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../../components/Redux/store";
import {
  bulkAssignMultiplePromos,
  fetchPromosList,
  selectPromosList,
  selectPromosLoading,
} from "../../components/Redux/gift/promo/promoSlice";
import LoadingAnimations from "../../components/LoadingAnimations";
import { PropertyData } from "./TAbles/Properties_Table";

interface AssignPropertyBenefitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: PropertyData[];
  currentPage: number;
  onAssigned?: () => void;
}

export default function AssignPropertyBenefitsModal({
  isOpen,
  onClose,
  properties,
  onAssigned,
}: AssignPropertyBenefitsModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const promos = useSelector(selectPromosList);
  const promosLoading = useSelector(selectPromosLoading);
  const [propertySearch, setPropertySearch] = useState("");
  const [promoSearch, setPromoSearch] = useState("");
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<number[]>([]);
  const [selectedPromoIds, setSelectedPromoIds] = useState<number[]>([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    dispatch(fetchPromosList());
    setPropertySearch("");
    setPromoSearch("");
    setSelectedPropertyIds([]);
    setSelectedPromoIds([]);
  }, [dispatch, isOpen]);

  const filteredProperties = useMemo(() => {
    const query = propertySearch.toLowerCase().trim();
    if (!query) return properties;

    return properties.filter((property) =>
      [
        property.name,
        property.street_address,
        property.state,
        property.lga,
        property.category,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [properties, propertySearch]);

  const promoOptions = useMemo(() => {
    return promos
      .map((promo: any) => ({
        id: Number(promo.id),
        name: promo.name || promo.promo_name || "Unnamed Promotion",
        meta: promo.created_at ? `Created ${promo.created_at}` : "Promotion",
      }))
      .filter((promo: any) => promo.id);
  }, [promos]);

  const filteredPromos = useMemo(() => {
    const query = promoSearch.toLowerCase().trim();
    if (!query) return promoOptions;

    return promoOptions.filter((promo) =>
      [promo.name, promo.meta].some((value) =>
        String(value).toLowerCase().includes(query),
      ),
    );
  }, [promoOptions, promoSearch]);

  const toggleProperty = (propertyId: number) => {
    setSelectedPropertyIds((currentIds) =>
      currentIds.includes(propertyId)
        ? currentIds.filter((id) => id !== propertyId)
        : [...currentIds, propertyId],
    );
  };

  const togglePromo = (promoId: number) => {
    setSelectedPromoIds((currentIds) =>
      currentIds.includes(promoId)
        ? currentIds.filter((id) => id !== promoId)
        : [...currentIds, promoId],
    );
  };

  const toggleVisibleProperties = () => {
    const visibleIds = filteredProperties.map((property) => property.id);
    const allVisibleSelected = visibleIds.every((id) =>
      selectedPropertyIds.includes(id),
    );

    setSelectedPropertyIds((currentIds) =>
      allVisibleSelected
        ? currentIds.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...currentIds, ...visibleIds])),
    );
  };

  const toggleVisiblePromos = () => {
    const visibleIds = filteredPromos.map((promo) => promo.id);
    const allVisibleSelected = visibleIds.every((id) =>
      selectedPromoIds.includes(id),
    );

    setSelectedPromoIds((currentIds) =>
      allVisibleSelected
        ? currentIds.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...currentIds, ...visibleIds])),
    );
  };

  const handleClose = () => {
    if (assigning) return;
    onClose();
  };

  const handleAssign = async () => {
    if (selectedPropertyIds.length === 0) {
      toast.warning("Please select at least one property");
      return;
    }

    if (selectedPromoIds.length === 0) {
      toast.warning("Please select at least one promotion");
      return;
    }

    setAssigning(true);

    try {
      await dispatch(
        bulkAssignMultiplePromos({
          promo_ids: selectedPromoIds,
          property_ids: selectedPropertyIds,
        }),
      ).unwrap();

      toast.success(
        `${selectedPromoIds.length} promotion${
          selectedPromoIds.length === 1 ? "" : "s"
        } assigned to ${
          selectedPropertyIds.length
        } propert${selectedPropertyIds.length === 1 ? "y" : "ies"}`,
      );
      onAssigned?.();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to assign promotions",
      );
    } finally {
      setAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-label="Close assignment modal"
      />

      <div className="relative bg-white rounded-[30px] w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 md:px-8 py-6 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-[350] text-2xl text-dark">Assign Promotion</h2>
            <p className="font-[325] text-sm text-[#767676] mt-1">
              Select properties, choose promotions, then assign them in bulk.
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={assigning}
            className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center disabled:opacity-50"
          >
            <FaXmark />
          </button>
        </div>

        <div className="px-6 md:px-8 py-4 grid md:grid-cols-4 gap-3 bg-[#F8F8F8]">
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs text-[#767676]">Assignment Type</p>
            <p className="font-[350] text-xl text-[#79B833] capitalize">
              Promotion
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs text-[#767676]">Properties Selected</p>
            <p className="font-[350] text-2xl text-[#79B833]">
              {selectedPropertyIds.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs text-[#767676]">Promotions Selected</p>
            <p className="font-[350] text-2xl text-[#79B833]">
              {selectedPromoIds.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs text-[#767676]">Total Assignments</p>
            <p className="font-[350] text-2xl text-dark">
              {selectedPropertyIds.length * selectedPromoIds.length}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <section className="border border-gray-200 rounded-3xl overflow-hidden min-h-[500px] flex flex-col">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-[350] text-lg text-dark">Properties</h3>
                    <p className="text-xs text-[#767676]">
                      {selectedPropertyIds.length} properties selected
                    </p>
                  </div>
                  <button
                    onClick={toggleVisibleProperties}
                    disabled={assigning}
                    className="text-xs text-white font-bold disabled:opacity-50 bg-[#79B833] hover:bg-[#6aa22c] disabled:cursor-not-allowed px-3 py-1 rounded-full"
                  >
                    Select All
                  </button>
                </div>
                <div className="relative">
                  <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#767676]" />
                  <input
                    value={propertySearch}
                    onChange={(event) => setPropertySearch(event.target.value)}
                    placeholder="Search properties"
                    className="w-full h-11 rounded-full bg-[#F6F6F8] pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[520px]">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-100">
                    {filteredProperties.map((property) => {
                      const selected = selectedPropertyIds.includes(
                        property.id,
                      );

                      return (
                        <tr
                          key={property.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleProperty(property.id)}
                        >
                          <td className="py-4 pl-5 pr-3 w-10">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleProperty(property.id)}
                              onClick={(event) => event.stopPropagation()}
                              disabled={assigning}
                              className="w-4 h-4 accent-[#79B833]"
                            />
                          </td>
                          <td className="py-4 pr-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                <img
                                  src={
                                    property.display_image ||
                                    "/default-property-image.jpg"
                                  }
                                  alt={property.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-[350] text-sm text-dark truncate">
                                  {property.name}
                                </p>
                                <p className="font-[325] text-xs text-[#767676] truncate">
                                  ₦{property.price?.toLocaleString()} ·{" "}
                                  {property.street_address || "No address"}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="border border-gray-200 rounded-3xl overflow-hidden min-h-[500px] flex flex-col">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-[350] text-lg text-dark">Promotions</h3>
                    <p className="text-xs text-[#767676]">
                      {selectedPromoIds.length} promotions selected
                    </p>
                  </div>
                  <button
                    onClick={toggleVisiblePromos}
                    disabled={assigning || promosLoading}
                    className="text-xs text-white font-bold disabled:opacity-50 bg-[#79B833] px-3 py-1 rounded-full hover:bg-[#6aa22c] disabled:cursor-not-allowed"
                  >
                    Select All
                  </button>
                </div>
                <div className="relative">
                  <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#767676]" />
                  <input
                    value={promoSearch}
                    onChange={(event) => setPromoSearch(event.target.value)}
                    placeholder="Search promotions"
                    className="w-full h-11 rounded-full bg-[#F6F6F8] pl-11 pr-4 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[520px]">
                {promosLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <LoadingAnimations loading={promosLoading} />
                  </div>
                ) : (
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-100">
                      {filteredPromos.map((promo) => {
                        const selected = selectedPromoIds.includes(promo.id);

                        return (
                          <tr
                            key={promo.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => togglePromo(promo.id)}
                          >
                            <td className="py-4 pl-5 pr-3 w-10">
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => togglePromo(promo.id)}
                                onClick={(event) => event.stopPropagation()}
                                disabled={assigning}
                                className="w-4 h-4 accent-[#79B833]"
                              />
                            </td>
                            <td className="py-4 pr-5">
                              <p className="font-[350] text-sm text-dark">
                                {promo.name}
                              </p>
                              <p className="font-[325] text-xs text-[#767676] truncate">
                                {promo.meta}
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="px-6 md:px-8 py-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={assigning}
            className="h-11 rounded-full border border-gray-300 px-6 text-sm font-bold text-dark hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={
              assigning ||
              promosLoading ||
              selectedPropertyIds.length === 0 ||
              selectedPromoIds.length === 0
            }
            className="h-11 rounded-full bg-[#79B833] px-6 text-sm font-bold text-white hover:bg-[#6aa22c] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {assigning ? "Assigning..." : "Assign Promotion"}
          </button>
        </div>
      </div>
    </div>
  );
}
