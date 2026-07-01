import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaXmark } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";
import LoadingAnimations from "../../components/LoadingAnimations";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { fetchProperties } from "../../components/Redux/Properties/properties_Thunk";
import { createEstateCommunity } from "../../components/Redux/estate/estateThunk";
import { PropertyData } from "../Properties/TAbles/Properties_Table";

interface AddEstateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function AddEstateModal({
  isOpen,
  onClose,
  onCreated,
}: AddEstateModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { published } = useSelector((state: RootState) => state.properties);
  const [search, setSearch] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  );
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setSearch("");
    setSelectedPropertyId(null);
    dispatch(fetchProperties({ page: 1, search: "" }));
  }, [dispatch, isOpen]);

  const filteredProperties = useMemo(() => {
    const properties = published.data as PropertyData[];
    const query = search.toLowerCase().trim();
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
  }, [published.data, search]);

  const selectedProperty = useMemo(
    () =>
      (published.data as PropertyData[]).find(
        (property) => property.id === selectedPropertyId,
      ),
    [published.data, selectedPropertyId],
  );

  const handleClose = () => {
    if (creating) return;
    onClose();
  };

  const handleCreateEstate = async () => {
    if (!selectedPropertyId) {
      toast.warning("Please select a property");
      return;
    }

    setCreating(true);

    try {
      const response = await dispatch(
        createEstateCommunity({ propertyId: selectedPropertyId }),
      ).unwrap();
      toast.success(response.message || "Estate community created");
      onCreated?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create estate community");
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-label="Close add estate modal"
      />

      <div className="relative bg-white rounded-[30px] w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 md:px-8 py-6 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-[350] text-2xl text-dark">Add Estate</h2>
            <p className="font-[325] text-sm text-[#767676] mt-1">
              Choose the property that should become an estate community.
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={creating}
            className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center disabled:opacity-50"
          >
            <FaXmark />
          </button>
        </div>

        <div className="px-6 md:px-8 py-4 grid sm:grid-cols-3 gap-3 bg-[#F8F8F8]">
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs text-[#767676]">Published Properties</p>
            <p className="font-[350] text-2xl text-[#79B833]">
              {published.pagination.totalItems || published.data.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs text-[#767676]">Visible Properties</p>
            <p className="font-[350] text-2xl text-[#79B833]">
              {filteredProperties.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs text-[#767676]">Selected Property</p>
            <p className="font-[350] text-sm text-dark truncate">
              {selectedProperty?.name || "None"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
          <section className="border border-gray-200 rounded-3xl overflow-hidden min-h-[430px] flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-[350] text-lg text-dark">Properties</h3>
                  <p className="text-xs text-[#767676]">
                    Click one property to create its estate.
                  </p>
                </div>
              </div>
              <div className="relative">
                <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#767676]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search properties"
                  className="w-full h-11 rounded-full bg-[#F6F6F8] pl-11 pr-4 text-sm outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[490px]">
              {published.loading ? (
                <div className="h-64 flex items-center justify-center">
                  <LoadingAnimations loading={published.loading} />
                </div>
              ) : (
                <table className="w-full">
                  <tbody className="divide-y divide-gray-100">
                    {filteredProperties.map((property) => {
                      const selected = selectedPropertyId === property.id;

                      return (
                        <tr
                          key={property.id}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            selected ? "bg-[#F5FAF0]" : ""
                          }`}
                          onClick={() =>
                            setSelectedPropertyId((currentId) =>
                              currentId === property.id ? null : property.id,
                            )
                          }
                        >
                          <td className="py-4 pl-5 pr-3 w-10">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() =>
                                setSelectedPropertyId((currentId) =>
                                  currentId === property.id ? null : property.id,
                                )
                              }
                              onClick={(event) => event.stopPropagation()}
                              disabled={creating}
                              className="w-4 h-4 accent-[#79B833]"
                            />
                          </td>
                          <td className="py-4 pr-5">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
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
              )}
            </div>
          </section>
        </div>

        <div className="px-6 md:px-8 py-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={creating}
            className="h-11 rounded-full border border-gray-300 px-6 text-sm font-bold text-dark hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateEstate}
            disabled={creating || !selectedPropertyId}
            className="h-11 rounded-full bg-[#79B833] px-6 text-sm font-bold text-white hover:bg-[#6aa22c] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "Creating..." : "Add Estate"}
          </button>
        </div>
      </div>
    </div>
  );
}
