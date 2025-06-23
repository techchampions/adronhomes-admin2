import React, { useContext, useState } from "react";
import Header from "../../../general/Header";
import { IoArrowBack, IoArrowForward, IoSearch } from "react-icons/io5";
import { PropertyContext } from "../../../MyContext/MyContext";
import AddLocationModal from "../Site location/AddLocation";
import { ReusableTable } from "../../Tables/Table_one";
import DeleteLeader from "./DeleteLeader";
import AddLeader from "./AddLeader";
import { useGetLeaders } from "../../../utils/hooks/query";
import LoadingAnimations from "../../LoadingAnimations";
import NotFound from "../../NotFound";
import EditLeaderModal from "./EditLeader";
import { LeadershipItem } from "../../../pages/Properties/types/LeadershipDataTypes";

interface Leaders {
  id: number;
  title: string;
  name: string;
}

const LeaderShipSettings = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetLeaders(page);
  const totalPages = data?.data.last_page || 1; // Default to 1 if undefined
  const LeadersData = data?.data.data || [];
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(0);
  const [leaderEditing, setLeaderEditing] = useState<LeadershipItem>({
    id: 0,
    name: "",
    position: "",
    picture: "",
    description: "",
    slug: "",
    created_at: "",
    updated_at: "",
  });
  const { setIsCancelState } = useContext(PropertyContext)!;
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

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
      <EditLeaderModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        leaderData={leaderEditing}
      />
      <DeleteLeader
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        leader={selectedLeader}
      />
      <div className="bg-white p-6 rounded-4xl">
        <ReusableTable activeTab="Leadership" tabs={["Leadership"]}>
          {isLoading ? (
            <LoadingAnimations loading={true} />
          ) : isError || LeadersData.length <= 0 ? (
            <NotFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {LeadersData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-md shadow-sm"
                >
                  <img
                    src={item.picture}
                    alt=""
                    className="rounded-full h-24 w-24 object-cover"
                  />
                  <h3 className="font-semibold mb-1 truncate mt-3">
                    {item.name}
                  </h3>
                  <p className="text-xs line-clamp-1 text-gray-700">
                    {item.position}
                  </p>
                  <div className="flex gap-4 text-sm mt-3 font-semibold">
                    <button
                      className="text-gray-700 hover:underline"
                      onClick={() => {
                        setShowEditModal(true);
                        setLeaderEditing(item);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setSelectedLeader(item.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Pagination */}
          <div className="flex items-center mx-auto gap-3 justify-center mt-10">
            <button
              className={`border border-gray-300 rounded-full p-2 cursor-pointer ${
                page === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-gray-700"
              }`}
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              <IoArrowBack />
            </button>
            {/* <div className="text-sm">
              Page {page} of {totalPages}
            </div> */}
            <div className="flex gap-1 items-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={` h-8 w-8 flex flex-col items-center justify-center rounded-full ${
                    page === i + 1
                      ? "bg-gray-500 text-white"
                      : "hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className={`border border-gray-300 rounded-full p-2 cursor-pointer ${
                page === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-gray-700"
              }`}
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              <IoArrowForward />
            </button>
          </div>{" "}
        </ReusableTable>
      </div>
    </div>
  );
};

export default LeaderShipSettings;
