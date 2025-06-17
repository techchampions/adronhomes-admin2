import React, { useContext, useState } from "react";
import Header from "../../../general/Header";
import { IoSearch } from "react-icons/io5";
import { PropertyContext } from "../../../MyContext/MyContext";
import AddLocationModal from "../Site location/AddLocation";
import { ReusableTable } from "../../Tables/Table_one";
import DeleteLeader from "./DeleteLeader";
import AddLeader from "./AddLeader";

interface Leaders {
  id: number;
  title: string;
  name: string;
}

const LeadersData: Leaders[] = Array(9)
  .fill(0)
  .map((_, i) => ({
    id: i,
    title: "AMD Housing and Design",
    name: "Sumbo Oguntoye",
  }));

const LeaderShipSettings = () => {
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { setIsCancelState } = useContext(PropertyContext)!;

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <Header
        title="Settings"
        subtitle="Manage settings"
        history={true}
        buttonText="Add New Leader"
        onButtonClick={() => {
          setShowLeaderModal(!showLeaderModal);
          setIsCancelState(false);
        }}
      />
      <AddLeader
        isOpen={showLeaderModal}
        onClose={() => setShowLeaderModal(false)}
      />
      <DeleteLeader
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
      <div className="bg-white p-6 rounded-4xl">
        <ReusableTable activeTab="Leadership" tabs={["Leadership"]}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LeadersData.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-md shadow-sm">
                <img
                  src="/profile.svg"
                  alt=""
                  className="rounded-full h-24 w-24"
                />
                <h3 className="font-semibold mb-1">{item.name}</h3>
                <p className="text-sm text-gray-700">{item.title}</p>
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
        </ReusableTable>
      </div>
    </div>
  );
};

export default LeaderShipSettings;
