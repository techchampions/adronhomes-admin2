import React, { useContext, useState } from "react";
import Header from "../../../general/Header";
import { IoSearch } from "react-icons/io5";
import { PropertyContext } from "../../../MyContext/MyContext";
import AddLocationModal from "./AddLocation";
import DeleteLocationModal from "./DeleteLocation";
import EditLocationModal from "./EditLocation";
import { useGetOfficeLocations } from "../../../utils/hooks/query";
import { OfficeLocation } from "../../../pages/Properties/types/OfficeLocationsTypes";

const OfficeLocations = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [officeItem, setOfficeItem] = useState<OfficeLocation>();
  const { setIsCancelState } = useContext(PropertyContext)!;
  const { data, isLoading, isError } = useGetOfficeLocations();
  const officeData = data?.data || [];

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <Header
        title="Settings"
        subtitle="Manage settings"
        history={true}
        buttonText="Add Location"
        onButtonClick={() => {
          setShowModal(!showModal);
          setIsCancelState(false);
        }}
      />
      <AddLocationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      <EditLocationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={officeItem}
      />
      <DeleteLocationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        item={officeItem}
      />
      <div className="bg-white p-6 rounded-4xl">
        <div className="flex justify-between mb-5">
          <h2 className="text-lg font-semibold mb-4">Office Locations</h2>

          <div className="relative px-4 py-2 flex flex-row-reverse items-center gap-1 rounded-full bg-gray-100 focus:outline-none">
            <input
              type="text"
              placeholder="Search locations"
              className="w-full "
            />
            <IoSearch />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {officeData.map((office) => (
            <div key={office.id} className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold mb-1">{office.office_name}</h3>
              <p className="text-sm text-gray-700">{office.office_address}</p>
              <p className="text-sm text-gray-700">
                {office.first_contact || ""},{office.second_contact || ""},
                {office.third_contact || ""}
              </p>
              <p className="text-sm text-gray-700 mb-3">{office.email}</p>
              <div className="flex gap-4 text-sm font-semibold">
                <button
                  className="text-gray-700 hover:underline"
                  onClick={() => {
                    setOfficeItem(office);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => {
                    setOfficeItem(officeItem);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfficeLocations;
