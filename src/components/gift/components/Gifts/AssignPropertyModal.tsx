// src/components/gift/AssignPropertyModal.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { assignGiftToProperty, bulkAssignMultipleGifts } from "../../../Redux/gift/gift_thunk";
import { AppDispatch, RootState } from "../../../Redux/store";
import { fetchProperties } from "../../../Redux/Properties/properties_Thunk";
import LoadingAnimations from "../../../LoadingAnimations";

interface PropertyOption {
  id: number;
  name: string;
  address: string;
  price: number;
  display_image: string | null;
}

interface AssignPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftId: number;
  giftName: string;
  quantityPerProperty: number;
  measurementUnit: string;
  onAssignSuccess?: () => void;
}

export const AssignPropertyModal: React.FC<AssignPropertyModalProps> = ({
  isOpen,
  onClose,
  giftId,
  giftName,
  quantityPerProperty,
  measurementUnit,
  onAssignSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [assigning, setAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<number[]>([]);

  // Redux
  const { published } = useSelector((state: RootState) => state.properties);

  // Transform properties
  const properties: PropertyOption[] = useMemo(() => {
    if (!published.data) return [];
    return (published.data as any[]).map((prop) => ({
      id: prop.id,
      name: prop.name,
      address: `${prop.street_address || ""}, ${prop.lga || ""}, ${prop.state || ""}`.trim(),
      price: prop.price || 0,
      display_image: prop.display_image || null,
    }));
  }, [published.data]);

  // Filter (client-side for instant feel, backend also called)
  const filteredProperties = useMemo(() => {
    if (!searchTerm.trim()) return properties;
    const term = searchTerm.toLowerCase();
    return properties.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.address.toLowerCase().includes(term)
    );
  }, [properties, searchTerm]);

  const paginatedProperties = useMemo(() => {
    const itemsPerPage = 10;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage]);

  const totalPages = Math.ceil(filteredProperties.length / 10);
  const totalItems = filteredProperties.length;
  const selectedCount = selectedPropertyIds.length;

  // Fetch properties when modal opens
  useEffect(() => {
    if (isOpen) {
      resetModalState();
      dispatch(
        fetchProperties({
          page: 1,
          search: "",
        })
      );
    }
  }, [isOpen, dispatch]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setCurrentPage(1);
      dispatch(
        fetchProperties({
          page: 1,
          search: searchTerm,
        })
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, isOpen, dispatch]);

  // Pagination change
  useEffect(() => {
    if (!isOpen) return;
    dispatch(
      fetchProperties({
        page: currentPage,
        search: searchTerm,
      })
    );
  }, [currentPage, isOpen, dispatch, searchTerm]);

  const resetModalState = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setSelectedPropertyIds([]);
  };

  const handleClose = () => {
    resetModalState();
    onClose();
  };

  const togglePropertySelection = (id: number) => {
    setSelectedPropertyIds((prev) =>
      prev.includes(id)
        ? prev.filter((propertyId) => propertyId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPropertyIds.length === paginatedProperties.length) {
      setSelectedPropertyIds([]);
    } else {
      setSelectedPropertyIds(paginatedProperties.map((p) => p.id));
    }
  };

  const handleAssignProperties = async () => {
    if (selectedPropertyIds.length === 0) {
      toast.warning("Please select at least one property");
      return;
    }

    setAssigning(true);

    try {
      const promises = selectedPropertyIds.map((propertyId) =>
        dispatch(
          bulkAssignMultipleGifts({
            gift_ids: [giftId],
            property_ids: [propertyId],
          })
        ).unwrap()
      );

      await Promise.all(promises);

      toast.success(`Gift successfully assigned to ${selectedPropertyIds.length} propert${selectedPropertyIds.length > 1 ? "ies" : "y"}!`);

      onAssignSuccess?.();
      handleClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to assign gift");
    } finally {
      setAssigning(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Assign Gift to Properties</h2>
          <p className="text-gray-500 mt-1">
            Assign <span className="font-semibold text-[#79B833]">{giftName}</span> to selected properties
          </p>

          {/* Gift Info */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 rounded-2xl p-5">
            <div>
              <p className="text-xs text-gray-500">Quantity per Property</p>
              <p className="font-semibold text-lg text-gray-900">
                {quantityPerProperty} {measurementUnit}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Properties Found</p>
              <p className="font-semibold text-lg text-gray-900">{totalItems}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Selected</p>
              <p className="font-semibold text-lg text-[#79B833]">{selectedCount}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-8 pt-6 pb-4">
          <input
            type="text"
            placeholder="Search by property name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:border-transparent text-sm"
          />
        </div>

        {/* Table Container - Scrollable */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0 px-8">
          <div className="flex-1 overflow-auto border border-gray-200 rounded-2xl">
            {published.loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingAnimations loading={true} />
              </div>
            ) : paginatedProperties.length > 0 ? (
              <table className="w-full min-w-full">
                <thead className="sticky top-0 bg-white z-10 border-b border-gray-200 shadow-sm">
                  <tr>
                    <th className="w-12 py-4 px-4">
                      <input
                        type="checkbox"
                        checked={
                          paginatedProperties.length > 0 &&
                          selectedPropertyIds.length === paginatedProperties.length
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-[#79B833] focus:ring-[#79B833] accent-[#79B833]"
                      />
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">Property</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">Address</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProperties.map((property) => (
                    <tr
                      key={property.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedPropertyIds.includes(property.id)}
                          onChange={() => togglePropertySelection(property.id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#79B833] focus:ring-[#79B833] accent-[#79B833]"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {property.display_image ? (
                            <img
                              src={property.display_image}
                              alt={property.name}
                              className="w-10 h-10 rounded-xl object-cover border border-gray-100"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                              🏠
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{property.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{property.address}</td>
                      <td className="py-4 px-4 font-semibold text-gray-900">
                        ₦{property.price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-5xl mb-4">🏠</div>
                <p className="text-gray-500 text-lg">No properties found</p>
                {searchTerm && (
                  <p className="text-gray-400 mt-1">Try adjusting your search term</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 rounded-b-3xl mt-auto shadow-[0_-4px_10px_rgb(0,0,0,0.05)] ">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Pagination Info */}
            {totalPages > 1 && (
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <p>
                  Page <span className="font-medium text-gray-900">{currentPage}</span> of{" "}
                  <span className="font-medium text-gray-900">{totalPages}</span>
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleClose}
                disabled={assigning}
                className="flex-1 sm:flex-none px-8 py-3.5 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 font-medium transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleAssignProperties}
                disabled={selectedCount === 0 || assigning || published.loading}
                className={`flex-1 sm:flex-none px-8 py-3.5 rounded-2xl font-medium transition-all ${
                  selectedCount > 0 && !assigning && !published.loading
                    ? "bg-[#79B833] hover:bg-[#6ba52d] text-white shadow-md"
                    : "bg-gray-300 cursor-not-allowed text-gray-500"
                }`}
              >
                {assigning ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Assigning...
                  </div>
                ) : (
                  `Assign to ${selectedCount} Propert${selectedCount !== 1 ? "ies" : "y"}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};