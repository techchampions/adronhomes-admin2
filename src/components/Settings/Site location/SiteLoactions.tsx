import React, { useContext, useState } from "react";
import Header from "../../../general/Header";
import { IoSearch } from "react-icons/io5";
import { PropertyContext } from "../../../MyContext/MyContext";
import AddLocationModal from "./AddLocation";
import DeleteLocationModal from "./DeleteLocation";
import EditLocationModal from "./EditLocation";

interface OfficeLocation {
  id: number;
  title: string;
  address: string;
  phones: string[];
  email: string;
}

const officeData: OfficeLocation[] = Array(9)
  .fill(0)
  .map((_, i) => ({
    id: i,
    title: "Lekki Office",
    address: "34b Freedom way, Ikate, Lekki, Lagos",
    phones: ["+2348051011951", "+2348051011951"],
    email: "telesales@adronhomes",
  }));

const OfficeLocations = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { setIsCancelState } = useContext(PropertyContext)!;

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
      />
      <DeleteLocationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
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
              <h3 className="font-semibold mb-1">{office.title}</h3>
              <p className="text-sm text-gray-700">{office.address}</p>
              <p className="text-sm text-gray-700">
                {office.phones.join(", ")}
              </p>
              <p className="text-sm text-gray-700 mb-3">{office.email}</p>
              <div className="flex gap-4 text-sm font-semibold">
                <button
                  className="text-gray-700 hover:underline"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => setShowDeleteModal(true)}
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
